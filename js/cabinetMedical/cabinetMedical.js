    // Template HTML
var template = require( "./cabinetMedical.html" );
require( "./cabinetMedical.css" );

// Définition du composant
module.exports = function(moduleAngular) {

    var proxyNF = require( "../proxy.js" )(moduleAngular);

    var controller = function( proxyNF, $http, $mdDialog, $mdMedia ) {

        // Message d'accueil
        console.log("Hey !! This is controller, man...j'essaye de te récupérer les données..." );

        // Récupérer les objets Cabinet, Infirmiers, Patients
        var ctrl = this;
        proxyNF.getData(this.src).then( function(cabinetJS) {
            ctrl.data = cabinetJS;
            console.log(ctrl.data);
        });

        // Mettre à jour les données
        this.updateInfirmiers = function() {
            proxyNF.getData(this.src).then( function(cabinetJS) {
            ctrl.data = cabinetJS;
            console.log("CabinetMedical.js => mise à jour des données");
        });
        };

        // Récupérer l'identifiant de l'infirmier dont l'onglet est sélectionné
        this.ongletInfirmierActif = "";
        this.getOngletInfirmier = function(id) {
            if(ctrl.ongletInfirmierActif.isUndefined) {
                console.log("pas encore");
            } else {
                ctrl.ongletInfirmierActif = id;
                console.log("onglet infirmier sélectionné", ctrl.ongletInfirmierActif);
            }
        }

        // Affecter un Infirmier en droppant un patient non affecté
        // dans la zone de l'infirmier !
        this.onDropPatient = function($data) {
            ctrl.affecterInfirmier ={
                "patient": $data,
                "infirmier": ctrl.ongletInfirmierActif
            }
            proxyNF.affecterPatient(ctrl.affecterInfirmier).then(
                function(){
                    console.log("cabinetMedical.js => drop de patient !");
                    ctrl.updateInfirmiers();
                });
        }

        // Supprimer un patient
        this.supprimerPatient = function(id) {
            var identifiant = {
                'patientNumber': id
            }
            var confirm = $mdDialog.confirm()
              .title('Voulez-vous définitivement supprimer ce patient?')
              .ariaLabel('Suppression patient')
              .ok('supprimer')
              .cancel('annuler');
            $mdDialog.show(confirm).then(function() {
                proxyNF.supprimerPatient(identifiant).then( function(){
                    ctrl.updateInfirmiers();
                });
            });
        }

        // Actions sur un patient existant
        this.isOpen = false;
        this.modifierPatient = function(ev){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            $mdDialog.show({
              template: require("../patients/formulaireNouveauPatient.html"),
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: useFullScreen
            })
          };


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

        // Affichage patients restants
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
   // require("../patientMap/patientMap.js")(moduleAngular);


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