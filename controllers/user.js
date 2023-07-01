//****Middlewares d'authentification
const User = require ('../models/User');
const bcrypt = require ('bcrypt');

// création et vérification des tokens
const jwt = require ('jsonwebtoken');

// enregistrement des users
exports.signup = async (req, res, next) => {
  try {
  // On vérifie que l'email n'existe pas dans la BD
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        // email existant
        return res.status(401).json({ message: 'Cet email existe déjà dans la base de données' });
    }
    // hachage du mdp 
    const hachedPwd = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hachedPwd
    });
    // Enregistrement dans la base de données
    await newUser.save()
    res.status(201).json({ message: 'Utilisateur créé !' });
  }
  catch(error) {
    res.status(500).json({ error });
  }
}

// connexion des utilisateurs existants
exports.login = async (req, res, next) => {
  try {
    // on utilise la méthode findOne de Mogoose pour trouver un user qui possède l'email de la requête
    const user = await User.findOne({ email: req.body.email });
    // pas de user trouvé
    if (!user) {
      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
    }
    // on compare le mdp fourni avec celui haché stocké dans la BD
    const valid = await bcrypt.compare(req.body.password, user.password);
    // si les mdp sont différents
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
  }
  catch(error) {
    res.status(500).json({ error });
  } 
}