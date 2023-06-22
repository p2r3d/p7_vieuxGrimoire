// contient la logique des routes des livres
const express = require('express');
const router = express.Router();

// authentification
const auth = require('../middleware/auth');
// gestion des fichiers
const multer = require('../middleware/multer-config');
// redimensionnement d'images
const sharpImg = require('../middleware/sharp-config');

// logique métier
const booksCtrl = require('../controllers/books');

// différentes routes concernant les livres
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/', multer,booksCtrl.getAllBooks);
router.post('/', auth, multer, sharpImg, booksCtrl.postBook);
router.get('/:id', multer,booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id',auth, booksCtrl.deleteBook);
module.exports = router;  