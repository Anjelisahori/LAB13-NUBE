const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Verificar conexión
    const connection = await pool.getConnection();
    console.log('✅ Conectado a RDS MySQL');

    // Crear tabla si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        fecha_nac DATE NOT NULL,
        foto_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla contactos verificada/creada');

    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a RDS MySQL:', error.message);
    process.exit(1);
  }
};

const getConnection = async () => {
  if (!pool) {
    throw new Error('Base de datos no inicializada. Llama a connectDB() primero.');
  }
  return pool;
};

module.exports = { connectDB, getConnection };