console.log('dans sharp');
const sharp = require('sharp');
const fs = require('fs');
sharp.cache(false);

const resizedImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = req.file.path;
  console.log('sharp imagePath',imagePath);
  const outputFilePath = `${imagePath.split('.')[0]}resized.webp`;
  console.log('sharp outputFilePath',outputFilePath);

  try {
    // Redimensionner l'image en utilisant Sharp
    await sharp(imagePath)
      .resize(600, 600,{ fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputFilePath);
      console.log('outputFilePath',outputFilePath);

     // Suppression de l'image d'origine et mise à jour du chemin 
    fs.unlink(imagePath, (err) => {
      req.file.path = outputFilePath;
      if (err) {
        console.error(err)
      }
      console.log('path après unlink',req.file.path);
      next();
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
}

module.exports = resizedImage