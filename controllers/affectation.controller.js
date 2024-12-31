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
        const query = `SELECT aff.id_affectations, aff.created_at, s.nom_site, c.nom, c.prenom, u.nom, u.prenom FROM affectations aff
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
    const connection = await queryAsync.getConnection(); // Assurez-vous de bien gérer la connexion à la base
    try {
        // Validation des données envoyées
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Récupération des données du corps de la requête
        const {
            id_site,
            id_chauffeur,
            commentaire,
            user_cr,
        } = req.body;

        // Démarrer une transaction pour garantir l'intégrité des données
        await connection.beginTransaction();

        // Insertion dans la table 'affectations'
        const queryAffectation = `
            INSERT INTO affectations (id_site, id_chauffeur, commentaire, user_cr) 
            VALUES (?, ?, ?, ?)
        `;
        const valuesAffectation = [id_site, id_chauffeur, commentaire, user_cr];
        const resultAffectation = await connection.queryAsync(queryAffectation, valuesAffectation);

        // Insertion dans la table 'historique_affectations'
        const queryHistorique = `
            INSERT INTO historique_affectations (id_site, id_chauffeur, type_action, commentaire, user_cr, ancien_site) 
            VALUES (?, ?, 'ajout', ?, ?, NULL)  -- ancien_site est NULL lors du premier ajout
        `;
        const valuesHistorique = [id_site, id_chauffeur, commentaire, user_cr];
        await connection.queryAsync(queryHistorique, valuesHistorique);

        // Si tout est réussi, on valide la transaction
        await connection.commit();

        // Réponse de succès
        return res.status(201).json({
            message: 'Affectation ajoutée avec succès.',
            data: { id: resultAffectation.insertId },
        });
    } catch (error) {
        // Si une erreur se produit, on annule la transaction
        await connection.rollback();
        console.error('Erreur lors de l’ajout d\'une affectation:', error);

        // Gestion des erreurs
        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Une affectation avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout de l'affectation.";

        return res.status(statusCode).json({ error: errorMessage });
    } finally {
        // Libérer la connexion à la base de données, qu'il y ait une erreur ou non
        connection.release();
    }
};