
var angular = require("angular"), angularMaterial=require( "angular-material" );
require( "angular-material/angular-material.css" );

var ngDraggable = require('../bower_components/ngDraggable/ngDraggable.js');

// Module pour la gestion des infrimiers & patients
var cabinetModule = angular.module( "cabinet", [ angularMaterial, 'ngDraggable'] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});
require( "./cabinetMedical/cabinetMedical.js" )(cabinetModule);

// Module pour l'affichage des patients
var agendaInfirmierModule = angular.module( "agenda", [ angularMaterial ] )
		.config(function($mdThemingProvider) {
  			$mdThemingProvider.theme('default');
		});
require( "./agendaInfirmier/agendaInfirmier.js" )(agendaInfirmierModule);
