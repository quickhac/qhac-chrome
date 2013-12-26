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
          GradeService.setGrades(gradeData, id);
          console.log($scope);
          $scope.message = "Logging in was a success.";
          $location.path("/user/" + id + "/cycle/3");
          $scope.$apply();
        });
      }, function() {
        $scope.message = "Failed to log in. Check your username/password.";
        $scope.$apply();
      });
    };
  }])
  .controller('CycleController', ['$scope', '$routeParams', 'GradeService', function($scope, $routeParams, GradeService) {
    $scope.user_id = $routeParams.user_id;
    $scope.cycle_number = $routeParams.cycle_number;
  }]);