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

exports.getCarburantCount = async (req, res) => {

    try {
          const query = `SELECT COUNT(id) AS nbre_plein FROM plein`;
          const [result] = await queryAsync(query);
      
          return res.status(200).json({
            message: 'Le nombre total de plein a été récupéré avec succès.',
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


exports.getCarburant = async (req, res) => {
    try {
        const query = `SELECT * FROM plein`;

            const chauffeurs = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste des véhicules pleins récupérés avec succès',
                data: chauffeurs,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des chauffeurs :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            });
        }
};


exports.postCarburant = async (req, res) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            immatriculation,
            qte_plein,
            kilometrage,
            type_carburant,
            matricule_ch,
            observation,
            id_vehicule,
            id_chauffeur,
            id_user
        } = req.body;

        const query = `
            INSERT INTO plein (
                immatriculation, qte_plein, kilometrage, type_carburant, matricule_ch, observation,
                id_vehicule, id_chauffeur, id_user, date_plein
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            immatriculation, qte_plein, kilometrage, type_carburant, matricule_ch, observation,
            id_vehicule, id_chauffeur, id_user
        ];

        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Chauffeur ajouté avec succès',
            data: { id: result.insertId, nom, prenom },
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout du carburant :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Un carburant avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout du carburant.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};