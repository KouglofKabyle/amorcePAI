// Template HTML connexion Secrétaire
var template = require( "./cabinetMedical.html" );
// Template HTML connexion agendaInfirmiers
var templateAgendaInfirmier = require("./templateAgendaInfirmier.html");

require( "./cabinetMedical.css" );

// Définition du composant
module.exports = function(moduleAngular) {

    // Dépendance
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

        // Désaffecter un patient
        this.desaffecterPatient = function(id){
            var identifiant = {
                'patientNumber': id
            };
            var confirm = $mdDialog.confirm()
              .title('Voulez-vous désaffecter ce patient?')
              .ariaLabel('Désaffectation patient')
              .ok('désaffecter')
              .cancel('annuler');
              $mdDialog.show(confirm).then( function(){
                proxyNF.desaffecterPatient(identifiant)
                    .then( function(){
                        ctrl.updateInfirmiers();
                    });
              });
        }

        // Supprimer un patient
        this.supprimerPatient = function(id) {
            var identifiant = {
                'patientNumber': id
            };
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

        /*// Formulaire de modification d'un patient
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
          };*/


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


        /* this.patientPosition={"lat" : 37.4224764,"lng" : -122.0842499}*/
         var mapsapi = require( 'google-maps-api' )('AIzaSyDsF_LpIDzCDd0ieieyl2gfJ2xMW3u27CY');
         ctrl.cartePatients=null;
         mapsapi().then( function( maps ) {
                ctrl.cartePatients =
                    new google.maps.Map(document.getElementById('map'),
                    {
                        center: new google.maps.LatLng(45.193861, 5.768843),
                        zoom: 2,
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                      }
                )
            });
         ctrl.genererMarkerPatient = function(adresse) {
            console.log(adresse);
            var stringAdresse =
                "1 "+ adresse.rue
                +", "+adresse.codePostal
                +" "+adresse.ville
                +", France";
            console.log(stringAdresse);
            var geocoder = new google.maps.Geocoder();
            mapsapi().then( function( maps ) {
                geocoder.geocode( {'address': stringAdresse }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK)
                        {
                        var marker = new google.maps.Marker({
                            map: ctrl.cartePatients,
                            position: results[0].geometry.location
                        });
/*                        ctrl.patientPosition = marker.position;
*/                    } else {
                      alert('Geocode was not successful for the following reason: ' + status);
                    }
                })
                // fin de la promise de la map
            });
        }

    // controller ends here
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
    // Construire une balise <agenda-infirmier>
    moduleAngular.component( "agendaInfirmier", {
        'template'    : templateAgendaInfirmier,
        bindings    : {
            src : "@",
            titre : "@",
        },
        'controller'  : controller
    });
};