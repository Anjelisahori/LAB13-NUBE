const AWS = require('aws-sdk');

// Configurar AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Subir archivo a S3
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {String} fileName - Nombre del archivo
 * @param {String} mimeType - Tipo MIME del archivo
 * @returns {Promise<String>} URL pública del archivo
 */
const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `contactos/${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType
    // ACL removido - se usa Bucket Policy en su lugar
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`✅ Archivo subido a S3: ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error('❌ Error al subir archivo a S3:', error);
    throw error;
  }
};

/**
 * Eliminar archivo de S3
 * @param {String} fileUrl - URL completa del archivo en S3
 */
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extraer key del URL
    const key = fileUrl.split('.com/')[1];
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
    console.log(`✅ Archivo eliminado de S3: ${key}`);
  } catch (error) {
    console.error('❌ Error al eliminar archivo de S3:', error);
    throw error;
  }
};

module.exports = { uploadToS3, deleteFromS3 };