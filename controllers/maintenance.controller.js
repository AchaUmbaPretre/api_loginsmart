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
        const query = `SELECT * FROM reparations`;
    
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

    console.log(req.body)
    
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
            code_rep
        } = req.body;

        const query = `
            INSERT INTO reparations (
                immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur,
                commentaire, code_rep
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const querySud = `
            INSERT INTO sud_reparation (
                id_reparation, id_type_reparation, montant, description
            ) VALUES (?, ?, ?)
        `;

        const values = [
            immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur,
            commentaire, code_rep
        ];

        const result = await queryAsync(query, values);
        const inserId = result.inserId;


        req.body.map((d)=> {
            const valuesSub = [ inserId, d.montant, d.id_type_reparation, d.description]
            const result2 = queryAsync(query, valuesSub);

        })

        return res.status(201).json({
            message: 'La réparation a été ajoutée avec succès',
            data: { id: result.insertId},
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout de maintenance :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Un chauffeur avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout de maintenance.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};