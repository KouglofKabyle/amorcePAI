// Template HTML
var template = require( "./patients.html" );
var formulaire = require( "./formulaireNouveauPatient.html")
var patientMapTemplate = require("./patientMap.html");



// Définition du composant
module.exports = function(moduleAngular) {
    require( "./patients.css" );
    var mapsapi = require( 'google-maps-api' )( 'AIzaSyDsF_LpIDzCDd0ieieyl2gfJ2xMW3u27CY' );

    var proxyNF = require("../proxy.js")(moduleAngular);

    var ctrlPatients = function( $http, proxyNF, $mdDialog, $mdMedia) {

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

        ctrl.sexe = [
        {sexe: 'M'}, {sexe: 'F'}
        ];

        ctrl.check = false;
        ctrl.affecterInfirmier = {
            "patient": "",
            "infirmier": ""
        };



        this.submitPatient = function(){
            console.log(ctrl.nouveauPatient);
            proxyNF.ajouterNouveauPatient(ctrl.nouveauPatient).then(
                function(){
                    console.log("patient.js => test d'affectation");
                    ctrl.onValidation();
                });
            if(ctrl.check == true && ctrl.affecterInfirmier.infirmier!=="") {
                ctrl.affecterInfirmier.patient = ctrl.nouveauPatient.patientNumber;
                proxyNF.affecterPatient(ctrl.affecterInfirmier).then(
                function(){
                    console.log("patient.js => test d'affectation");
                    console.log(ctrl.onValidation);
                    ctrl.onValidation();
                });
            }

        };

        // boite dialogue réponse suite à l'ajout d'un patient
        ctrl.showAlert = function(ev) {
         	   var existePatient = false;

               ctrl.data.objectPatients.forEach(function(patient){
               		console.log(patient.id);
                    if(patient.id == ctrl.nouveauPatient.patientNumber) {
                        existePatient = true;
                    }
               });
               if (!existePatient){
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Information')
                    .textContent(ctrl.nouveauPatient.patientForname +' '+ctrl.nouveauPatient.patientName+ ' a été ajouté avec succès aux patients')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Retour!')
                    .targetEvent(ev)
                );
                console.log("salut");
                }else{
                    $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Alerte')
                    .textContent("Le patient \" " + ctrl.nouveauPatient.patientForname +' '+ctrl.nouveauPatient.patientName+' \" est déjà enregistré(e)')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Retour!')
                    .targetEvent(ev)
                );
              };
        };



        //-- Affichage de la carte 
             mapsapi().then( function( maps ) {
              var maCarte=  new google.maps.Map(document.getElementById('map')
                , { center: new google.maps.LatLng(45.193861, 5.768843)
                  , zoom: 11
                  }
                );
             var marker1= new google.maps.Marker(
                { position  : new google.maps.LatLng(45.193861, 5.768843)
                , map       : maCarte
                , title     : "Je suis ici!"
                } );
             var marker2= new google.maps.Marker(
                { position  : new google.maps.LatLng(44.9333, 4.9)
                , map       : maCarte
                , title     : "Je suis ici!"
                } );


             //-- Affichage des marqueurs des patients déjà présent
            var adresse = "80 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France";

              var adresses = []; // tableau de chaine de caracteres de l'adresse de chaque patient
              ctrl.data.objectPatients.forEach(function(patient){
                patient.adresse.forEach(function(adresse){
                        var stringAdresse = "1 "+ adresse.rue +", "+adresse.codePostal+" "+adresse.ville +", France";
                        adresses.push(stringAdresse);
                })
              });

              // geocodage
                geocoder = new google.maps.Geocoder();

                 adresses.forEach(function(uneAdresse){
                    geocoder.geocode(
                               {'address': uneAdresse}
                         , function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                    new google.maps.Marker({
                                            map: maCarte,
                                            position: results[0].geometry.location
                                          });
                                } else {console.error("Error geocoding:", status);}
                            }
                    );
                })







           

            });
    
      //-------------------------
    };

    // Construire une balise <patient>
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
            onValidation: "&",
            data: "<"
        },
        'controller'    : ctrlPatients
    });

    moduleAngular.component( "patientMap", {
        'template'    : patientMapTemplate,
        bindings    : {
            onValidation: "&",
            data: "<"
        },
        'controller'    : ctrlPatients
    });


};