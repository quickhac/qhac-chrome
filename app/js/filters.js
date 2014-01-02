'use strict';

/* Filters */
/* don't worry about any of this, these just came by default and I'm not doing anything with them */
angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
