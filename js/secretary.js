
var angular = require("angular"), angularMaterial=require( "angular-material" );
require( "angular-material/angular-material.css" );

var ngDraggable = require('../bower_components/ngDraggable/ngDraggable.js');

var cabinetModule = angular.module( "cabinet", [ angularMaterial, 'ngDraggable'] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});

require( "./cabinetMedical/cabinetMedical.js" )(cabinetModule);
