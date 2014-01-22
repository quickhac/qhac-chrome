'use strict';

/* Directives */


angular.module('myApp.directives', []).
  // http://jsfiddle.net/joshdmiller/NDFHg/
  /*
    Below is an angular directive for editing items in place (like grades). This defines a new HTML Element:
    "edit-in-place". The value of this edit-in-place HTML element is set by the attribute "value". On a single click,
    it will switch to editing mode and edit the value, which will be persisted as the user types (yay angular). It will
    exit editing mode either on lack of focus, escape, or enter.
  */
  directive('editInPlace', function() {
    return {
      restrict: 'E',
      scope: { value: '=' },
      template: '<td ng-click="edit()" ng-bind="value"></td><input style="display:none;" ng-model="value"></input>',
      link: function($scope, element, attrs) {
        var inputElement = angular.element(element.children()[1]);
        var displayElement = angular.element(element.children()[0]);

        element.addClass('edit-in-place');
        $scope.edit = function() {
          displayElement.css("display", "none");
          inputElement.css("display", "inline");
          inputElement[0].focus();
        };
        console.log(inputElement);
        inputElement.prop('onblur', function() {
          inputElement.css("display", "none");
          displayElement.css("display", "inline");
        });
        inputElement.bind("keydown keypress", function(event) {
          if((event.which === 13 || event.keyCode === 27) && inputElement.css("display") !== "none") {
            inputElement.css("display", "none");
            displayElement.css("display", "inline");
          };
        });
      }
    };
  });