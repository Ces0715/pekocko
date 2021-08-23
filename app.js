// ajout express
const express = require('express');
// Importer mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');

//DECLARATION DES ROUTES
//importer la route dédiée aux sauces
const sauceRoutes = require('./routes/sauce');
// Importer la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');

// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require("dotenv").config();

//Importer helmet pour securiser express (protection application)
const helmet = require('helmet'); 
// Donner acces au chemin (importer images)
const path = require('path');
//Création de l'application utilisant le framework express
const app = express();


//Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe
mongoose.connect(process.env.DB_URI,
//mongoose.connect('mongodb+srv://ces0715:ambush0715@cluster0.ikwgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,  
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ajout middleware headers pour CORS (Systèmes de sécurité)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//transformation des données de la requete POST en JSON
app.use(express.json());
// secure HTTP headers
app.use(helmet());
// cross-scripting protection (helmet)
app.use((_req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

mongoose.set('useCreateIndex', true);
//debug mod of mongoose
mongoose.set('debug', true);

// gestion des images
app.use('/images',express.static(path.join(__dirname,'images')));

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);
// Va servir les routes dédiées aux sauces
app.use('/api/sauces', sauceRoutes);

//Exportation de l'application express
module.exports = app;