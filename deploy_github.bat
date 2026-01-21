@echo off
echo ========================================
echo   DESPLIEGUE AUTOMATICO A GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Git...
where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git no esta instalado
    echo Descargalo de: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git encontrado!
echo.

echo [2/5] Inicializando repositorio Git...
if not exist ".git" (
    git init
    echo Repositorio inicializado
) else (
    echo Repositorio ya existe
)

echo.
echo [3/5] Agregando archivos...
git add .
git status

echo.
echo [4/5] Creando commit...
git commit -m "Backend Ojo Critico - Ready for deployment"

echo.
echo ========================================
echo   CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Ahora necesitas:
echo.
echo 1. Crear repositorio en GitHub:
echo    https://github.com/new
echo    Nombre: ojo-critico-backend
echo.
echo 2. Ejecutar estos comandos (reemplaza TU_USUARIO):
echo.
echo    git remote add origin https://github.com/TU_USUARIO/ojo-critico-backend.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Luego ve a Render y conecta el repositorio
echo.
pause
