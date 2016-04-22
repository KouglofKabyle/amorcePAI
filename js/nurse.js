
var angular = require("angular"), angularMaterial=require( "angular-material" );
require( "angular-material/angular-material.css" );

var agendaInfirmierModule = angular.module( "agenda", [ angularMaterial ] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});

require( "./agendaInfirmier/agendaInfirmier.js" )(agendaInfirmierModule);
