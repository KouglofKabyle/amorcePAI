// Template HTML
var template = require( "./patients.html" );
var formulaire = require( "./formulaireNouveauPatient.html")
require( "./patients.css" );

// Définition du composant
module.exports = function(moduleAngular) {

    var proxyNF = require("../proxy.js")(moduleAngular);

    var ctrlPatients = function( $http, proxyNF ) {

        var ctrl=this;

        ctrl.nouveauPatient = {
            "patientNumber": "",
            "patientName": "",
            "patientForname":"",
            "patientSex": "",
            "patientBirthday": "",
            "patientFloor": "",
            "patientStreet": "",
            "postalCode": "",
            "patientCity": ""
            };

        ctrl.check = false;
        ctrl.affecterInfirmier = {
            "patient": "",
            "infirmier": ""
        };

        this.submitPatient = function(){
            console.log(ctrl.nouveauPatient);
            proxyNF.ajouterNouveauPatient(ctrl.nouveauPatient);
            if(ctrl.check == true && ctrl.affecterInfirmier.infirmier!=="") {
                ctrl.affecterInfirmier.patient = ctrl.nouveauPatient.patientNumber;
                proxyNF.affecterPatient(ctrl.affecterInfirmier);
            }
        };
    };

    // Construire une balise <infirmier>
    moduleAngular.component( "patient", {
        'template'    : template,
        bindings    : {
            data: "<"
        },
        'controller'    : ctrlPatients
    });

    //Construire une balise <formlaire-new-patient>
    moduleAngular.component( "formulaireNewPatient", {
        'template'    : formulaire,
        bindings    : {
            data: "<"
        },
        'controller'    : ctrlPatients
    });
};