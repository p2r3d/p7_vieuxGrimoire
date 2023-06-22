const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// import des modèles
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

  // connexion à la base de données
mongoose.connect('mongodb+srv://pac:jddMupNpRnnVFKVK@cluster0.xfinhde.mongodb.net/',
  { useNewUrlParser: true,    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // création de l'application
  const app = express();


// middleware général(sans route spécifiée) appliqué partout, erreur cors
app.use((req, res, next) => {
    // Accès à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Autorisation d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); 
});

// extraction json des requêtes
 app.use(express.json());

// on enregistre le router
app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
// gestion de la requête vers le répertoire image, gestion des fichiers statiques
app.use('/images', express.static(path.join(__dirname,'images')));

module.exports = app;