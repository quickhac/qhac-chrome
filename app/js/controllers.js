'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  // see partial login.html
  controller('LoginController', ['$scope', 'UserService', '$location', '$rootScope', function($scope, UserService, $location, $rootScope) {
    $scope.districts = _.map(Districts, function(district_obj) { return district_obj.name; });
    $scope.submit = function() {
      /* district_information is the whole district object, however, we just want to persist the basic name (roundrock or austin) */
      var district_information = _.findWhere(Districts, {name: this.district });
      var id = this.id; // look at the HTML: this magically appears from there
      var username = this.username;
      var password = this.password;
      var district = this.district;
      var _this = this;
      $rootScope.gs = new GradeService();
      $rootScope.gs.ready().then(function() {
        $rootScope.gs.attemptLogin(district_information, username, password).then(function(retData) {
          UserService.setUserInformation(id, 'district', district);
          UserService.setUserInformation(id, 'id', id);
          UserService.setUserInformation(id, 'username', username);
          UserService.setUserInformation(id, 'password', password);
          UserService.setUserInformation(id, 'name', retData[1]['name']);
          var grades =  $rootScope.gs.getGradesYear();
          UserService.setOriginalGrades(id, grades);
        });
      });
      $location.path("/user/" + id + "/cycle/3");
    };
  }])
  // see partial cycles.html
  .controller('CycleController', ['$scope', '$routeParams', 'UserService', '$location', '$rootScope', function($scope, $routeParams, UserService, $location, $rootScope) {
    $scope.user_id = $routeParams.user_id;
    $scope.cycle_number = $routeParams.cycle_number; // this comes from the URL
    $scope.overall_courses = UserService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
    $scope.course_data = {};
    $scope.overview = UserService.getOverview($scope.user_id);
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
        console.log(data);
        console.log(course_id);
        $scope.course_data = data;
        $scope.current_course = course_id;
      });
    };
    $scope.refresh = function() {
      $scope.overall_courses = UserService.getOverallCycleInformation($scope.user_id, $scope.cycle_number);
      if($scope.current_course) {
        $scope.viewDetailed($scope.current_course);
      }
    };
  }]);