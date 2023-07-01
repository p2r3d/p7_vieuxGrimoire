// mongoose facilite l'écriture et la lecture dans une bd
const mongoose = require('mongoose');

// ajout du plugin  mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

// création du schéma de données
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// plugin utilisé pour valider le caractère unique de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
