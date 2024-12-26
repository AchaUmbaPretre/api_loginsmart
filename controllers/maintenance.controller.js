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
        const query = `SELECT rp.id_reparation, rp.date_reparation, rp.cout, rp.commentaire, v.immatriculation, m.nom_marque, tr.type_rep, rp.montant, rp.description, f.nom AS fournisseur, em.id_etat_maintenance FROM reparations rp
                        INNER JOIN vehicules v ON rp.immatriculation = v.id_vehicule
                        INNER JOIN marque m ON v.id_marque = m.id_marque
                        INNER JOIN type_reparations tr ON rp.id_type_reparation = tr.id_type_reparation
                        INNER JOIN fournisseurs f ON rp.id_fournisseur = f.id_fournisseur
                        INNER JOIN etat_maintenance em ON rp.id_etat = em.id_etat_maintenance`;
    
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

/* exports.postReparation = async (req, res) => {
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
                commentaire,id_etat, code_rep
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const reparationValues = [
            immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur,
            commentaire, 1, code_rep
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
}; */

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

        if (!Array.isArray(reparations)) {
            return res.status(400).json({
                error: "Le champ `reparations` doit être un tableau."
            });
        }

        const insertReparationQuery = `
            INSERT INTO reparations (
                immatriculation, date_reparation, date_sortie, date_prevu, cout, id_fournisseur, id_type_reparation, montant, description,
                commentaire,id_etat, code_rep
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const reparationPromises = reparations.map((sud) => {
            const reparationValues = [
                immatriculation,
                date_reparation,
                date_sortie,
                date_prevu,
                cout,
                id_fournisseur,
                sud.id_type_reparation,
                sud.montant,
                sud.description,
                commentaire,
                1,
                code_rep
            ];

            return queryAsync(insertReparationQuery, reparationValues);
        });

        await Promise.all(reparationPromises);

        return res.status(201).json({
            message: 'Les réparations ont été ajoutées avec succès.'
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout de réparation :', error);

        // Gestion des erreurs spécifiques et des erreurs générales
        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Une réparation avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout des réparations.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};

exports.postControlTech = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            immatriculation,
            date_controle,
            date_validite,
            kilometrage,
            ref_controle,
            id_agent,
            resultat,
            cout_device,
            cout_ttc,
            taxe,
            id_fournisseur,
            id_chauffeur,
            commentaire,
            reparations
        } = req.body;

        const insertQuery = `
            INSERT INTO controle_tech (
                immatriculation, date_controle, date_validite, kilometrage, ref_controle, id_agent,
                 resultat, cout_device, cout_ttc, taxe, id_fournisseur, id_chauffeur, commentaire
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const controleValues = [
            immatriculation,
            date_controle,
            date_validite,
            kilometrage,
            ref_controle,
            id_agent,
            resultat,
            cout_device,
            cout_ttc,
            taxe,
            id_fournisseur,
            id_chauffeur,
            commentaire
        ];

        const result = await queryAsync(insertQuery, controleValues);
        const insertId = result.insertId;

        if (!Array.isArray(reparations)) {
            return res.status(400).json({
                error: "Le champ `réparations` doit être un tableau."
            });
        }

        const insertSudReparationQuery = `
            INSERT INTO sub_controle_tech (
                id_controle_tech, id_type_reparation, visite, description
            ) VALUES (?, ?, ?, ?)
        `;

        const sudReparationPromises = reparations.map((sud) => {
            const sudValues = [insertId, sud.id_type_reparation, sud.visite, sud.description];
            return queryAsync(insertSudReparationQuery, sudValues);
        });

        await Promise.all(sudReparationPromises);

        return res.status(201).json({
            message: 'Le controle technique a été ajouté avec succès',
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

//Suivie 
exports.getSuivi = async (req, res) => {
    try {
        const query = `SELECT * FROM suivi_reparation`;

            const suivie = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste des suivie réparation récupérées avec succès',
                data: suivie,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des suivie :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des suivie.",
            });
        }
    };

exports.postSuivi = async (req, res) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            id_reparation,
            id_tache,
            id_piece,
            cout,
            description,
            id_etat,
            user_cr
        } = req.body;

        const query = `
            INSERT INTO suivi_reparation (
                id_reparation, id_tache, id_piece, cout, description, id_etat,
                user_cr
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id_reparation, id_tache, id_piece, cout, description, id_etat,
            user_cr];

        const result = await queryAsync(query, values);

        return res.status(201).json({
            message: 'Suivie réparation ajouté avec succès',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Erreur lors de l’ajout de suivie réparation :', error);

        const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const errorMessage =
            error.code === 'ER_DUP_ENTRY'
                ? "Suivie avec ces informations existe déjà."
                : "Une erreur s'est produite lors de l'ajout.";

        return res.status(statusCode).json({ error: errorMessage });
    }
};