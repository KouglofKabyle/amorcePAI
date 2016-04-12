// Template HTML
var template = require( "./infirmiers.html" );
require( "./infirmiers.css" );

// Définition du composant
module.exports = function(moduleAngular) {

    var proxyNF = require( "../proxy.js" )(moduleAngular);

    var ctrlInfirmiers = function( ) {

    }
    // Construire une balise <infirmier>
    moduleAngular.component( "infirmier", {
        'template'    : template,
        bindings    : {
            titre   : "@",
            data    : "<"
        },
        controller    : ctrlInfirmiers
    })
}