const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SEGURIDAD: Configuración de protecciones
// ============================================
// Helmet protege contra vulnerabilidades comunes (XSS, clickjacking, etc.)
app.use(helmet());

// CORS permite que la app Flutter se conecte desde diferentes orígenes
app.use(cors());

// Parser para JSON
app.use(express.json());

// ============================================
// CONFIGURACIÓN DE MULTER (Subida de archivos)
// ============================================
// Almacenamiento temporal en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // 50MB por defecto
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo permitidos
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/jpg',
      'video/mp4', 'video/mpeg', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/mp3'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// ============================================
// FUNCIONES DE INTEGRACIÓN CON APIs
// ============================================

/**
 * Analiza un video usando la API de Deepware
 * @param {string} filePath - Ruta del archivo de video
 * @returns {Promise<Object>} - Resultado del análisis
 */
async function analyzeVideoWithDeepware(filePath) {
  try {
    const formData = new FormData();
    const fileBuffer = await fs.readFile(filePath);
    formData.append('video', fileBuffer);

    const response = await axios.post('https://api.deepware.ai/v1/scan', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPWARE_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      probability: response.data.fake_probability || 0,
      details: response.data.details || {},
      provider: 'Deepware'
    };
  } catch (error) {
    console.error('Error en Deepware API:', error.message);
    // Fallback: simulación para desarrollo (ELIMINAR EN PRODUCCIÓN)
    return simulateAnalysis('video');
  }
}

/**
 * Analiza una imagen usando la API de Sightengine
 * @param {string} filePath - Ruta del archivo de imagen
 * @returns {Promise<Object>} - Resultado del análisis
 */
async function analyzeImageWithSightengine(filePath) {
  try {
    const formData = new FormData();
    const fileBuffer = await fs.readFile(filePath);
    formData.append('media', fileBuffer);

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', formData, {
      params: {
        models: 'genai',
        api_user: process.env.SIGHTENGINE_API_USER,
        api_secret: process.env.SIGHTENGINE_API_SECRET
      }
    });

    return {
      probability: response.data.type?.ai_generated || 0,
      details: response.data,
      provider: 'Sightengine'
    };
  } catch (error) {
    console.error('Error en Sightengine API:', error.message);
    return simulateAnalysis('image');
  }
}

/**
 * Analiza un audio usando la API de AI or Not
 * @param {string} filePath - Ruta del archivo de audio
 * @returns {Promise<Object>} - Resultado del análisis
 */
async function analyzeAudioWithAIorNot(filePath) {
  try {
    const formData = new FormData();
    const fileBuffer = await fs.readFile(filePath);
    formData.append('audio', fileBuffer);

    const response = await axios.post('https://api.aiornot.com/v1/reports/audio', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.AI_OR_NOT_API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      probability: response.data.ai.probability || 0,
      details: response.data,
      provider: 'AI or Not'
    };
  } catch (error) {
    console.error('Error en AI or Not API:', error.message);
    return simulateAnalysis('audio');
  }
}

/**
 * Simulación de análisis para desarrollo/testing
 * NOTA: Eliminar en producción cuando las APIs estén configuradas
 */
function simulateAnalysis(type) {
  const probability = Math.random() * 100;
  const signs = [];

  // Simular detección de los 7 signos reveladores
  if (probability > 60) {
    const possibleSigns = [
      'Sincronización labial deficiente en fonemas P/B/M',
      'Patrón de parpadeo antinatural (< 10 veces/min)',
      'Inconsistencias en reflejos de luz en los ojos',
      'Sombras faciales inconsistentes con la fuente de luz',
      'Artefactos digitales en bordes del cabello',
      'Textura de piel excesivamente suave',
      'Movimientos de cabeza robóticos'
    ];
    
    const numSigns = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numSigns; i++) {
      signs.push(possibleSigns[Math.floor(Math.random() * possibleSigns.length)]);
    }
  }

  return {
    probability: probability,
    details: { detected_signs: signs },
    provider: 'Simulation'
  };
}

/**
 * Determina el nivel de riesgo y mensaje basado en la probabilidad
 */
