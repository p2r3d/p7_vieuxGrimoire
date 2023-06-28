// middleware qui redimensionne les images téléchargées à l'aide de Sharp(bibliothèque de manipulation d'images)
const sharp = require('sharp');
const fs = require('fs');
sharp.cache(false);

const resizedImage = async (req, res, next) => {
  // vérification si une image est présente
  if (!req.file) {
    return next();
  }
    // Si une image est présente
  const imagePath = req.file.path;
  const outputFilePath = `${imagePath.split('.')[0]}resized.webp`;

  try {
    // Redimensionner l'image en utilisant Sharp
    await sharp(imagePath)
      .resize(600, 600,{ fit: 'cover' }) // redimensionnement
      .webp({ quality: 80 }) // conversion en webp
      .toFile(outputFilePath); // enregistrement de l'image

     // Suppression de l'image d'origine et mise à jour du chemin 
    fs.unlink(imagePath, (err) => {
      req.file.path = outputFilePath;
      if (err) {
        console.error(err)
      }
      next();
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
}

module.exports = resizedImage