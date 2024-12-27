const { db } = require("./../config/database");
const { validationResult } = require('express-validator');

const queryAsync = (query, values = []) =>
    new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
        }
        resolve(results);
    });
});

exports.getVehiculeCount = async (req, res) => {

    try {
          const query = `SELECT COUNT(id) AS nbre_vehicule FROM vehicules`;
          const [result] = await queryAsync(query);
      
          return res.status(200).json({
            message: 'Le nombre total de véhicules a été récupéré avec succès.',
            data: result,
          });
    } catch (error) {
          console.error('Erreur lors de la récupération des chauffeurs :', error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            error: error.message,
        });
    }
};

exports.getVehicule = async (req, res) => {
    try {
        const query = `SELECT v.*, marque.nom_marque, modeles.modele, cv.nom_cat FROM vehicules v
                            INNER JOIN marque ON v.id_marque = marque.id_marque
                            LEFT JOIN modeles ON v.id_modele = modeles.id_modele
                            INNER JOIN categorie_vehicules cv ON v.id_cat_vehicule = cv.id`;

            const chauffeurs = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste des véhicules récupérés avec succès',
                data: chauffeurs,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des chauffeurs :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            });
        }
};

exports.postVehicule = async (req, res) => {

    try {
        let img = null;
        if (req.files && req.files.length > 0) {
            img = req.files.map((file) => file.path.replace(/\\/g, '/')).join(',');
        }

        // Validation des données
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Déstructuration des champs du corps de la requête
        const {
            immatriculation,
            numero_ordre,
            id_marque,
            id_modele,
            variante,
            num_chassis,
            annee_fabrication,
            annee_circulation,
            id_cat_vehicule,
            id_type_permis_vehicule,
            longueur,
            largeur,
            hauteur,
            poids,
            id_couleur,
            capacite_carburant,
            capacite_radiateur,
            capacite_carter,
            nbre_place,
            nbre_portes,
            nbre_moteur,
            cylindre,
            nbre_cylindre,
            disposition_cylindre,
            id_type_carburant,
            regime_moteur_vehicule,
            consommation_carburant,
            turbo,
            date_service,
            km_initial,
            nbre_chev,
            id_transmission,
            id_climatisation,
            pneus,
            valeur_acquisition,
            lubrifiant_moteur,
            id_etat,
            user_cr
        } = req.body;

        // Préparation de la requête SQL
        const query = `
            INSERT INTO vehicules (
                immatriculation, numero_ordre, id_marque, id_modele, variante, num_chassis,
                annee_fabrication, annee_circulation, id_cat_vehicule, id_type_permis_vehicule, img,
                longueur, largeur, hauteur, poids, id_couleur, capacite_carburant, capacite_radiateur,
                capacite_carter, nbre_place, nbre_portes, nbre_moteur, cylindre, nbre_cylindre, disposition_cylindre,
                id_type_carburant, regime_moteur_vehicule, consommation_carburant, turbo, date_service, km_initial, nbre_chev,
                id_transmission, id_climatisation, pneus, valeur_acquisition, lubrifiant_moteur, id_etat, user_cr
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Préparation des valeurs à insérer
        const values = [
            immatriculation, numero_ordre, id_marque, id_modele, variante, num_chassis,  
            annee_fabrication, annee_circulation, id_cat_vehicule, id_type_permis_vehicule, img,
            longueur, largeur, hauteur, poids, id_couleur, capacite_carburant, capacite_radiateur,
            capacite_carter, nbre_place, nbre_portes, nbre_moteur, cylindre, nbre_cylindre, disposition_cylindre, 
            id_type_carburant, regime_moteur_vehicule, consommation_carburant, turbo, date_service, km_initial, nbre_chev,
            id_transmission, id_climatisation, pneus, valeur_acquisition, lubrifiant_moteur, id_etat, user_cr
        ];

        // Exécution de la requête d'insertion
        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Véhicule ajouté avec succès',
            data: { id: result.insertId, immatriculation, numero_ordre },
        });

    } catch (error) {
        console.error('Erreur lors de l’ajout du véhicule :', error);

        // Gestion des erreurs SQL
        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Un véhicule avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout du véhicule.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};