function getRiskAssessment(probability, details) {
  if (probability > 80) {
    return {
      status: 'ALERT',
      risk_level: 'High',
      message: '⚠️ Alto riesgo de Deepfake detectado',
      recommendation: 'Este contenido muestra múltiples signos de manipulación por IA. No confíes en su autenticidad.',
      detected_signs: details.detected_signs || []
    };
  } else if (probability >= 30 && probability <= 70) {
    return {
      status: 'UNCERTAIN',
      risk_level: 'Medium',
      message: '⚡ Resultado incierto - Verificación manual requerida',
      recommendation: 'Revisa manualmente: ¿Los ojos reflejan la luz correctamente? ¿Las sombras son consistentes? ¿El parpadeo es natural?',
      detected_signs: details.detected_signs || []
    };
  } else {
    return {
      status: 'SAFE',
      risk_level: 'Low',
      message: '✅ Contenido probablemente auténtico',
      recommendation: 'No se detectaron signos significativos de manipulación, pero mantén siempre un pensamiento crítico.',
      detected_signs: []
    };
  }
}

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Ojo Crítico API - Servidor funcionando',
    version: '1.0.0',
    endpoints: [
      'POST /analyze/video',
      'POST /analyze/image',
      'POST /analyze/audio'
    ]
  });
});

// Analizar video
app.post('/analyze/video', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    filePath = req.file.path;
    console.log(`Analizando video: ${req.file.originalname}`);

    // Llamar a la API de detección
    const result = await analyzeVideoWithDeepware(filePath);
    
    // Evaluar riesgo
    const assessment = getRiskAssessment(result.probability, result.details);

    // PRIVACIDAD: Eliminar archivo inmediatamente después del análisis
    await fs.unlink(filePath);
    console.log(`Archivo eliminado por privacidad: ${filePath}`);

    res.json({
      success: true,
      type: 'video',
      probability: result.probability,
      provider: result.provider,
      ...assessment
    });

  } catch (error) {
    console.error('Error al analizar video:', error);
    
    // Asegurar eliminación del archivo incluso en caso de error
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Error al procesar el video',
      details: error.message
    });
  }
});

// Analizar imagen
app.post('/analyze/image', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    filePath = req.file.path;
    console.log(`Analizando imagen: ${req.file.originalname}`);

    const result = await analyzeImageWithSightengine(filePath);
    const assessment = getRiskAssessment(result.probability, result.details);

    // PRIVACIDAD: Eliminar archivo
    await fs.unlink(filePath);
    console.log(`Archivo eliminado por privacidad: ${filePath}`);

    res.json({
      success: true,
      type: 'image',
      probability: result.probability,
      provider: result.provider,
      ...assessment
    });

  } catch (error) {
    console.error('Error al analizar imagen:', error);
    
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Error al procesar la imagen',
      details: error.message
    });
  }
});

// Analizar audio
app.post('/analyze/audio', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    filePath = req.file.path;
    console.log(`Analizando audio: ${req.file.originalname}`);

    const result = await analyzeAudioWithAIorNot(filePath);
    const assessment = getRiskAssessment(result.probability, result.details);

    // PRIVACIDAD: Eliminar archivo
    await fs.unlink(filePath);
    console.log(`Archivo eliminado por privacidad: ${filePath}`);

    res.json({
      success: true,
      type: 'audio',
      probability: result.probability,
      provider: result.provider,
      ...assessment
    });

  } catch (error) {
    console.error('Error al analizar audio:', error);
    
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Error al procesar el audio',
      details: error.message
    });
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     OJO CRÍTICO - Backend Server         ║
║                                           ║
║  🚀 Servidor corriendo en:                ║
║     http://localhost:${PORT}                 ║
║                                           ║
║  📱 Para emulador Android usa:            ║
║     http://10.0.2.2:${PORT}                  ║
║                                           ║
║  🔒 HTTPS: En producción, usa un          ║
║     certificado SSL para proteger         ║
║     contra ataques Man-in-the-Middle      ║
╚═══════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
});
