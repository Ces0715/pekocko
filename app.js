// ajout express
const express = require('express');
// Importer mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');
// donner acces au chemin (importer images)
const path = require('path');


//DECLARATION DES ROUTES
//importer la route dédiée aux sauces
const sauceRoutes = require('./routes/sauce');
// Importer la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');
// création de l'application utilisant le framework express
const app = express();

const Sauce = require('./models/Sauce');

//connection à la base de données de MongoDB
mongoose.connect('mongodb+srv://ces0715:ambush0715@cluster0.ikwgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ajout middleware headers pour CORS (debloquer systèmes de sécurité)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

//transformation des données de la requete POST en JSON
app.use(express.json());


mongoose.set('useCreateIndex', true);

// gestion des images
app.use('/images',express.static(path.join(__dirname,'images')));


app.post('/api/sauces', (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

app.use('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
});

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);
// Va servir les routes dédiées aux sauces
app.use('/api/sauces', sauceRoutes);

//Exportation de l'application express
module.exports = app;