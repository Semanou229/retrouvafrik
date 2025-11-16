// Script pour confirmer automatiquement les emails des comptes de test
// Nécessite la clé service_role (à utiliser avec précaution)

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Charger les variables d'environnement
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local non trouvé')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      env[match[1].trim()] = match[2].trim()
    }
  })
  
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL

// Note: Pour confirmer les emails, vous avez deux options :
// 1. Désactiver la confirmation d'email dans Supabase Dashboard
// 2. Utiliser la clé service_role (non recommandé en production)

console.log('📧 Pour résoudre le problème "Email not confirmed" :\n')
console.log('OPTION 1 (Recommandée) : Désactiver la confirmation d\'email')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Aller dans Supabase Dashboard > Authentication > Settings')
console.log('2. Désactiver "Enable email confirmations"')
console.log('3. Sauvegarder')
console.log('4. Les utilisateurs pourront se connecter sans confirmation\n')

console.log('OPTION 2 : Confirmer manuellement les emails')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Aller dans Supabase Dashboard > Authentication > Users')
console.log('2. Trouver les utilisateurs de test')
console.log('3. Cliquer sur chaque utilisateur')
console.log('4. Cliquer sur "Confirm email" ou "Send confirmation email"\n')

console.log('OPTION 3 : Utiliser un email de test Supabase')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('1. Aller dans Supabase Dashboard > Authentication > Settings')
console.log('2. Dans "Email Auth", ajouter un domaine de test')
console.log('3. Les emails avec ce domaine seront automatiquement confirmés\n')

console.log('💡 Solution la plus simple : Désactiver la confirmation d\'email pour le développement')

