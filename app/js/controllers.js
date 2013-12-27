'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('LoginController', ['$scope', 'GradeService', '$location', function($scope, GradeService, $location) {
    $scope.district_mapping = { 'RRISD': Districts.roundrock, 'AISD': Districts.austin };
    $scope.districts = ['RRISD' , 'AISD'];
    $scope.message = "";
    $scope.submit = function() {
      var username = this.username;
      var password = this.password;
      var id = this.id;
      var district_information = this.district_mapping[this.district];
      GradeRetriever.login(district_information, username, password, id, function() {
        GradeRetriever.getAverages(district_information, function(data) {
          var gradeData = GradeParser.parseAverages(district_information, data);
          GradeService.setOriginalGrades(id, gradeData);
          GradeService.setUserInformation(id, 'district', district_information); // zees is not good todo bug fixme, doesn't preserve the methods??!!
          GradeService.setUserInformation(id, 'id', id);
          GradeService.setUserInformation(id, 'username', username);
          GradeService.setUserInformation(id, 'password', password);
          $location.path("/user/" + id + "/cycle/3");
          $scope.$apply();
        });
      }, function() {
        $scope.message = "Failed to log in. Check your username/password.";
        $scope.$apply();
      });
    };
  }])
  .controller('CycleController', ['$scope', '$routeParams', 'GradeService', '$location', function($scope, $routeParams, GradeService, $location) {
    $scope.user_id = $routeParams.user_id;
    $scope.cycle_number = $routeParams.cycle_number;
    $scope.overall_courses = GradeService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
    $scope.next_cycle = parseInt($scope.cycle_number) + 1;
    $scope.previous_cycle = parseInt($scope.cycle_number) - 1;
    $scope.course_data = {};
    $scope.goToNextCycle = function() {
      $location.path("/user/" + $scope.user_id + "/cycle/" + $scope.next_cycle);
    };
    $scope.goToPreviousCycle = function() {
      $location.path("/user/" + $scope.user_id + "/cycle/" + $scope.previous_cycle);
    };

    $scope.viewDetailed = function(course_id) {
      GradeService.getInformationSpecificCycleCourse($scope.user_id, course_id, $scope.cycle_number, function(data) {
        $scope.course_data = data; // incomplete fixme
        $scope.$apply();
      });
    };
  }]);