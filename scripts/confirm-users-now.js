// Script pour confirmer immédiatement les emails des utilisateurs de test
// Utilise la clé service_role fournie

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

// Clé service_role fournie
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Znd3YXhucml2aHN2aGRianVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI0NDk3OCwiZXhwIjoyMDc4ODIwOTc4fQ.7BiJFASPLtBvvitKZ9UmRruS4e_tWiYo4imub-3oPLk'

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local')
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

  // Récupérer tous les utilisateurs
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', listError.message)
    return
  }

  if (!usersData || !usersData.users) {
    console.error('❌ Aucun utilisateur trouvé')
    return
  }

  console.log(`📋 ${usersData.users.length} utilisateur(s) trouvé(s)\n`)

  for (const email of testEmails) {
    try {
      const user = usersData.users.find(u => u.email === email)
      
      if (!user) {
        console.log(`⚠️  Utilisateur ${email} non trouvé`)
        continue
      }

      console.log(`🔄 Traitement de ${email}...`)

      // Vérifier si déjà confirmé
      if (user.email_confirmed_at) {
        console.log(`   ✓ Déjà confirmé (${user.email_confirmed_at})`)
        continue
      }

      // Confirmer l'email de l'utilisateur
      const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )

      if (error) {
        console.error(`   ❌ Erreur:`, error.message)
      } else {
        console.log(`   ✅ Email confirmé avec succès!`)
      }
    } catch (err) {
      console.error(`   ❌ Erreur pour ${email}:`, err.message)
    }
  }

  console.log('\n✨ Terminé!')
  console.log('\n📝 Vous pouvez maintenant vous connecter avec :')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:')
  console.log('  Email: admin.trouvita@gmail.com')
  console.log('  Mot de passe: Admin123456!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Utilisateur:')
  console.log('  Email: test.trouvita@gmail.com')
  console.log('  Mot de passe: Test123456!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n💡 URL de connexion: http://localhost:3000/connexion')
}

confirmEmails().catch(console.error)

