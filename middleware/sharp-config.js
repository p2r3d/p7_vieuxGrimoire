// redimensionnement d'images 
const sharp = require('sharp');
const fs = require('fs');
sharp.cache(false);

const resizedImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = req.file.path;
  const outputFilePath = `${imagePath.split('.')[0]}resized.webp`;

  try {
    // images en 600*600
    await sharp(imagePath)
      .resize(600, 600,{ fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputFilePath)

     // on remplace l'image d'origine  
    fs.unlink(imagePath, (err) => {
      // mise à jour path
      req.file.path = outputFilePath
      if (err) {
        console.error(err)
      }
      next()
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur traitement image' })
  }
}

module.exports = resizedImage