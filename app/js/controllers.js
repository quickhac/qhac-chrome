'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  // see partial login.html
  controller('LoginController', ['$scope', 'GradeService', '$location', function($scope, GradeService, $location) {
    $scope.district_mapping = { 'Round Rock ISD': 'roundrock', 'Austin ISD': 'austin' };
    $scope.districts = ['Round Rock ISD' , 'Austin ISD'];
    $scope.message = "";
    $scope.submit = function() {
      /* district_information is the whole district object, however, we just want to persist the basic name (roundrock or austin) */
      var district_information = Districts[this.district_mapping[this.district]];
      var id = this.id; // look at the HTML: this magically appears from there
      GradeService.setUserInformation(id, 'district', this.district_mapping[this.district]);
      GradeService.setUserInformation(id, 'id', id);
      GradeService.setUserInformation(id, 'username', this.username);
      GradeService.setUserInformation(id, 'password', this.password);
      GradeService.login(id, district_information, function(html) {
        GradeService.setUserInformation(id, 'name', GradeParser.getStudentName(district_information, html));
        $location.path("/user/" + id + "/cycle/3");
        $scope.$apply(); // so that things will update and work
      }, function() {
        $scope.message = "Failed to log in. Check your username/password.";
        $scope.$apply(); // so that things will update and work
      });
    };
  }])
  // see partial cycles.html
  .controller('CycleController', ['$scope', '$routeParams', 'GradeService', '$location', function($scope, $routeParams, GradeService, $location) {
    $scope.user_id = $routeParams.user_id;
    $scope.cycle_number = $routeParams.cycle_number; // this comes from the URL
    $scope.overall_courses = GradeService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
    $scope.course_data = {};
    //console.log($scope.course_data);
    $scope.overview = GradeService.getOverview($scope.user_id);
    $scope.sample = "sample"; // this is to test that directive
    $scope.user_information = GradeService.getUserInformation($scope.user_id);
    $scope.other_students = GradeService.getAllUsers();
    $scope.current_course = null;
    
    $scope.goToNextCycle = function() {
      var next_cycle = parseInt($scope.cycle_number) + 1;
      $location.path("/user/" + $scope.user_id + "/cycle/" + next_cycle);
    };
    $scope.goToPreviousCycle = function() {
      var previous_cycle = parseInt($scope.cycle_number) - 1;
      $location.path("/user/" + $scope.user_id + "/cycle/" + previous_cycle);
    };

    $scope.viewDetailed = function(course_id) {
      GradeService.getInformationSpecificCycleCourse($scope.user_id, course_id, $scope.cycle_number, function(data) {
        $scope.course_data = data;
        $scope.current_course = course_id;
        $scope.$apply();
      });
    };
    $scope.refresh = function() {
      console.log('hi?')
      $scope.overall_courses = GradeService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
      if($scope.current_course) {
        $scope.viewDetailed($scope.current_course);
      }
    };
  }]);