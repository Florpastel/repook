# Ojo Crítico - Backend API

Backend server para la aplicación móvil Ojo Crítico - Detección de Deepfakes.

## Tecnologías

- Node.js + Express
- APIs: Deepware, Sightengine, AI or Not
- Multer para manejo de archivos
- Helmet para seguridad

## Instalación Local

```bash
npm install
cp .env.example .env
# Edita .env con tus API keys
npm start
```

## Variables de Entorno Requeridas

```
DEEPWARE_API_KEY=tu_clave
SIGHTENGINE_API_USER=tu_usuario
SIGHTENGINE_API_SECRET=tu_secreto
AI_OR_NOT_API_KEY=tu_clave
PORT=3000
NODE_ENV=production
```

## Endpoints

- `GET /` - Health check
- `POST /analyze/video` - Analizar video
- `POST /analyze/image` - Analizar imagen
- `POST /analyze/audio` - Analizar audio

## Despliegue

### Render
1. Conecta este repositorio
2. Configura las variables de entorno
3. Deploy automático

### Railway
```bash
railway login
railway init
railway up
```

## Licencia

MIT
