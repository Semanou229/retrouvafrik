// Script Node.js pour créer des utilisateurs de test dans Supabase
// Exécuter avec: npm run create-test-users

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Charger les variables d'environnement depuis .env.local
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
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('Assurez-vous d\'avoir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const testUsers = [
  {
    email: 'test.trouvita@gmail.com',
    password: 'Test123456!',
    name: 'Utilisateur Test'
  },
  {
    email: 'admin.trouvita@gmail.com',
    password: 'Admin123456!',
    name: 'Administrateur'
  },
  {
    email: 'demo.trouvita@gmail.com',
    password: 'Demo123456!',
    name: 'Compte Démo'
  }
]

async function createTestUsers() {
  console.log('🚀 Création des utilisateurs de test...\n')

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mon-compte`
        }
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log(`⚠️  ${user.email} existe déjà`)
        } else {
          console.error(`❌ Erreur pour ${user.email}:`, error.message)
        }
      } else {
        console.log(`✅ ${user.email} créé avec succès`)
      }
    } catch (err) {
      console.error(`❌ Erreur pour ${user.email}:`, err.message)
    }
  }

  console.log('\n✨ Terminé!')
  console.log('\n📝 Accès de test:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}`)
    console.log(`Mot de passe: ${user.password}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
  console.log('\n💡 Note: Vous pouvez maintenant vous connecter avec ces identifiants sur http://localhost:3000/connexion')
}

createTestUsers().catch(console.error)
