// extrait les infos contenues dans le token, vérifier qu'il est valide, pour les transmettre 
// aux gestionnaires de routes

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
      // extraction de la 2ème partie du token (après "bearer")
      const token = req.headers.authorization.split(' ')[1];
      console.log('token',token);

      // décodage du token
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      console.log('decodedToken',decodedToken);

       // extraction de l'id de l'utilisateur du token
       const userId = decodedToken.userId;
       console.log('decodedToken',decodedToken);

       // ajout de l'id à l'objet Request pour que les différentes routes puissent l'exploiter
       req.auth = {userId: userId };
       console.log('userId',userId);
	   next();
   } catch(error) {
     res.status(401).json({ error }); // token non valide
   }
};
