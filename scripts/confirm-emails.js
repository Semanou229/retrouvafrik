// Script pour confirmer automatiquement les emails des utilisateurs de test
// Ce script nécessite la clé SERVICE_ROLE_KEY de Supabase (à utiliser avec précaution)

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.log('⚠️  Clé SERVICE_ROLE non trouvée dans .env.local')
  console.log('\n📝 Pour obtenir la clé SERVICE_ROLE :')
  console.log('1. Aller dans Supabase Dashboard > Settings > API')
  console.log('2. Copier la "service_role" key (secret)')
  console.log('3. Ajouter dans .env.local : SUPABASE_SERVICE_ROLE_KEY=votre_cle_ici')
  console.log('\n💡 Alternative : Désactiver la confirmation d\'email dans Supabase Dashboard')
  console.log('   Authentication > Settings > Décocher "Enable email confirmations"')
  process.exit(1)
}

// Utiliser la clé service_role pour avoir les permissions admin
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testEmails = [
  'admin.trouvita@gmail.com',
  'test.trouvita@gmail.com',
  'demo.trouvita@gmail.com'
]

async function confirmEmails() {
  console.log('🔐 Confirmation des emails des utilisateurs de test...\n')

  for (const email of testEmails) {
    try {
      // Récupérer l'utilisateur par email
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        console.error(`❌ Erreur lors de la récupération des utilisateurs:`, listError.message)
        continue
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        console.log(`⚠️  Utilisateur ${email} non trouvé`)
        continue
      }

      // Confirmer l'email de l'utilisateur
      const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )

      if (error) {
        console.error(`❌ Erreur pour ${email}:`, error.message)
      } else {
        console.log(`✅ ${email} confirmé avec succès`)
      }
    } catch (err) {
      console.error(`❌ Erreur pour ${email}:`, err.message)
    }
  }

  console.log('\n✨ Terminé!')
  console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants')
}

confirmEmails().catch(console.error)

