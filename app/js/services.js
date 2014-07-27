'use strict';

/* Services */
angular.module('myApp.services', []).
  factory('UserService', function($rootScope) {
    var UserService = {};
    /*
      So here's a weird design decision on the user storing. It's stored as an Object instead of an array, like this:
      {
        440019: {
          name: "yash",
          id: 440019,
          awesomeness: 9001
        },
        440326: {
          name: "someone else",
          id: 440326,
          awesomeness: "debatable"
        }
      }
      The advantage of this is that accessing a user by ID is O(1) instead of O(n). Of course, in retrospect this
      seems stupid, because there aren't going to be more than 4-5 students, so this might be changed in the future.
      But hey, this is why setUserInformation, getUserInformation, and deleteUser have some weirdness.
    */
    UserService.setUserInformation = function(id, key, value) {
      var users = store.get('qhac-users') || {}; // can't use getallusers because we need to get the whole object
      var user = UserService.getUserInformation(id) || {}; // O(1)! yay?
      user[key] = value; // change the one key we need to change
      users[id] = user;
      store.set('qhac-users', users);
    };

    UserService.getUserInformation = function(id) {
      var users = store.get('qhac-users');
      if(users === undefined) { store.set('qhac-users', {}); return UserService.getUserInformation(id); }
      var user = users[id];
      return user || undefined;
    };

    UserService.getAllUsers = function() {
      return _.values(store.get('qhac-users') || {}); // this is going to be for student selection, so this converts into an array of values
    };

    UserService.deleteUser = function(id) {
      var users = store.get('qhac-users') || {};
      store[id] = undefined;
      store.set('qhac-users', users);
    }; // todo bug does this work


    /*
      The second (and more understandable) design decision was to have "original grades" and simply "grades". Original grades just contain
      the original response from HAC, just in case we want to revert from that. (Because the primary grade store might have some grade changes).
    */
    UserService.getOriginalGrades = function(id) {
      return store.get('qhac-grades-original-' + id);
    };

    UserService.setOriginalGrades = function(id, json) {
      store.set('qhac-grades-original-' + id, json);
      store.set('qhac-grades-' + id, json);
    };

    UserService.getGrades = function(id) {
      return store.get('qhac-grades-' + id);
    };

    UserService.setGrades = function(id, json) {
      store.set('qhac-grades-' + id, json);
    };

    UserService.revertChanges = function(id) {
      this.setGrades(id, this.getOriginalGrades());
    };

    // TODO FIXME BUG: don't hardcode cyle numbers
    UserService.getCycle = function(course, cycleNumber) {
      var semesterIndex = cycleNumber <= 3 ? 0 : 1;
      var cycleIndex = (cycleNumber > 3 ? cycleNumber - 3 : cycleNumber) - 1;
      return course.semesters[semesterIndex].cycles[cycleIndex];
    };

    // TODO FIXME BUG: don't hardcode cycle numbers
    /*
      Outputs something like the following:
      [
        {
          id: ____,
          name: "Lorem Ipsum PreAP",
          average: 50
        },
        {
          id: ____,
          name: "Lorem Ipsum PreAP",
          average: 50
        }
      ]
    */
    UserService.getOverallCycleInformation = function(id, cycleNumber) {
      if(cycleNumber > 6 || cycleNumber < 1) { return false; }
      var json = this.getGrades(id);
      return _.map(json, function(course) {
        var courseName = course.title;
        var id = course.id;
        var average = UserService.getCycle(course, cycleNumber).average;
        return { id: id, name: courseName, average: average};
      });
    };

    /*
      Below gets the data for a specific course and cycle. Does not change anything.
      First it finds the course from the courseId by searching through the course list.
      Then it gets the class grades (if we're not logged in anymore, we login first and try again)
    */
    UserService.getInformationSpecificCycleCourse = function(id, courseId, cycleNumber, success, fail) {
      var district = Districts[UserService.getUserInformation(id).district];

      var json = this.getGrades(id);
      var course = _.find(json, function(course) {
        return course.id === courseId;
      });
      var cycle = this.getCycle(course, cycleNumber);
      if(cycle.urlHash === undefined) { return false; }
      var specific_grades = $rootScope.gs.getGradesCycle(cycle.urlHash);
      specific_grades.courseId = course.id;
      success(specific_grades);
    };

    UserService.getOverview = function(id) {
      var json = this.getGrades(id);
      return _.map(json, function(course) {
        var filteredCourse = {};
        filteredCourse = _.pick(course, 'title', 'teacherEmail', 'teacherName', 'id');
        filteredCourse.semesters = _.map(course.semesters, function(semester) {
          var filteredSemester = _.pick(semester, 'average', 'examGrade', 'examIsExempt');
          filteredSemester.cycles = _.map(semester.cycles, function(cycle) {
            return cycle.average;
          });
          return filteredSemester;
        });
        return filteredCourse;
      });
    };
    return UserService;

  }).factory('CacheService', function() {
    var CacheService;

    return CacheService;
  });