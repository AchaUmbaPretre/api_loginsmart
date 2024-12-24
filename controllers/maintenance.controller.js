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

//Reparation
exports.getReparation = async (req, res) => {
    try {
        const query = `SELECT rp.id_reparation, rp.date_reparation, rp.cout, rp.commentaire, v.immatriculation, m.nom_marque FROM reparations rp
                        INNER JOIN vehicules v ON rp.immatriculation = v.id_vehicule
                        INNER JOIN marque m ON v.id_marque = m.id_marque`;
    
        const réparation = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des réparations récupérée avec succès',
            data: réparation,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des réparations :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des réparations.",
        });
    }
}

exports.postReparation = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            immatriculation,
            date_reparation,
            date_sortie,
            date_prevu,
            cout,
            id_fournisseur,
            commentaire,
            code_rep,
            reparations
        } = req.body;

        const insertReparationQuery = `
            INSERT INTO reparations (
                immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur,
                commentaire, code_rep
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const reparationValues = [
            immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur,
            commentaire, code_rep
        ];

        const result = await queryAsync(insertReparationQuery, reparationValues);
        const insertId = result.insertId;

        if (!Array.isArray(reparations)) {
            return res.status(400).json({
                error: "Le champ `réparations` doit être un tableau."
            });
        }

        const insertSudReparationQuery = `
            INSERT INTO sud_reparation (
                id_reparation, id_type_reparation, montant, description
            ) VALUES (?, ?, ?, ?)
        `;

        const sudReparationPromises = reparations.map((sud) => {
            const sudValues = [insertId, sud.id_type_reparation, sud.montant, sud.description];
            return queryAsync(insertSudReparationQuery, sudValues);
        });

        await Promise.all(sudReparationPromises);

        return res.status(201).json({
            message: 'La réparation a été ajoutée avec succès',
            data: { id: insertId },
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout de maintenance :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Une réparation avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout de la réparation.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};
