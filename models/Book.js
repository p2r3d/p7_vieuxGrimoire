// mongoose facilite l'écriture et la lecture dans une bd
const mongoose = require('mongoose');

/*
    nous créons un schéma de données qui contient les champs souhaités pour chaque Book, 
    indique leur type ainsi que leur caractère (obligatoire ou non). 
    Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. 
    Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose ;
    ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Book », 
    le rendant par là même disponible pour notre application Express.
*/ 
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
        userId: { type: String, required: true },
        grade: { type: Number, required: true},
    }
  ],
  averageRating: { type: Number },
});

module.exports = mongoose.model('Book', bookSchema);