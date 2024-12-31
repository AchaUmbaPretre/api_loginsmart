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

exports.getAffectation = async (req, res) => {
    try {
        const query = `SELECT * FROM affectations`;
    
        const etatCivil = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des affectations récupérés avec succès',
            data: etatCivil,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des affectations :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des affectations.",
        });
    }
}

exports.postAffectation = async (req, res) => {
    
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            id_site,
            id_chauffeur,
            commentaire,
            user_cr
        } = req.body;

        const query = `
            INSERT INTO affectations (
                id_site, id_chauffeur, commentaire, user_cr
                ) VALUES (?, ?, ?, ?)
        `;

        const values = [
            id_site, id_chauffeur, commentaire,user_cr
        ];

        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Affectation ajoutée avec succès',
            data: { id: result.insertId},
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout d une affectation :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Une affectation avec ces informations existent déjà."
                : "Une erreur s'est produite lors de l'ajout d'une affectation.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};