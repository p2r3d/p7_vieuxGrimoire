// contient la logique des routes des utilisateurs

const express = require('express');
const router = express.Router();

// logique métier
const userCtrl = require('../controllers/user');

// différentes routes concernant les utlisateurs : inscription et connexion
router.post('/signup', userCtrl.signup);
router.post('/login',  userCtrl.login);

module.exports = router;
