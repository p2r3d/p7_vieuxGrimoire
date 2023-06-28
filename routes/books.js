// contient la logique des routes des livres
const express = require('express');
const router = express.Router();

// authentification
const auth = require('../middleware/auth');
// gestion des fichiers
const multer = require('../middleware/multer-config');
// redimensionnement d'images
const resizedImage = require('../middleware/sharp-config')

// logique métier
const booksCtrl = require('../controllers/books');

// différentes routes concernant les livres
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer,resizedImage ,booksCtrl.postBook);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);
router.put('/:id', auth, multer,resizedImage, booksCtrl.modifyBook);
router.delete('/:id',auth, booksCtrl.deleteBook);


module.exports = router;  