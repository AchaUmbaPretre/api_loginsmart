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
        const query = `
            SELECT 
                rp.id_reparation, 
                rp.date_reparation,
                rp.date_prevu, 
                rp.cout, 
                rp.commentaire, 
                v.immatriculation, 
                m.nom_marque, 
                tr.type_rep, 
                rp.montant, 
                rp.description, 
                f.nom AS fournisseur, 
                em.id_etat_maintenance,
                DATEDIFF(rp.date_prevu, rp.date_reparation) AS nbre_jour
            FROM reparations rp
            INNER JOIN vehicules v ON rp.immatriculation = v.id_vehicule
            INNER JOIN marque m ON v.id_marque = m.id_marque
            INNER JOIN type_reparations tr ON rp.id_type_reparation = tr.id_type_reparation
            INNER JOIN fournisseurs f ON rp.id_fournisseur = f.id_fournisseur
            INNER JOIN etat_maintenance em ON rp.id_etat = em.id_etat_maintenance;
        `;

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
};


exports.getReparationOne = async (req, res) => {
    const { id_reparation } = req.query;

    try {
        const query = `SELECT rp.id_reparation, rp.date_reparation, rp.cout, rp.commentaire, v.immatriculation, m.nom_marque, tr.type_rep, rp.montant, rp.description, f.nom AS fournisseur, em.id_etat_maintenance FROM reparations rp
                        INNER JOIN vehicules v ON rp.immatriculation = v.id_vehicule
                        INNER JOIN marque m ON v.id_marque = m.id_marque
                        INNER JOIN type_reparations tr ON rp.id_type_reparation = tr.id_type_reparation
                        INNER JOIN fournisseurs f ON rp.id_fournisseur = f.id_fournisseur
                        INNER JOIN etat_maintenance em ON rp.id_etat = em.id_etat_maintenance
                        WHERE rp.id_reparation = ?`;
    
        const réparation = await queryAsync(query, id_reparation);
        
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
                2,
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

//Controle technique
exports.getControleTechnique = async (req, res) => {

    try {
        const query = `SELECT ct.id_controle_tech, ct.date_controle, ct.date_validite, ct.kilometrage, ct.ref_controle, ct.resultat, ct.cout_device, ct.cout_ttc, ct.taxe,ct.commentaire, v.immatriculation, f.nom AS nom_fournisseur, c.nom AS nom_chauffeur, m.nom_marque, tr.type_rep, sct.description
                            FROM controle_tech ct
                            INNER JOIN vehicules v ON ct.immatriculation = v.id_vehicule
                            INNER JOIN marque m ON v.id_marque = m.id_marque
                            INNER JOIN fournisseurs f ON ct.id_fournisseur = f.id_fournisseur
                            INNER JOIN chauffeurs c ON ct.id_chauffeur = c.id_chauffeur
                            INNER JOIN sub_controle_tech sct ON ct.id_controle_tech = sct.id_controle_tech
                            INNER JOIN type_reparations tr ON sct.id_type_reparation = tr.id_type_reparation`;

            const controle = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste de controle de technique récupérées avec succès',
                data: controle,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des suivie :', error);
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des suivie.",
            });
        }
};

exports.postControlTechnique = async (req, res) => {
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
        const query = `SELECT sr.id_suivi_reparation, sr.cout, sr.description, tt.type_tache, v.immatriculation, cp.titre AS nom_piece, m.nom_marque FROM suivi_reparation sr
                            INNER JOIN reparations r ON sr.id_reparation = r.id_reparation
                            INNER JOIN type_tache tt ON sr.id_tache = tt.id_type_tache
                            INNER JOIN categorie_pieces cp ON sr.id_piece = cp.id
                            INNER JOIN vehicules v ON r.immatriculation = v.id_vehicule
                            INNER JOIN marque m ON v.id_marque = m.id_marque`;

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

exports.getSuiviOneReparation = async (req, res) => {
    const { id_reparation} = req.query;

        try {
            const query =   `SELECT sr.id_suivi_reparation, sr.cout, sr.description, tt.type_tache, v.immatriculation, cp.titre AS nom_piece, m.nom_marque, sr.id_etat FROM suivi_reparation sr
                                INNER JOIN reparations r ON sr.id_reparation = r.id_reparation
                                INNER JOIN type_tache tt ON sr.id_tache = tt.id_type_tache
                                INNER JOIN categorie_pieces cp ON sr.id_piece = cp.id
                                INNER JOIN vehicules v ON r.immatriculation = v.id_vehicule
                                INNER JOIN marque m ON v.id_marque = m.id_marque
                            WHERE sr.id_reparation = ?`;
    
                const suivie = await queryAsync(query, id_reparation);
        
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
            suivie
        } = req.body.values;

        const query = `
            INSERT INTO suivi_reparation (
                id_reparation, id_tache, id_piece, cout, description, id_etat,
                user_cr
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const suiviPromise = suivie.map((s) => {
            const values = [
                req.body.id_reparation, s.id_tache, s.id_piece, s.cout, s.description, s.id_etat,
                1];

            return queryAsync(query, values)
        })

        await Promise.all(suiviPromise);

        return res.status(201).json({
            message: 'Suivie réparation ajouté avec succès',
            data: { id: suiviPromise.insertId }
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