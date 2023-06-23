// gestion des fichiers upload
const multer = require('multer');
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

//configuration du chemin et du nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); 
  },
  filename: (req, file, callback) => {
    console.log('file.originalname',file.originalname)
    const name = file.originalname.split(' ').join('_');
    console.log('name',name);
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
    console.log('nameDate',name+ Date.now() + '.' + extension);

  }
}); console.log('destination',storage.destination);

module.exports = multer({storage: storage}).single('image');

