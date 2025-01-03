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
        const query = `SELECT plein.id_plein, plein.qte_plein, plein.kilometrage, plein.matricule_ch, plein.observation, plein.date_plein, u.nom, v.immatriculation, c.nom AS nom_chauffeur, m.nom_marque, tc.nom_type_carburant, st.nom_site, st.id_site  FROM plein
                            INNER JOIN vehicules v ON plein.immatriculation = v.id_vehicule
                            INNER JOIN users u ON plein.id_user = u.id
                            INNER JOIN chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                            INNER JOIN marque m ON v.id_marque = m.id_marque
                            INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                            INNER JOIN affectations af ON c.id_chauffeur = af.id_chauffeur
                            INNER JOIN sites st ON af.id_site = st.id_site
                        ORDER BY plein.date_plein DESC
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

exports.getCarburantOne = async (req, res) => {
    const { id_vehicule } = req.query;

    try {
        const query = `SELECT plein.id_plein, plein.qte_plein, plein.kilometrage, plein.matricule_ch, plein.observation, plein.date_plein, u.nom, v.immatriculation, c.nom AS nom_chauffeur, m.nom_marque, tc.nom_type_carburant, md.modele FROM plein
                            INNER JOIN vehicules v ON plein.immatriculation = v.id_vehicule
                            INNER JOIN users u ON plein.id_user = u.id
                            INNER JOIN chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                            INNER JOIN marque m ON v.id_marque = m.id_marque
                            INNER JOIN modeles md ON m.id_marque = md.id_marque
                            INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                            WHERE plein.immatriculation = ?
                            GROUP BY plein.id_plein 
                            ORDER BY plein.date_plein DESC
                            `;

            const chauffeurs = await queryAsync(query,id_vehicule);
    
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

exports.getCarburantConsomm = async (req, res) => {

    const { targetKeys, selectedDates } = req.query;

    const targetKeysArray = targetKeys ? targetKeys.split(',') : [];
    const [startDate, endDate] = selectedDates ? selectedDates.split(',') : [null, null];

    try {
        const query = `
            SELECT 
                SUM(plein.kilometrage) AS Total_Kilometrage,
                MAX(plein.kilometrage) - MIN(plein.kilometrage) AS Km_Parcourus,
                SUM(plein.qte_plein) AS Total_Litres,
                (SUM(plein.qte_plein) / (MAX(plein.kilometrage) - MIN(plein.kilometrage))) * 100 AS Consommation_Litres_Par_100Km,
                COUNT(plein.id_plein) AS Nbre_De_Plein,
                v.immatriculation,
                c.nom AS Nom_Chauffeur,
                m.nom_marque,
                tc.nom_type_carburant,
                plein.immatriculation AS id_vehicule
            FROM plein
                INNER JOIN vehicules v ON plein.immatriculation = v.id_vehicule
                INNER JOIN users u ON plein.id_user = u.id
                INNER JOIN chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                INNER JOIN marque m ON v.id_marque = m.id_marque
                INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant
            WHERE 
                (${targetKeysArray.length > 0 ? `v.id_vehicule IN (${targetKeysArray.map(() => '?').join(',')})` : '1=1'})
                AND (${startDate && endDate ? `plein.date_plein BETWEEN ? AND ?` : '1=1'})
            GROUP BY 
                v.immatriculation, 
                c.nom, 
                m.nom_marque, 
                tc.nom_type_carburant;
        `;

        const queryParams = [
            ...targetKeysArray,
            ...(startDate && endDate ? [startDate, endDate] : [])
        ];

        const chauffeurs = await queryAsync(query, queryParams);

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


exports.getCarburantConsomOne = async (req, res) => {
    const { id_vehicule, selectedDates } = req.query;

    // Validation des paramètres
    const [startDate, endDate] = selectedDates ? selectedDates.split(',') : [null, null];

    try {
        // Construction de la requête SQL
        const query = `
            SELECT 
                plein.id_plein, plein.qte_plein, plein.kilometrage, plein.matricule_ch, 
                plein.observation, plein.date_plein, u.nom, v.immatriculation, 
                c.nom AS nom_chauffeur, m.nom_marque, tc.nom_type_carburant 
            FROM plein
            INNER JOIN vehicules v ON plein.immatriculation = v.id_vehicule
            INNER JOIN users u ON plein.id_user = u.id
            INNER JOIN chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
            INNER JOIN marque m ON v.id_marque = m.id_marque
            INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant
            WHERE 
                (? IS NULL OR v.id_vehicule = ?)
                AND (? IS NULL OR ? IS NULL OR plein.date_plein BETWEEN ? AND ?)
            GROUP BY plein.id_plein
        `;

        // Préparation des paramètres de requête
        const queryParams = [
            id_vehicule || null, id_vehicule || null,
            startDate || null, endDate || null, startDate || null, endDate || null
        ];

        // Exécution de la requête
        const vehicule = await queryAsync(query, queryParams);

        // Réponse réussie
        return res.status(200).json({
            message: 'Liste des véhicules pleins récupérés avec succès',
            data: vehicule,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des pleins :', error);

        // Réponse en cas d'erreur
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des données.",
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

//Rapport carburant
        //Détails pour chaque véhicule
exports.getCarburantRapportDetailVehicule = async (req, res) => {

    try {
        const query = `SELECT 
                            v.immatriculation,
                            v.id_vehicule,
                            c.nom AS nom_chauffeur,
                            st.nom_site,
                            st.id_site,
                            m.nom_marque,
                            md.modele,
                            tc.nom_type_carburant,
                            COUNT(plein.id_plein) AS total_pleins,
                            SUM(plein.qte_plein) AS total_litres,
                            SUM(plein.kilometrage) AS total_kilometrage
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
                        LEFT JOIN
                            modeles md ON m.id_marque = md.id_marque
                        INNER JOIN 
                            type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                        INNER JOIN 
                            affectations af ON c.id_chauffeur = af.id_chauffeur
                        INNER JOIN 
                            sites st ON af.id_site = st.id_site
                        GROUP BY 
                            v.immatriculation, c.nom, st.nom_site, st.id_site, m.nom_marque, tc.nom_type_carburant
                        ORDER BY 
                            v.immatriculation;
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
}

