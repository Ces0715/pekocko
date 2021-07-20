// apport d'express
const express = require('express');

//creation du router par express
const router = express.Router();

// importation du controller
const userCtrl = require('../controllers/user');

// verification des infos et ajout à la base de données
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;