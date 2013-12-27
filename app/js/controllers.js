'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('LoginController', ['$scope', 'GradeService', '$location', function($scope, GradeService, $location) {
    $scope.district_mapping = { 'Round Rock ISD': 'roundrock', 'Austin ISD': 'austin' };
    $scope.districts = ['Round Rock ISD' , 'Austin ISD'];
    $scope.message = "";
    $scope.submit = function() {
      var district_information = Districts[this.district_mapping[this.district]];
      var id = this.id;
      GradeService.setUserInformation(id, 'district', this.district_mapping[this.district]); // zees is not good todo bug fixme, doesn't preserve the methods??!!
      GradeService.setUserInformation(id, 'id', id);
      GradeService.setUserInformation(id, 'username', this.username);
      GradeService.setUserInformation(id, 'password', this.password);
      GradeService.login(id, district_information, function() {
        $location.path("/user/" + id + "/cycle/3");
        $scope.$apply();
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
        $scope.course_data = data;
        $scope.$apply();
      });
    };
  }]);