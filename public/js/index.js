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


var x = {y: 2};

function f(x) {
    x.y = 3;
    console.log(x);
}

function f2(x) {
    x = 1;
}

f(x);
console.log(x);

f2(x);
console.log(x);
