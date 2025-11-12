require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');
const { connectDB, getConnection } = require('./config/database');
const { uploadToS3, deleteFromS3 } = require('./config/s3');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Multer (almacenamiento temporal)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
  }
});

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Conectar a la base de datos al iniciar
connectDB();

// ========== RUTAS ==========

// 1. Página principal - Listar todos los contactos
app.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const [contactos] = await connection.query(
      'SELECT * FROM contactos ORDER BY apellidos, nombre'
    );
    res.render('index', { contactos });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).send('Error al cargar contactos');
  }
});

// 2. Formulario para nuevo contacto
app.get('/nuevo', (req, res) => {
  res.render('formulario', { contacto: null, accion: 'crear' });
});

// 3. Crear nuevo contacto
app.post('/contactos', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    let fotoUrl = null;

    // Si hay foto, subirla a S3
    if (req.file) {
      const fileName = `contacto_${Date.now()}_${req.file.originalname}`;
      fotoUrl = await uploadToS3(req.file.buffer, fileName, req.file.mimetype);
    }

    const connection = await getConnection();
    await connection.query(
      'INSERT INTO contactos (nombre, apellidos, correo, fecha_nac, foto_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellidos, correo, fecha_nac, fotoUrl]
    );

    res.redirect('/');
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).send('Error al crear contacto');
  }
});

// 4. Buscar por apellido
app.get('/buscar', async (req, res) => {
  try {
    const { apellido } = req.query;
    const connection = await getConnection();
    const [contactos] = await connection.query(
      'SELECT * FROM contactos WHERE apellidos LIKE ? ORDER BY apellidos, nombre',
      [`%${apellido}%`]
    );
    res.render('buscar', { contactos, apellido });
  } catch (error) {
    console.error('Error al buscar contactos:', error);
    res.status(500).send('Error al buscar contactos');
  }
});

// 5. Formulario para editar contacto
app.get('/editar/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    const [contactos] = await connection.query(
      'SELECT * FROM contactos WHERE id = ?',
      [req.params.id]
    );
    
    if (contactos.length === 0) {
      return res.status(404).send('Contacto no encontrado');
    }

    res.render('formulario', { contacto: contactos[0], accion: 'editar' });
  } catch (error) {
    console.error('Error al cargar contacto:', error);
    res.status(500).send('Error al cargar contacto');
  }
});

// 6. Actualizar contacto
app.put('/contactos/:id', upload.single('foto'), async (req, res) => {
  try {
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    const connection = await getConnection();
    
    // Obtener contacto actual
    const [contactoActual] = await connection.query(
      'SELECT foto_url FROM contactos WHERE id = ?',
      [req.params.id]
    );

    let fotoUrl = contactoActual[0].foto_url;

    // Si hay nueva foto
    if (req.file) {
      // Eliminar foto anterior de S3
      if (fotoUrl) {
        await deleteFromS3(fotoUrl);
      }
      
      // Subir nueva foto
      const fileName = `contacto_${Date.now()}_${req.file.originalname}`;
      fotoUrl = await uploadToS3(req.file.buffer, fileName, req.file.mimetype);
    }

    // Actualizar en BD
    await connection.query(
      'UPDATE contactos SET nombre = ?, apellidos = ?, correo = ?, fecha_nac = ?, foto_url = ? WHERE id = ?',
      [nombre, apellidos, correo, fecha_nac, fotoUrl, req.params.id]
    );

    res.redirect('/');
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    res.status(500).send('Error al actualizar contacto');
  }
});

// 7. Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    
    // Obtener foto_url para eliminar de S3
    const [contacto] = await connection.query(
      'SELECT foto_url FROM contactos WHERE id = ?',
      [req.params.id]
    );

    if (contacto.length > 0 && contacto[0].foto_url) {
      await deleteFromS3(contacto[0].foto_url);
    }

    // Eliminar de BD
    await connection.query('DELETE FROM contactos WHERE id = ?', [req.params.id]);

    res.redirect('/');
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).send('Error al eliminar contacto');
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV}`);
});