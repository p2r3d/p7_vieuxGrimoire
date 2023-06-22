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
      console.log('user',user);
      // enregistrement dans la BD
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json( { error } ));
    })
    .catch(error => res.status(500).json({ error })); // erreur 500 serveur
};

// connexion des utilisateurs existants
exports.login = (req, res, next) => {
 	console.log('req.body.email',req.body.email);
  User.findOne({ email: req.body.email })
    .then(user => {
       if (!user) {
        console.log('Paire login/mot de passe incorrecte')
         return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
       }
       bcrypt.compare(req.body.password, user.password)
         .then(valid => {
            if (!valid) {
              console.log('non valide)');
               return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            console.log(' valide, token:');
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
								{userId:user._id}, // payload = données que l'on veut encoder
								'RANDOM_TOKEN_SECRET',	// clé secrète pour l'encodage
								{expiresIn: '24h'} // délai
							)
             });             
         })
         .catch(error => res.status(500).json({ error }));
     })
     .catch(error => res.status(500).json({ error }));
};