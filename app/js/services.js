'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('GradeService', function() {
    var GradeService = {};

    GradeService.setUserInformation = function(id, key, value) {
      var users = store.get('qhac-users') || {};
      var info = GradeService.getUserInformation(id);
      info[key] = value;
      users[id] = info;
      store.set('qhac-users', users);
    };

    GradeService.getUserInformation = function(id) {
      var users = store.get('qhac-users');
      if(users === undefined) { store.set('qhac-users', {}); GradeService.getUserInformation(id); }
      var user = users[id];
      return user || {};
    }
    GradeService.getOriginalGrades = function(id) {
      return store.get('qhac-grades-original-' + id);
    };

    GradeService.setOriginalGrades = function(id, json) {
      console.log(json);
      console.log(id);
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

    GradeService.getCycle = function(course, cycleNumber) {
      var semesterIndex = cycleNumber <= 3 ? 0 : 1;
      var cycleIndex = (cycleNumber > 3 ? cycleNumber - 3 : cycleNumber) - 1;
      return course.semesters[semesterIndex].cycles[cycleIndex];
    };

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
      //var district = GradeService.getUserInformation(id).district;
      var district = Districts.roundrock; // debug todo wtf
      var json = this.getGrades(id);
      var course = _.find(json, function(course) {
        return course.courseId === courseId;
      });
      var cycle = this.getCycle(course, cycleNumber);
      if(cycle.urlHash === undefined) { return false; }
      GradeRetriever.getClassGrades(district, cycle.urlHash, null, function (html) {
        success(GradeParser.parseClassGrades(district, html, cycle.urlHash, null, null));
      }, function () {
        fail(); // todo redo
      });
    };
        
    return GradeService;
  });
