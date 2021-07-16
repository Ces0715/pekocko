// ajout express
const express = require('express');

// Importer mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose');

const sauceRoutes = require('./models/sauce');

//declaration des routes
//const saucesRoutes = require('./routes/sauces');
// Importer la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');
// création de l'application utilisant le framework express
const app = express();



mongoose.set('useCreateIndex', true);
//connection à la base de données de MongoDB
mongoose.connect('mongodb+srv://ces0715:ambush0715@cluster0.ikwgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ajout middleware headers pour CORS (debloquer systèmes de sécurité)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



// Va servir les routes dédiées aux sauces

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
  sauceRoutes.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/sauces/:id', (req, res, next) => {
  sauceRoutes.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
});

//transformation des données de la requete POST en JSON
app.use(express.json());

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


//Exportation de l'application express
module.exports = app;