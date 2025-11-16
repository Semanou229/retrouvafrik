@echo off
REM Script de build pour Cloudflare Pages (Windows)
REM Ce script gère l'installation des dépendances et le build

echo 🔧 Installation des dépendances...
call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    exit /b %errorlevel%
)

echo 🏗️  Build du projet...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build
    exit /b %errorlevel%
)

echo ✅ Build terminé avec succès!

