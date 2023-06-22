// mongoose facilite l'écriture et la lecture dans une bd
const mongoose = require('mongoose');

// ajout du plugin  mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');
/*
    nous créons un schéma de données qui contient les champs souhaités pour chaque User, 
    indique leur type ainsi que leur caractère (obligatoire ou non). 
    Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. 
    Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose ;
    ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « User », 
    le rendant par là même disponible pour notre application Express.
*/ 

// création du schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// plugin utilisé pour valider le caractère unique de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);