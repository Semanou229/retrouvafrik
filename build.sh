#!/bin/bash
# Script de build pour Cloudflare Pages
# Ce script gère l'installation des dépendances et le build

set -e

echo "🔧 Installation des dépendances..."
npm install --legacy-peer-deps

echo "🏗️  Build du projet..."
npm run build

echo "✅ Build terminé avec succès!"

