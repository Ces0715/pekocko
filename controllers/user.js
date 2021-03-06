// hasher le MP des utilisateurs
const bcrypt = require('bcrypt');
// recuperation du model user
const User = require('../models/User');
//attribution token à utilisateur
const jwt = require('jsonwebtoken');

// middleware pour la création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // enregistrement de l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// verification de l'utilisateur avec login
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // comparer mot de passe avec le mot de passe des données
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json(
            {
              userId: user._id,
              // token genere de 24h
              token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};