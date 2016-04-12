
var angular = require("angular"), angularMaterial=require( "angular-material" );
require( "angular-material/angular-material.css" );

var cabinetModule = angular.module( "cabinet", [ angularMaterial ] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});;

require( "./cabinetMedical/cabinetMedical.js" )(cabinetModule);


