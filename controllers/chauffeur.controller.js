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


exports.getChauffeurCount = async(req, res) => {

    try {
        const query = `SELECT COUNT(id) AS nbre_chauffeur FROM chauffeurs`

        const chauffeurs = await queryAsync(query);
        return res.status(200).json({
            message: 'Le count est récupéré avec succès',
            data: chauffeurs,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des chauffeurs :', error);
    
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
        });
    }
}

exports.getChauffeur = async (req, res) => {
    try {
        const query = `SELECT ch.*, s.nom_site FROM chauffeurs ch
                            LEFT JOIN affectations a ON ch.id_chauffeur = a.id_chauffeur
                            LEFT JOIN sites s ON a.id_site = s.id_site`;

            const chauffeurs = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste des chauffeurs récupérée avec succès',
                data: chauffeurs,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des chauffeurs :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            });
        }
    };

exports.postChauffeur = async (req, res) => {
    
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }

        const profil = req.files.map((file) => file.path.replace(/\\/g, '/')).join(',');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            matricule,
            nom,
            prenom,
            telephone,
            adresse,
            id_etat_civil,
            statut,
            sexe,
            id_type_contrat,
            type_travail,
            id_permis,
            id_ville,
            date_naissance,
            date_engagement,
            user_cr,
            tel_service,
        } = req.body;

        const query = `
            INSERT INTO chauffeurs (
                matricule, nom, prenom, telephone, adresse, id_etat_civil,
                statut, profil, sexe, id_type_contrat, type_travail,
                id_permis, id_ville, date_naissance, date_engagement, user_cr, tel_service
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            matricule, nom, prenom, telephone, adresse, id_etat_civil,
            statut, profil, sexe, id_type_contrat, type_travail,
            id_permis, id_ville, date_naissance, date_engagement, user_cr, tel_service,
        ];

        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Chauffeur ajouté avec succès',
            data: { id: result.insertId, nom, prenom },
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout du chauffeur :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Un chauffeur avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout du chauffeur.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};
