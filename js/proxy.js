	var proxyNF = function($http){

	// Message d'accueil
	console.log("Hello ! this is proxy !");

	// Récupère le XML
	this.getData = function(src) {
		return $http.get(src).then( processData );
	}

	// Retourne les objets Infirmiers et Patients
	function processData(response){
		var xmlContent = response.data;
		var objectInfirmiers = [];
		var objectPatients   = [];
		var objectCabinet    = [];

		var parser = new DOMParser();
		var doc    = parser.parseFromString(xmlContent , 'text/xml');

		// Récupération et construction du tableau d'objets "Cabinet"
		// l'indice du tableau est son nom
		var cabinet = Array.prototype.slice.apply(doc.querySelectorAll('cabinet'), []);
		cabinet.forEach( function(cab)	{
			objectCabinet[cab] = {
				nom : cab.querySelector( "cabinet>nom" ).textContent,
				adresse : {
					numero: 	cab.querySelector("cabinet>adresse>numero").textContent,
					rue: 		cab.querySelector("cabinet>adresse>rue").textContent,
					ville: 		cab.querySelector("cabinet>adresse>ville").textContent,
					codePostal: cab.querySelector("cabinet>adresse>codePostal").textContent
					}
			}
		});


		// Récupération et construction du tableau d'objets "Infirmiers"
		// l'indice du tableau est son n°id
		var infirmiers = Array.prototype.slice.apply(doc.querySelectorAll('infirmier'), []);
		infirmiers.forEach(function(unInfirmer) {
			objectInfirmiers.push ( {
				id: unInfirmer.getAttribute("id"),
				nom : 	unInfirmer.querySelector("nom").textContent,
				prenom: unInfirmer.querySelector("prenom").textContent,
				photo: 	unInfirmer.querySelector("photo").textContent,
				patients: [] // initialisation du tableau vide
			})
		});

		// Récupérer et construction du tableau d'objets "patient",
		// l'indice du tableau est le n° de securité sociale du patient
		var patients   = Array.prototype.slice.apply(doc.querySelectorAll('patient'), []);
		patients.forEach(function(unPatient){
			objectPatients.push( {
				id: unPatient.querySelector("numero").textContent,
				nom: unPatient.querySelector("nom").textContent,
				prenom: unPatient.querySelector("prenom").textContent,
				sexe: unPatient.querySelector("sexe").textContent,
				date : unPatient.querySelector("naissance").textContent,
				adresse: {
							rue: unPatient.querySelector("rue").textContent,
							ville: unPatient.querySelector("ville").textContent,
							codePostal: unPatient.querySelector("codePostal").textContent
						},
				infirmier: unPatient.querySelector("visite").getAttribute("intervenant")
				// renseigne sur l'ID de infirmier qui s'occupe du patient,
				// si null: le patient "n'appartient" à aucune infirmier: il n'a pas subi d'intervention !
			})
		});

		// Remplir le tableau des patients pour chaque infirmier
		// le patient "courant" est ajouté
		objectPatients.forEach(function(patient){
			if (patient.infirmier != null){
				objectInfirmiers.forEach(function(unInfirmier){
					if (unInfirmier.id == patient.infirmier){
						unInfirmier.patients.push(patient)
					}
				});
			}
		});

		return {
			objectInfirmiers: objectInfirmiers,
			objectPatients: objectPatients,
			objectCabinet: objectCabinet
		}

	};

	// Ajoute dans le XML un nouveau patient
	this.ajouterNouveauPatient = function(nouveauPatient){
        return $http({
            method: 'POST',
            url: "/addPatient",
            data: nouveauPatient,
            header: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
            // success callback
            function(response){
                console.log("proxy.js => Salami ! Nouveau patient ajouté");
                },
            // error callback
            function(response){
                console.log("proxy.js => Erreur : nouveau patient non ajouté");
                }
            );
        };

    // Suppression d'un patient
    this.supprimerPatient = function(id) {
    	return $http({
    		method: 'POST',
    		url: "/removePatient",
    		data: id,
    		header: {"Content-Type": "application/json"}
    	}).then(
    		function(response){
    			console.log("proxy.js => Jambonneau ! Patient supprimé");
    		},
    		function(response){
    			console.log("proxy.js => Erreur : patient non supprimé");
    		}
    	);
    }

    // Affecte à un patient un id d'infirmier
    this.affecterPatient = function(affecterInfirmier) {
		return $http({
			method: 'POST',
			url: "/affectation",
			data: affecterInfirmier
        }).then(
        	function(response) {
        		console.log("proxy.js => Par la saucisse de Morteau ! Nouveau patient affecté");
        	},
        	function(response) {
        		console.log("proxy.js => Affectation non réussie");
        	}
        );
    };

    // Désaffecte un infirmier d'un patient
    this.desaffecterPatient = function(id){
    	return $http({
    		method: 'POST',
    		url: "/desaffectation",
    		data: id,
    		header: {"Content-Type": "application/json"}
    	}).then(
    		function(response){
    			console.log("proxy.js => Diot ! Patient désaffecté !")
    		},
    		function(response){
    			console.log("proxy.js => ...désaffectation non réussie")
    		}
    	);
    }
};
proxyNF.$inject = [ "$http" ]; //Injection de dépendances


module.exports = function(moduleAngular) {
	var id = "proxyNF";
	moduleAngular.service(id, proxyNF);
};


//----------ancien code avec Tableaux associatifs--------------
		// // Parser le XML
		// var parser = new DOMParser();
		// var doc    = parser.parseFromString(xmlContent , 'text/xml');

		// // Récupération et construction du tableau d'objets "Cabinet"
		// // l'indice du tableau est son nom
		// var cabinet = Array.prototype.slice.apply(doc.querySelectorAll('cabinet'), []);
		// cabinet.forEach( function(cab)	{
		// 	objectCabinet[cab] = {
		// 		nom : cab.querySelector( "cabinet>nom" ).textContent,
		// 		adresse : {
		// 			numero: 	cab.querySelector("cabinet>adresse>numero").textContent,
		// 			rue: 		cab.querySelector("cabinet>adresse>rue").textContent,
		// 			ville: 		cab.querySelector("cabinet>adresse>ville").textContent,
		// 			codePostal: cab.querySelector("cabinet>adresse>codePostal").textContent
		// 			}
		// 	}
		// });


		// // Récupération et construction du tableau d'objets "Infirmiers"
		// // l'indice du tableau est son n°id
		// var infirmiers = Array.prototype.slice.apply(doc.querySelectorAll('infirmier'), []);
		// infirmiers.forEach(function(unInfirmer) {
		// 	objectInfirmiers[unInfirmer.getAttribute("id")] = {
		// 		nom : 	unInfirmer.querySelector("nom").textContent,
		// 		prenom: unInfirmer.querySelector("prenom").textContent,
		// 		photo: 	unInfirmer.querySelector("photo").textContent,
		// 		patients: [] // initialisation du tableau vide
		// 	}
		// });

		// // Récupérer et construction du tableau d'objets "patient",
		// // l'indice du tableau est le n° de securité sociale du patient
		// var patients   = Array.prototype.slice.apply(doc.querySelectorAll('patient'), []);
		// patients.forEach(function(unPatient){
		// 	objectPatients[unPatient.querySelector("numero").textContent]= {
		// 		nom: 	unPatient.querySelector("nom").textContent,
		// 		prenom: unPatient.querySelector("prenom").textContent,
		// 		sexe: 	unPatient.querySelector("sexe").textContent,
		// 		date : 	unPatient.querySelector("naissance").textContent,
		// 		adresse: [{
		// 					rue: 	unPatient.querySelector("rue").textContent,
		// 					ville: 	unPatient.querySelector("ville").textContent,
		// 					codePostal: unPatient.querySelector("codePostal").textContent
		// 				}],
		// 		infirmier: unPatient.querySelector("visite").getAttribute("intervenant")
		// 		// renseigne sur l'ID de infirmier qui s'occupe du patient,
		// 		// si null: le patient "n'appartient" à aucune infirmier: il n'a pas subu d'intervention !
		// 	}
		// });

		// // Remplir le tableau des patients pour chaque infirmier
		// // le patient "courant" est ajouté

		// objectPatients.forEach(function(patient){
		// 	if (patient.infirmier != null){
		// 		objectInfirmiers[patient.infirmier].patients.push(patient);
		// 	}
		// });