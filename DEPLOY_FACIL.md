# 🚀 Despliegue FÁCIL del Backend (SIN Git)

## Método Simple: Subir Archivos Directamente a GitHub

### Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Completa:
   - **Repository name**: `ojo-critico-backend`
   - **Description**: "Backend API para detección de deepfakes"
   - **Public** o **Private** (tu elección)
   - ✅ Marca "Add a README file"
3. Click en "Create repository"

### Paso 2: Subir Archivos

1. En tu nuevo repositorio, click en "Add file" → "Upload files"
2. Arrastra estos archivos desde `C:\Users\elian\.gemini\antigravity\scratch\ojo-critico\backend`:
   - `index.js`
   - `package.json`
   - `.env.example`
   - `.gitignore`
   - `README.md`
3. Escribe un mensaje: "Initial commit"
4. Click en "Commit changes"

### Paso 3: Desplegar en Render

1. Ve a https://dashboard.render.com/
2. Click en "New +" → "Web Service"
3. Click en "Connect a repository"
4. Selecciona tu repositorio `ojo-critico-backend`
5. Configuración:
   ```
   Name: ojo-critico-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. **Environment Variables** (muy importante):
   Click en "Advanced" y agrega:
   ```
   NODE_ENV = production
   PORT = 3000
   DEEPWARE_API_KEY = (déjalo vacío por ahora)
   SIGHTENGINE_API_USER = (déjalo vacío por ahora)
   SIGHTENGINE_API_SECRET = (déjalo vacío por ahora)
   AI_OR_NOT_API_KEY = (déjalo vacío por ahora)
   ```

7. Click en "Create Web Service"

### Paso 4: Obtener tu URL

Render desplegará tu backend en ~5 minutos.

Tu URL será algo como:
```
https://ojo-critico-backend.onrender.com
```

**Copia esta URL**, la necesitarás para la app.

---

## ✅ Verificar que Funciona

Abre tu navegador y ve a:
```
https://TU-URL.onrender.com
```

Deberías ver un JSON con el mensaje del servidor.

---

## 📝 Nota sobre las API Keys

El backend funcionará en "modo simulación" sin las API keys reales. Para producción real, necesitarás:

1. **Deepware**: https://deepware.ai/
2. **Sightengine**: https://sightengine.com/
3. **AI or Not**: https://www.aiornot.com/

Luego actualiza las variables de entorno en Render.

---

## 🎯 Siguiente Paso

Una vez tengas la URL:

1. Abre `C:\Users\elian\.gemini\antigravity\scratch\ojo-critico\flutter_app\lib\main.dart`
2. Busca la línea 22 y cambia:
   ```dart
   static const String baseUrl = 'https://TU-URL.onrender.com';
   ```
3. Guarda el archivo
4. Construye el AAB:
   ```bash
   flutter build appbundle --release
   ```

¡Listo para subir a Play Store! 🎉