exports.getCarburantRapportDetailSites = async (req, res) => {

    try {
        const query = `SELECT 
                            v.immatriculation,
                            v.id_vehicule,
                            c.nom AS nom_chauffeur,
                            st.nom_site,
                            st.id_site,
                            m.nom_marque,
                            md.modele,
                            tc.nom_type_carburant,
                            COUNT(plein.id_plein) AS total_pleins,
                            SUM(plein.qte_plein) AS total_litres,
                            SUM(plein.kilometrage) AS total_kilometrage
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
                        LEFT JOIN
                            modeles md ON m.id_marque = md.id_marque
                        INNER JOIN 
                            type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                        INNER JOIN 
                            affectations af ON c.id_chauffeur = af.id_chauffeur
                        INNER JOIN 
                            sites st ON af.id_site = st.id_site
                        WHERE st.id_site = 1
                        GROUP BY 
                            v.immatriculation, c.nom, st.nom_site, st.id_site, m.nom_marque, tc.nom_type_carburant
                        ORDER BY 
                            v.immatriculation;
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
}

exports.getCarburantRapportDetailSitesALL = async (req, res) => {

    try {
        const query = `SELECT 
                            v.immatriculation,
                            COUNT(DISTINCT v.id_vehicule) nbre_vehicule,
                            c.nom AS nom_chauffeur,
                            st.nom_site,
                            st.id_site,
                            p.province,
                            z.NomZone AS zone,
                            COUNT(plein.id_plein) AS total_pleins,
                            SUM(plein.qte_plein) AS total_litres,
                            SUM(plein.kilometrage) AS total_kilometrage
                        FROM 
                            plein
                        INNER JOIN 
                            vehicules v ON plein.immatriculation = v.id_vehicule
                        INNER JOIN 
                            users u ON plein.id_user = u.id
                        INNER JOIN 
                            chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                        INNER JOIN 
                            affectations af ON c.id_chauffeur = af.id_chauffeur
                        INNER JOIN 
                            sites st ON af.id_site = st.id_site
                         INNER JOIN 
                         	villes vll ON st.IdVille = vll.id
                         INNER JOIN 
                         	provinces p ON vll.ref_prov = p.id
                         INNER JOIN
                         	zones z ON st.IdZone = z.id
                        GROUP BY 
                            st.id_site
                        ORDER BY 
                            v.immatriculation
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
}

exports.getCarburantRapportInfoGen = async (req, res) => {

    try {
        const query = `SELECT 
                        'SIEGE KIN' AS nom_site,
                        1 AS id_site,
                        COUNT(DISTINCT v.id_vehicule) nbre_vehicule,
                        p.province,
                        z.NomZone AS zone,
                        COUNT(plein.id_plein) AS total_pleins,
                        SUM(plein.qte_plein) AS total_litres,
                        SUM(plein.kilometrage) AS total_kilometrage
                    FROM 
                        plein
                    INNER JOIN 
                        vehicules v ON plein.immatriculation = v.id_vehicule
                    INNER JOIN 
                        users u ON plein.id_user = u.id
                    INNER JOIN 
                        chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                    INNER JOIN 
                        affectations af ON c.id_chauffeur = af.id_chauffeur
                    INNER JOIN 
                        sites st ON af.id_site = st.id_site
                    INNER JOIN 
                        villes vll ON st.IdVille = vll.id
                    INNER JOIN 
                        provinces p ON vll.ref_prov = p.id
                    INNER JOIN 
                        zones z ON st.IdZone = z.id
                    WHERE 
                        st.nom_site = 'SIEGE KIN'
                    GROUP BY 
                        p.province, z.NomZone

                    UNION ALL

                    SELECT 
                        'Autre sites' AS nom_site,
                        NULL AS id_site,
                        COUNT(DISTINCT v.id_vehicule) nbre_vehicule,
                        p.province,
                        z.NomZone AS zone,
                        COUNT(plein.id_plein) AS total_pleins,
                        SUM(plein.qte_plein) AS total_litres,
                        SUM(plein.kilometrage) AS total_kilometrage
                    FROM 
                        plein
                    INNER JOIN 
                        vehicules v ON plein.immatriculation = v.id_vehicule
                    INNER JOIN 
                        users u ON plein.id_user = u.id
                    INNER JOIN 
                        chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                    INNER JOIN 
                        affectations af ON c.id_chauffeur = af.id_chauffeur
                    INNER JOIN 
                        sites st ON af.id_site = st.id_site
                    INNER JOIN 
                        villes vll ON st.IdVille = vll.id
                    INNER JOIN 
                        provinces p ON vll.ref_prov = p.id
                    INNER JOIN 
                        zones z ON st.IdZone = z.id
                    WHERE 
                        st.nom_site != 'SIEGE KIN'
                    GROUP BY 
                        p.province, z.NomZone
                    ORDER BY 
                        nom_site;
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
}

//RAPPORT TYPE CARBURANT SIEGE KIN
exports.getCarburantTypeSiegeKin = async (req, res) => {

    try {
        const query = `SELECT 
                            COUNT(DISTINCT v.id_vehicule) AS nbre_vehicule,
                            tc.nom_type_carburant,
                            COUNT(plein.id_plein) AS total_pleins,
                            SUM(plein.qte_plein) AS total_litres,
                            SUM(plein.kilometrage) AS total_kilometrage
                        FROM 
                            plein
                        INNER JOIN 
                            vehicules v ON plein.immatriculation = v.id_vehicule
                        INNER JOIN 
                            users u ON plein.id_user = u.id
                        INNER JOIN 
                            chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                        INNER JOIN 
                            type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                        INNER JOIN 
                            affectations af ON c.id_chauffeur = af.id_chauffeur
                        INNER JOIN 
                            sites st ON af.id_site = st.id_site
                        WHERE st.id_site = 1
                        GROUP BY 
                            tc.id_type_carburant
                        ORDER BY 
                            v.immatriculation;
                        `;

            const rapport = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste de rapport de type carburant a ete récupérés avec succès',
                data: rapport,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des chauffeurs :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            });
        }
}

exports.getCarburantTypeAutres = async (req, res) => {

    try {
        const query = `SELECT 
                            COUNT(DISTINCT v.id_vehicule) AS nbre_vehicule,
                            tc.nom_type_carburant,
                            COUNT(plein.id_plein) AS total_pleins,
                            SUM(plein.qte_plein) AS total_litres,
                            SUM(plein.kilometrage) AS total_kilometrage
                        FROM 
                            plein
                        INNER JOIN 
                            vehicules v ON plein.immatriculation = v.id_vehicule
                        INNER JOIN 
                            users u ON plein.id_user = u.id
                        INNER JOIN 
                            chauffeurs c ON plein.id_chauffeur = c.id_chauffeur
                        INNER JOIN 
                            type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                        INNER JOIN 
                            affectations af ON c.id_chauffeur = af.id_chauffeur
                        INNER JOIN 
                            sites st ON af.id_site = st.id_site
                        WHERE 
                            st.id_site <> 1 -- Exclut les enregistrements avec id_site = 1
                        GROUP BY 
                            tc.id_type_carburant
                        ORDER BY 
                            v.immatriculation;
                        `;

            const rapport = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste de rapport de type carburant a ete récupérés avec succès',
                data: rapport,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des chauffeurs :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
            });
        }
}

//Consommation mensuelle de mes vehicules
exports.getConsommationTypeCarburnt = async (req, res) => {

    try {
        const query = `SELECT
                            YEAR(date_plein) AS annee,
                            MONTH(date_plein) AS mois,
                            SUM(qte_plein) AS total_conso,
                            tc.nom_type_carburant
                        FROM
                            plein
                        INNER JOIN type_carburant tc ON plein.type_carburant = tc.id_type_carburant
                        GROUP BY
                            YEAR(date_plein),
                            MONTH(date_plein),
                            plein.type_carburant,
                            tc.nom_type_carburant
                        ORDER BY
                            annee DESC, mois DESC;
                        `;

            const consommation = await queryAsync(query);
    
            return res.status(200).json({
                message: 'Liste de consommation de type carburant a ete récupérés avec succès',
                data: consommation,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des consommations carburants :', error);
    
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la récupération des consommations.",
            });
        }
}
