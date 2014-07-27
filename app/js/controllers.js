'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  // see partial login.html
  controller('LoginController', ['$scope', 'UserService', '$location', function($scope, UserService, $location) {
    $scope.district_mapping = { 'Round Rock ISD': 'roundrock', 'Austin ISD': 'austin' };
    $scope.districts = ['Round Rock ISD' , 'Austin ISD'];
    $scope.message = "";
    $scope.submit = function() {
      /* district_information is the whole district object, however, we just want to persist the basic name (roundrock or austin) */
      var district_information = Districts[this.district_mapping[this.district]];
      var id = this.id; // look at the HTML: this magically appears from there
      var username = this.username;
      var password = this.password;
      var district = this.district
      var _this = this;
      gs.ready().then(function() {
        gs.attemptLogin(district_information, username, password).then(function(retData) {
          UserService.setUserInformation(id, 'district', district);
          UserService.setUserInformation(id, 'id', id);
          UserService.setUserInformation(id, 'username', username);
          UserService.setUserInformation(id, 'password', password);
          UserService.setUserInformation(id, 'name', retData[1]['name']);
          var grades =  gs.getGradesYear();
          UserService.setOriginalGrades(id, grades);
        });
      });
      $location.path("/user/" + id + "/cycle/3");
      //$scope.$apply();
    };
  }])
  // see partial cycles.html
  .controller('CycleController', ['$scope', '$routeParams', 'UserService', '$location', function($scope, $routeParams, UserService, $location) {
    $scope.user_id = $routeParams.user_id;
    $scope.cycle_number = $routeParams.cycle_number; // this comes from the URL
    $scope.overall_courses = UserService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
    $scope.course_data = {};
    //console.log($scope.course_data);
    $scope.overview = UserService.getOverview($scope.user_id);
    //$scope.sample = "sample"; // this is to test that directive
    $scope.user_information = UserService.getUserInformation($scope.user_id);
    $scope.other_students = UserService.getAllUsers();
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
      UserService.getInformationSpecificCycleCourse($scope.user_id, course_id, $scope.cycle_number, function(data) {
        $scope.course_data = data;
        $scope.current_course = course_id;
        $scope.$apply();
      });
    };
    $scope.refresh = function() {
      console.log('hi?')
      $scope.overall_courses = UserService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
      if($scope.current_course) {
        $scope.viewDetailed($scope.current_course);
      }
    };
  }]);