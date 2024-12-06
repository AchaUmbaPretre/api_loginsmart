const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');
const jwtUtils = require('../utils/jwt');

dotenv.config();

exports.register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur.' });

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email déjà utilisé.' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      // Insérer l'utilisateur
      db.query(
        'INSERT INTO users (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)',
        [nom, prenom, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: 'Erreur serveur.' });
          res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND mot_de_passe = ?';
  db.query(query, [email, mot_de_passe], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];
    const accessToken = jwtUtils.generateAccessToken(user);
    const refreshToken = jwtUtils.generateRefreshToken(user);

    // Enregistrez le refresh token dans la base de données
    const saveRefreshToken = 'UPDATE users SET refresh_token = ? WHERE id = ?';
    db.query(saveRefreshToken, [refreshToken, user.id], (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });

      return res.json({ access_token: accessToken, refresh_token: refreshToken });
    });
  });
};

exports.refreshToken = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) return res.status(401).json({ error: 'Refresh token manquant' });

  const query = 'SELECT * FROM users WHERE refresh_token = ?';
  db.query(query, [refresh_token], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    if (results.length === 0) {
      return res.status(403).json({ error: 'Refresh token invalide' });
    }

    const user = results[0];

    try {
      jwtUtils.verifyRefreshToken(refresh_token);

      // Générer un nouveau access token
      const newAccessToken = jwtUtils.generateAccessToken(user);
      return res.json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(403).json({ error: 'Refresh token expiré ou invalide' });
    }
  });
};

exports.logout = (req, res) => {
  const { refresh_token } = req.body;

  const query = 'UPDATE users SET refresh_token = NULL WHERE refresh_token = ?';
  db.query(query, [refresh_token], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    return res.status(200).json({ message: 'Déconnecté avec succès' });
  });
};

