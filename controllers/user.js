//****Middlewares d'authentification
const User = require ('../models/User');

const bcrypt = require ('bcrypt');

// création et vérification des tokens
const jwt = require ('jsonwebtoken');

// enregistrement des utilisateurs
exports.signup = (req, res, next) => {
  // méthode asynchrone du cryptage du mdp, sault de 10 tours
	bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // enregistrement dans la BD
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json( { error } ));
    })
    .catch(error => res.status(500).json({ error })); // erreur 500 serveur
};

// connexion des utilisateurs existants
exports.login = (req, res, next) => {
  // on tuilise la méthode findOne de Mogoose pour trouver un user qui possède l'email de la requête
  User.findOne({ email: req.body.email })
  .then(user => {
    // pas de user trouvé
    if (!user) {
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
    }
    // on compare le mdp fourni avec celui haché stocké dans la BD
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {
      // les mdp sont différents
      if (!valid) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
      // les mdp correspondent 
      res.status(200).json({
        userId: user._id,
        token: jwt.sign( // token généré, contient id user + signé avec clé secrète
				  {userId:user._id}, // payload = données que l'on veut encoder
				  process.env.SECRET_KEY,	// clé secrète pour l'encodage
					{expiresIn: '24h'} // délai
				)
      });             
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};