    // Template HTML
var template = require( "./cabinetMedical.html" );
require( "./cabinetMedical.css" );

// Définition du composant
module.exports = function(moduleAngular) {

    var proxyNF = require( "../proxy.js" )(moduleAngular);

    var controller = function( proxyNF, $http ) {

        // Message d'accueil
        console.log("Hey !! This is controller, man...j'essaye de te récupérer les données..." );

        // Récupérer les objets Cabinet, Infirmiers, Patients
        var ctrl = this;
        proxyNF.getData(this.src).then( function(cabinetJS) {
            ctrl.data = cabinetJS;
            console.log(ctrl.data);
        });

        // Affichage formulaire -----------------
        ctrl.formulaire = false;
         
         ctrl.showFormulaire= function(){
            if (ctrl.formulaire==true){
                ctrl.formulaire = false;
            }
            else {
                ctrl.formulaire = true;
            }
            console.log(ctrl.formulaire);
         }

        ctrl.patientsRestants = false;

        ctrl.showPatientsRestants= function(){
            if (ctrl.patientsRestants==true){
                ctrl.patientsRestants = false;
            }
            else {
                ctrl.patientsRestants = true;
            }
            console.log(ctrl.patientsRestants);
         }

    };


    require("../infirmiers/infirmiers.js")(moduleAngular);
    require("../patients/patients.js")(moduleAngular);


    // Construire une balise <cabinet-medical>
    moduleAngular.component( "cabinetMedical", {
        'template'    : template,
        bindings    : {
            src: "@",
            titre    : "@"
        },
        'controller'    : controller
    });
};