# 📇 Agenda de Contactos AWS

Aplicación web full-stack para gestión de contactos con integración de servicios AWS (RDS, S3, EC2). Desarrollada con Node.js, Express y MySQL.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![AWS](https://img.shields.io/badge/AWS-RDS%20%7C%20S3%20%7C%20EC2-yellow)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Despliegue en AWS](#-despliegue-en-aws)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar contactos
- 📸 **Gestión de Fotos**: Subida y almacenamiento de fotos de perfil en AWS S3
- 🔍 **Búsqueda**: Filtrado de contactos por apellido
- 🎨 **Interfaz Moderna**: UI responsive con Bootstrap 5
- ☁️ **Integración AWS**: 
  - Amazon RDS (MySQL) para base de datos
  - Amazon S3 para almacenamiento de archivos
  - Amazon EC2 para hosting
- 🔒 **Validación**: Validación de campos y formatos de archivo
- 📱 **Responsive**: Compatible con dispositivos móviles y desktop

---

## 🏗️ Arquitectura

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Internet (HTTP/HTTPS)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   EC2 Instance (Ubuntu 22.04)        │
│   ┌────────────────────────────┐    │
│   │  Nginx (Puerto 80)         │    │
│   └────────┬───────────────────┘    │
│            │                         │
│   ┌────────▼───────────────────┐    │
│   │  Node.js + Express (3000)  │    │
│   └────┬──────────────┬────────┘    │
└────────┼──────────────┼─────────────┘
         │              │
         ▼              ▼
┌─────────────┐  ┌─────────────┐
│  RDS MySQL  │  │  S3 Bucket  │
│ (Datos)     │  │  (Fotos)    │
└─────────────┘  └─────────────┘
```

---

## 🛠️ Tecnologías

### Backend
- **Node.js** v20.x - Entorno de ejecución
- **Express.js** v4.18 - Framework web
- **MySQL2** v3.6 - Cliente MySQL con soporte para Promises
- **AWS SDK** v2.x - SDK de AWS para JavaScript
- **Multer** v1.4 - Middleware para manejo de archivos
- **EJS** v3.1 - Motor de plantillas

### Frontend
- **Bootstrap 5.3** - Framework CSS
- **Bootstrap Icons** - Iconografía

### Servicios AWS
- **Amazon RDS** - Base de datos MySQL administrada
- **Amazon S3** - Almacenamiento de objetos
- **Amazon EC2** - Servidor de aplicaciones

### DevOps
- **PM2** - Gestor de procesos Node.js
- **Nginx** - Servidor web y proxy inverso

---

## 📦 Requisitos Previos

### Local
- Node.js >= 18.x
- npm >= 9.x
- Git

### AWS
- Cuenta de AWS activa
- AWS RDS MySQL instance
- AWS S3 bucket configurado
- AWS EC2 instance (Ubuntu 22.04)
- Usuario IAM con permisos S3

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/agenda-contactos-aws.git
cd agenda-contactos-aws
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales reales (ver sección [Configuración](#-configuración))

### 4. Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

---

## ⚙️ Configuración

### Archivo `.env`

Crea un archivo `.env` con las siguientes variables:

```env
# Base de Datos RDS MySQL
DB_HOST=tu-endpoint-rds.region.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=TuPasswordSeguro123
DB_NAME=agenda_db
DB_PORT=3306

# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_BUCKET_NAME=tu-bucket-nombre

# Servidor
PORT=3000
NODE_ENV=production
```

### Configurar RDS MySQL

1. Crear instancia RDS MySQL 8.0
2. Configurar Security Group para permitir puerto 3306
3. Obtener endpoint de conexión
4. La tabla se crea automáticamente al iniciar la aplicación

### Configurar S3

1. Crear bucket en AWS S3
2. Desactivar "Block all public access"
3. Configurar Bucket Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::tu-bucket-nombre/*"
        }
    ]
}
```

4. Configurar CORS:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

---

## 💻 Uso

### Funcionalidades Principales

#### 1. Listar Contactos
- Accede a la página principal para ver todos los contactos
- Las fotos se cargan automáticamente desde S3

#### 2. Crear Contacto
- Click en "Nuevo Contacto"
- Completa el formulario:
  - Nombre
  - Apellidos
  - Correo electrónico
  - Fecha de nacimiento
  - Foto (opcional, máx 5MB)
- Click en "Guardar Contacto"

#### 3. Buscar Contacto
- Usa el campo de búsqueda en la parte superior
- Ingresa el apellido a buscar
- Click en "Buscar"

#### 4. Editar Contacto
- Click en el botón amarillo (lápiz) junto al contacto
- Modifica los campos necesarios
- Puedes cambiar la foto
- Click en "Actualizar Contacto"

#### 5. Eliminar Contacto
- Click en el botón rojo (basura) junto al contacto
- Confirma la eliminación
- Se eliminará el registro de la BD y la foto de S3

---

## ☁️ Despliegue en AWS

### 1. Conectar a EC2

```bash
ssh -i "tu-key.pem" ubuntu@tu-ip-publica
```

### 2. Instalar Node.js

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 3. Subir archivos

Desde tu máquina local:

```bash
scp -i "tu-key.pem" -r ./* ubuntu@tu-ip-publica:~/agenda-contactos-aws/
```

### 4. Instalar dependencias en EC2

```bash
cd ~/agenda-contactos-aws
npm install
```

### 5. Configurar PM2

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name agenda-contactos

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### 6. Configurar Nginx (Opcional)

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/agenda-contactos
```

Configuración Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio-o-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/agenda-contactos /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📁 Estructura del Proyecto

```
agenda-contactos-aws/
├── config/
│   ├── database.js          # Configuración de conexión a RDS
│   └── s3.js                # Configuración de AWS S3
├── views/
│   ├── index.ejs            # Vista principal (lista de contactos)
│   ├── formulario.ejs       # Vista de crear/editar contacto
│   └── buscar.ejs           # Vista de resultados de búsqueda
├── .env                     # Variables de entorno (NO subir a Git)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Dependencias del proyecto
├── server.js                # Servidor principal Express
└── README.md                # Este archivo
```

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista todos los contactos |
| GET | `/nuevo` | Formulario para nuevo contacto |
| POST | `/contactos` | Crear nuevo contacto |
| GET | `/buscar?apellido=X` | Buscar contactos por apellido |
| GET | `/editar/:id` | Formulario para editar contacto |
| PUT | `/contactos/:id` | Actualizar contacto existente |
| DELETE | `/contactos/:id` | Eliminar contacto |

---

## 📸 Capturas de Pantalla

### Página Principal
Lista de todos los contactos con fotos cargadas desde S3.

### Crear Contacto
Formulario para agregar nuevos contactos con preview de imagen.

### Búsqueda
Sistema de búsqueda por apellido con resultados filtrados.

### Editar Contacto
Modificación de datos existentes con opción de cambiar foto.

---

## 🐛 Solución de Problemas

### Error: Cannot connect to RDS

**Problema**: Timeout o conexión rechazada

**Solución**:
- Verifica Security Group de RDS permite puerto 3306
- Verifica credenciales en `.env`
- Prueba conexión: `telnet tu-endpoint 3306`

### Error: AccessControlListNotSupported

**Problema**: Error al subir archivos a S3

**Solución**:
- Remueve `ACL: 'public-read'` del código
- Usa Bucket Policy en su lugar
- Verifica que el bucket NO tenga ACLs habilitados

### Error: Cannot upload to S3

**Problema**: Errores de permisos

**Solución**:
- Verifica credenciales AWS en `.env`
- Verifica que el usuario IAM tenga permisos S3
- Verifica nombre del bucket

### Puerto 3000 no accesible

**Problema**: No se puede acceder a la aplicación

**Solución**:
- Verifica Security Group de EC2 permite puerto 3000
- Verifica que la app está corriendo: `pm2 status`
- Verifica logs: `pm2 logs agenda-contactos`

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- AWS por los servicios cloud
- Node.js community
- Bootstrap team
- Todos los que contribuyeron a las librerías open source utilizadas

---

## 📚 Recursos Adicionales

- [Documentación AWS RDS](https://docs.aws.amazon.com/rds/)
- [Documentación AWS S3](https://docs.aws.amazon.com/s3/)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---
