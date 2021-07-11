// ajout express
const express = require('express');
// ajout bodyParser
const bodyParser = require('body-parser');
// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://ces0715:ambush0715@cluster0.ikwgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ajout headers pour CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(express.json());

//const saucesRoutes = require('./routes/sauces');

//app.use('/api/sauces', saucesRoutes);


module.exports = app;