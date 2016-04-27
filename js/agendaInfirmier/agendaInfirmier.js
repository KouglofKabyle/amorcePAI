// Template HTML connexion agendaInfirmiers
var templateAgendaInfirmier = require("./templateAgendaInfirmier.html");
require( "./templateAgendaInfirmier.css" );

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
            ctrl.data = cabinetJS.objectPatients;
            console.log(ctrl.data);
        });


        this.infirmierSelectionne = "";
/*        // Mettre à jour les données
        this.updateInfirmiers = function() {
            proxyNF.getData(this.src).then( function(cabinetJS) {
            ctrl.data = cabinetJS.objectPatients;
            console.log("CabinetMedical.js => mise à jour des données");
        });
        };
*/

         this.patientPosition={"lat" : 37.4224764,"lng" : -122.0842499}
         var mapsapi = require( 'google-maps-api' )('AIzaSyDsF_LpIDzCDd0ieieyl2gfJ2xMW3u27CY');
         ctrl.cartePatients=null;
         mapsapi().then( function( maps ) {
                ctrl.cartePatients =
                    new google.maps.Map(document.getElementById('map'),
                    {
                        center: new google.maps.LatLng(45.193861, 5.768843),
                        zoom: 11,
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

        ctrl.displayInfo = function(ev) {
             var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            $mdDialog.show({
              template: require("./info.html"),
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: useFullScreen
            })

         }

    // controller ends here
    };

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