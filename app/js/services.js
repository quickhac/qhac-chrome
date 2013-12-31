'use strict';

/* Services */
angular.module('myApp.services', []).
  factory('GradeService', function() {
    var GradeService = {};

    GradeService.login = function(id, district, success, fail) { // FIXME clarify which district. or make it work with both
      var userInformation = GradeService.getUserInformation(id);
      var id = id;
      var username = userInformation.username;
      var password = userInformation.password;
      var district = district;

      GradeRetriever.login(district, username, password, id, function() {
        GradeRetriever.getAverages(district, function(html) {
          var gradeData = GradeParser.parseAverages(district, html);
          GradeService.setOriginalGrades(id, gradeData);
          success(html);
        });
      });
    };

    GradeService.setUserInformation = function(id, key, value) {
      var users = store.get('qhac-users') || {};
      var info = GradeService.getUserInformation(id);
      info[key] = value;
      users[id] = info;
      store.set('qhac-users', users);
    };

    GradeService.getUserInformation = function(id) {
      var users = store.get('qhac-users');
      if(users === undefined) { store.set('qhac-users', {}); return GradeService.getUserInformation(id); }
      var user = users[id];
      return user || {};
    };

    GradeService.getAllUsers = function() {
      return _.values(store.get('qhac-users') || {});
    };

    GradeService.deleteUser = function(id) {
      var users = store.get('qhac-users') || {};
      store[id] = undefined;
      store.set('qhac-users', users);
    }; // todo bug does this work

    GradeService.getOriginalGrades = function(id) {
      return store.get('qhac-grades-original-' + id);
    };

    GradeService.setOriginalGrades = function(id, json) {
      store.set('qhac-grades-original-' + id, json);
      store.set('qhac-grades-' + id, json);
    };

    GradeService.getGrades = function(id) {
      return store.get('qhac-grades-' + id);
    };

    GradeService.setGrades = function(id, json) {
      store.set('qhac-grades-' + id, json);
    };

    GradeService.revertChanges = function(id) {
      this.setGrades(id, this.getOriginalGrades());
    };

    // TODO FIXME BUG: don't hardcode cyle numbers
    GradeService.getCycle = function(course, cycleNumber) {
      var semesterIndex = cycleNumber <= 3 ? 0 : 1;
      var cycleIndex = (cycleNumber > 3 ? cycleNumber - 3 : cycleNumber) - 1;
      return course.semesters[semesterIndex].cycles[cycleIndex];
    };

    // TODO FIXME BUG: don't hardcode cycle numbers
    GradeService.getOverallCycleInformation = function(id, cycleNumber) {
      if(cycleNumber > 6 || cycleNumber < 1) { return false; }
      var json = this.getGrades(id);
      return _.map(json, function(course) {
        var courseName = course.title;
        var id = course.courseId;
        var average = GradeService.getCycle(course, cycleNumber).average;
        return { id: id, name: courseName, average: average};
      });
    };

    GradeService.getInformationSpecificCycleCourse = function(id, courseId, cycleNumber, success, fail) {
      var district = Districts[GradeService.getUserInformation(id).district];

      var json = this.getGrades(id);
      var course = _.find(json, function(course) {
        return course.courseId === courseId;
      });
      var cycle = this.getCycle(course, cycleNumber);
      if(cycle.urlHash === undefined) { return false; }
      GradeRetriever.getClassGrades(district, cycle.urlHash, null, function (html) {
        if(html === "Could not decode student id.") {
          GradeService.login(id, district, function() {
            GradeService.getInformationSpecificCycleCourse(id, courseId, cycleNumber, success, fail);
          });
        } else {
          success(GradeParser.parseClassGrades(district, html, cycle.urlHash, null, null));
        }
      }, function () {
        fail(); // todo redo
      });
    };

    GradeService.getOverview = function(id) {
      var json = this.getGrades(id);
      return _.map(json, function(course) {
        var filteredCourse = {};
        filteredCourse = _.pick(course, 'title', 'teacherEmail', 'teacherName', 'courseId');
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
    return GradeService;

  }).factory('CacheService', function() {
    var CacheService;

    return CacheService;
  });