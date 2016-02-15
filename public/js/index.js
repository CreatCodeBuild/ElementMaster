'use strict';

// Declare app level module which depends on views, and components
var elementMasterApp = angular.module('elementMasterApp', [
    'ngRoute',
    'elementMasterDirectives']);

elementMasterApp.config(['$routeProvider', function($routeProvider) {
    console.log('routeProvider');
    $routeProvider.
    when('/', {
        // templateUrl: 'UIComponents/ToolDetail.html',
        // controller: 'navigationBarController'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);

