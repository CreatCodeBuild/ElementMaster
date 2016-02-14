'use strict'

var elementMasterServices = angular.module('elementMasterServices', []);

elementMasterServices.factory('canvasService', function($http) {
	// console.log('elementMasterServices::canvasService');
	return {
		func: function() {
			console.log('Just Another Service');
		}
	};
});
