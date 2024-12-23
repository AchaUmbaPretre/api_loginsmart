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
        const query = `SELECT plein.id_plein, plein.qte_plein, plein.kilometrage, plein.matricule_ch, plein.observation, plein.date_plein, u.nom, v.immatriculation, c.nom AS nom_chauffeur, m.nom_marque, tc.nom_type_carburant FROM plein
                            INNER JOIN vehicules v ON plein.immatriculation = v.id_vehicule
                            INNER JOIN users u ON plein.id_user = u.id
                            INNER JOIN chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                            INNER JOIN marque m ON v.id_marque = m.id_marque
                            INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant`;

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


exports.getCarburantCinq = async (req, res) => {

    try {
        const query = `SELECT 
                plein.id_plein, 
                plein.qte_plein, 
                plein.kilometrage, 
                plein.matricule_ch, 
                plein.observation, 
                plein.date_plein, 
                u.nom AS nom_utilisateur, 
                v.immatriculation, 
                c.nom AS nom_chauffeur, 
                m.nom_marque, 
                tc.nom_type_carburant,
                u.nom
            FROM 
                plein
            INNER JOIN 
                vehicules v ON plein.immatriculation = v.id_vehicule
            INNER JOIN 
                users u ON plein.id_user = u.id
            INNER JOIN 
                chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
            INNER JOIN 
                marque m ON v.id_marque = m.id_marque
            INNER JOIN 
                type_carburant tc ON plein.type_carburant = tc.id_type_carburant
            ORDER BY 
                plein.date_plein DESC
            LIMIT 5;
                `;

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
            id_user,
            date_plein
        } = req.body;

        const query = `
            INSERT INTO plein (
                immatriculation, qte_plein, kilometrage, type_carburant, matricule_ch, observation,
                id_vehicule, id_chauffeur, id_user, date_plein
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            immatriculation, qte_plein, kilometrage, type_carburant, matricule_ch, observation,
            id_vehicule, id_chauffeur, id_user, date_plein
        ];

        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Carburant ajouté avec succès',
            data: { id: result.insertId},
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