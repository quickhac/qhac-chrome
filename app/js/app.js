'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
/* colons represent wildcards, are accessible to the controller */
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/login.html', controller: 'LoginController'});
  $routeProvider.when('/user/:user_id/cycle/:cycle_number', {templateUrl: 'partials/cycles_cool.html', controller: 'CycleController'});
  $routeProvider.when('/user/:user/course/:course', {templateUrl: 'partials/courses.html', controller: 'CourseController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);