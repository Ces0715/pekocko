// model user (importation de mongoose)
const mongoose = require('mongoose');

// ajout du validateur
const uniqueValidator = require('mongoose-unique-validator');

// création du schéma de données à l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// garantie de l'email unique
userSchema.plugin(uniqueValidator);

// exportation du schéma de model (user)
module.exports = mongoose.model('User', userSchema);