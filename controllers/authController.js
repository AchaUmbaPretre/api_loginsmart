const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur.' });

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email déjà utilisé.' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
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
  const { email, password } = req.body;

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur.' });

      if (results.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Générer un token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Authentification réussie.', token });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
