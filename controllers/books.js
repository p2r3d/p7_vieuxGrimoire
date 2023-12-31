//  LOGIQUE METIER

//import du modèle de données
const Book = require('../models/Book');
// modèle de système de fichiers pour la manipulation des fichiers
const fs = require('fs');
// pour le calcul de la moyenne des notes
const {calculateAverage} = require('../utils/average');

// requête POST : création d'un livre
exports.postBook = async(req, res, next) => {
  try {
  // le formdata de la requête est transformé en json
    const bookObject = JSON.parse(req.body.book);

    //vérification de la date de publication du livre
    const publicationYear = parseInt(bookObject.year);
    const currentYear = new Date().getFullYear();
    if (bookObject.year > currentYear || isNaN(publicationYear)) {
      return res.status(400).json("Année de publication invalide");
    }

    // Suppression de l'id envoyé par le front (un nouvel id sera généré avec mongo)
    delete bookObject._id;

    // Suppression de _userId du front pour n'utiliser que celui de la requête
    delete bookObject._userId;
    
    // Création d'un nouveau livre
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`,
        averageRating: bookObject.ratings[0].grade
    });

    // Enregistrement dans la base de données avec la méthode save de Mongoose
    await book.save();
    res.status(201).json({ message: 'Livre créé !' });
  }
  catch(error) {
     res.status(400).json({error})
  }
}

// PUT : modification d'un livre sélectionné
exports.modifyBook = async(req, res, next) => {
  try {
    // on vérifie s'il y a un fichier image attaché à la requête
    // si oui création d'un nouvel objet avec maj image 
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    } : { ...req.body }; // sinon on copie le body de la requête dans bookObject
  
    delete bookObject._userId;
    // si l'id existe dans la BD 
    const book = await Book.findOne({_id: req.params.id});
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message : 'Not authorized'}); //
    } else {
      //vérification de la date de publication du livre
      const publicationYear = parseInt(bookObject.year);
      const currentYear = new Date().getFullYear();
      if (bookObject.year > currentYear || isNaN(publicationYear)) {
        return res.status(400).json("Année de publication invalide");
      }

      // mise à jour du livre
      await Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id});
      res.status(200).json({message : 'Livre modifié!'});
    }
  }
  catch(error) {
    res.status(400).json({ error });
  }
}

// DELETE : suppression d'un livre
exports.deleteBook = (req, res, next) => {
  // recherche du livre dont l'identifiant est celui fourni par la requête
  Book.findOne({ _id: req.params.id})
  .then(book => {
    // on vérifie si l'utilisateur loggué est celui qui a créé le livre
    if (book.userId != req.auth.userId) {
      res.status(401).json({message: 'Not authorized'});
    } else {
      const filename = book.imageUrl.split('/images/')[1];
      // suppression l'imade du répertoire images
      fs.unlink(`images/${filename}`, () => {
      // suppression du livre de la BD
      Book.deleteOne({_id: req.params.id})
      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
      .catch(error => res.status(401).json({ error }));
      });
    }
  })
  .catch( error => {
    res.status(500).json({ error });
  });
};

// GET : affichage d'un livre sélectionné
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => { res.status(200).json(book)})
  .catch((error) => {res.status(404).json({error: error});});
};

// GET : affichage de tous les livres
exports.getAllBooks = (req, res, next) => {
  // récupération de tous les livres de la BD
  Book.find()
  .then((books) => {res.status(200).json(books);})
  .catch((error) => {res.status(400).json({error: error});});
};

// GET : affichage des livres les mieux notés
exports.getBestRating = (req, res, next) => {
  // recherche dans la base de données, tri en ordre décroissant et limité à 3 résultats
  Book.find().sort({ averageRating: -1 }).limit(3)
  .then ((books) => {res.status(200).json(books);})
  .catch((error) => {res.status(400).json({error: error});});
}

// PUT : notation d'un livre
exports.rateBook = (req, res, next) => {

  // Stockage de la requête dans une constante
  const ratingObject = { ...req.body, grade: req.body.rating };
  // Suppression _id envoyé par le front
  delete ratingObject._id;

  Book.findOne({_id: req.params.id})
  .then(book => {
    // Récup du tableau des utilisateurs ayant déjà noté le livre 
    const userRatings = book.ratings;

    // Vérification de l'unicité du vote pour l'utilisateur connecté
    const hasVoted = userRatings.find((rating) => rating.userId === req.auth.userId)
    if (hasVoted) {
      res.status(403).json({ message : 'Vous avez déjà voté pour ce livre' });
      return;
    }
    
    // Ajout de la note
    userRatings.push(ratingObject);
     // Tableau des notes du livre
    const grades = userRatings.map(rating => rating.grade);

    // Calcul de la moyenne des notes
    const averageGrades = calculateAverage(grades);
    book.averageRating = averageGrades;

    // Mise à jour du livre avec la nouvelle note 
    Book.updateOne({ _id: req.params.id }, { ratings: userRatings, averageRating:averageGrades, _id: req.params.id })
    .then(() => { res.status(201).json()})
    .catch(error => { res.status(400).json( { error })});
        res.status(200).json(book);
    }
  )
  .catch((error) => {
    res.status(404).json({ error });
  });
}

