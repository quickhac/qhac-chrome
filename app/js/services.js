'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('GradeService', function() {
    var GradeService = {};
    GradeService.getRawGrades = function() {
      return store.get('qhac-grades');
    };
    GradeService.setGrades = function(json, id) {
      store.set('qhac-grades-' + id, json);
    };
    GradeService.getGrades = function(id) {
      store.get('qhac-grades-' + id);
    }
    return GradeService;
  });
