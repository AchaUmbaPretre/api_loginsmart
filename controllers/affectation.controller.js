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
        const query = `SELECT aff.id_affectations, aff.created_at, aff.commentaire, s.nom_site, c.nom AS nom_chauffeur, c.prenom AS prenom_chauffeur, u.nom, u.prenom FROM affectations aff
                        LEFT JOIN sites s ON aff.id_site = s.id_site
                        LEFT JOIN chauffeurs c ON aff.id_chauffeur = c.id_chauffeur
                        INNER JOIN users u ON aff.user_cr = u.id`;
    
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

exports.getAffectationHistorique = async (req, res) => {
    try {
        const query = `SELECT aff.id_historique, aff.date_affectation, aff.commentaire, aff.type_action, s.nom_site, c.nom AS nom_chauffeur, c.prenom AS prenom_chauffeur, u.nom, u.prenom FROM historique_affectations aff
                        LEFT JOIN sites s ON aff.id_site = s.id_site
                        LEFT JOIN chauffeurs c ON aff.id_chauffeur = c.id_chauffeur
                        INNER JOIN users u ON aff.user_cr = u.id`;
    
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
        const { id_site, id_chauffeur, commentaire, user_cr } = req.body;

        const queryAffectation = `
            INSERT INTO affectations (id_site, id_chauffeur, commentaire, user_cr) 
            VALUES (?, ?, ?, ?)
        `;
        const valuesAffectation = [id_site, id_chauffeur, commentaire, user_cr];

        const resultAffectation = await queryAsync(queryAffectation, valuesAffectation);

        const queryHistorique = `
            INSERT INTO historique_affectations (id_site, id_chauffeur, type_action, commentaire, user_cr, ancien_site)
            VALUES (?, ?, 'ajout', ?, ?, NULL)
        `;
        const valuesHistorique = [id_site, id_chauffeur, commentaire, user_cr];

        const resultHistorique = await queryAsync(queryHistorique, valuesHistorique);

        return res.status(201).json({
            message: 'Affectation ajoutée avec succès.',
            affectationId: resultAffectation.insertId,
            historiqueId: resultHistorique.insertId,
        });
    } catch (error) {
        console.error('Erreur détaillée:', error);

        return res.status(500).json({
            error: "Une erreur s'est produite lors de l'ajout de l'affectation.",
            details: error.sqlMessage || error.message,
        });
    }
};

