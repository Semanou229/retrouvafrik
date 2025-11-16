// Script pour confirmer les emails des utilisateurs existants
// Utilise l'API Supabase directement

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local non trouvé')
    process.exit(1)
  }
  
  const env = {}
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !anonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

console.log('🔧 Solution pour confirmer les emails des utilisateurs existants\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('Les utilisateurs créés AVANT la désactivation de la confirmation')
console.log('sont toujours marqués comme non confirmés.\n')
console.log('📝 SOLUTION : Confirmer manuellement dans Supabase Dashboard\n')
console.log('Étapes :')
console.log('1. Aller dans Supabase Dashboard > Authentication > Users')
console.log('2. Trouver chaque utilisateur de test :')
console.log('   - admin.trouvita@gmail.com')
console.log('   - test.trouvita@gmail.com')
console.log('   - demo.trouvita@gmail.com')
console.log('3. Pour chaque utilisateur :')
console.log('   - Cliquer sur l\'utilisateur')
console.log('   - Dans "User Metadata" ou les actions, chercher :')
console.log('     • "Confirm email" (bouton)')
console.log('     • "Send confirmation email" puis cliquer sur le lien')
console.log('     • Ou modifier directement email_confirmed à true\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('💡 SOLUTION ALTERNATIVE : Recréer les utilisateurs\n')
console.log('1. Supprimer les anciens utilisateurs dans Supabase Dashboard')
console.log('2. Exécuter : npm run create-test-users')
console.log('3. Les nouveaux utilisateurs seront créés sans confirmation requise\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('🔑 Si vous avez la clé SERVICE_ROLE :\n')
console.log('1. Ajouter dans .env.local :')
console.log('   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role')
console.log('2. Exécuter : npm run confirm-emails\n')

