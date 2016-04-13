
var angular = require("angular"), angularMaterial=require( "angular-material" );
var angularIcons = require("angular-material-icons")
require( "angular-material/angular-material.css" );

var cabinetModule = angular.module( "cabinet", [ angularMaterial, angularIcons ] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});;

require( "./cabinetMedical/cabinetMedical.js" )(cabinetModule);


