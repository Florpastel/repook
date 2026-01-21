# 🚀 Guía de Despliegue del Backend en Render

## Opción 1: Despliegue Directo desde Carpeta Local

### Paso 1: Inicializar Git en la carpeta backend

Abre PowerShell y ejecuta:

```powershell
cd C:\Users\elian\.gemini\antigravity\scratch\ojo-critico\backend

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Ojo Critico Backend"
```

### Paso 2: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `ojo-critico-backend`
3. Descripción: "Backend API para detección de deepfakes"
4. **Público** o **Privado** (tu elección)
5. **NO** marques "Add README" (ya lo tenemos)
6. Click en "Create repository"

### Paso 3: Subir código a GitHub

GitHub te mostrará comandos. Copia y ejecuta en PowerShell:

```powershell
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/ojo-critico-backend.git
git branch -M main
git push -u origin main
```

Si te pide credenciales:
- Usuario: tu usuario de GitHub
- Contraseña: usa un **Personal Access Token** (no tu contraseña normal)
  - Genera uno en: https://github.com/settings/tokens

### Paso 4: Desplegar en Render

1. Ve a https://dashboard.render.com/
2. Click en "New +" → "Web Service"
3. Click en "Connect a repository"
4. Autoriza Render a acceder a GitHub
5. Selecciona el repositorio `ojo-critico-backend`
6. Configuración:
   - **Name**: `ojo-critico-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

7. **Variables de Entorno** (click en "Advanced"):
   ```
   NODE_ENV=production
   PORT=3000
   DEEPWARE_API_KEY=tu_clave_aqui
   SIGHTENGINE_API_USER=tu_usuario_aqui
   SIGHTENGINE_API_SECRET=tu_secreto_aqui
   AI_OR_NOT_API_KEY=tu_clave_aqui
   MAX_FILE_SIZE=52428800
   ```

8. Click en "Create Web Service"

### Paso 5: Obtener la URL

Render desplegará tu backend y te dará una URL como:
```
https://ojo-critico-backend.onrender.com
```

**Guarda esta URL**, la necesitarás para actualizar la app Flutter.

---

## Opción 2: Despliegue con Railway (Más Fácil)

### Paso 1: Instalar Railway CLI

```powershell
npm install -g @railway/cli
```

### Paso 2: Desplegar

```powershell
cd C:\Users\elian\.gemini\antigravity\scratch\ojo-critico\backend

# Login
railway login

# Crear proyecto
railway init

# Desplegar
railway up

# Agregar variables de entorno
railway variables set DEEPWARE_API_KEY=tu_clave
railway variables set SIGHTENGINE_API_USER=tu_usuario
railway variables set SIGHTENGINE_API_SECRET=tu_secreto
railway variables set AI_OR_NOT_API_KEY=tu_clave
railway variables set NODE_ENV=production

# Obtener URL
railway domain
```

---

## ✅ Verificar que Funciona

Una vez desplegado, prueba tu backend:

```powershell
# Reemplaza con tu URL real
curl https://tu-backend.onrender.com
```

Deberías ver:
```json
{
  "message": "Ojo Crítico API - Servidor funcionando",
  "version": "1.0.0",
  "endpoints": [...]
}
```

---

## 🔄 Próximo Paso

Una vez tengas la URL del backend:

1. Abre `flutter_app/lib/main.dart`
2. Actualiza la línea 22:
   ```dart
   static const String baseUrl = 'https://TU-URL-AQUI.onrender.com';
   ```
3. Construye el AAB:
   ```bash
   flutter build appbundle --release
   ```

¡Listo para Play Store! 🎉
