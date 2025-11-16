// Script pour supprimer et recréer les utilisateurs de test
// Utile si les utilisateurs existants sont bloqués

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
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquant')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.log('⚠️  Clé SERVICE_ROLE non trouvée')
  console.log('\n📝 Pour obtenir la clé SERVICE_ROLE :')
  console.log('1. Supabase Dashboard > Settings > API')
  console.log('2. Copier la "service_role" key')
  console.log('3. Ajouter dans .env.local : SUPABASE_SERVICE_ROLE_KEY=votre_cle')
  console.log('\n💡 Alternative : Supprimer manuellement dans Supabase Dashboard')
  console.log('   Authentication > Users > Sélectionner > Delete')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  { email: 'admin.trouvita@gmail.com', password: 'Admin123456!' },
  { email: 'test.trouvita@gmail.com', password: 'Test123456!' },
  { email: 'demo.trouvita@gmail.com', password: 'Demo123456!' }
]

async function deleteAndRecreate() {
  console.log('🔄 Suppression et recréation des utilisateurs de test...\n')

  // Étape 1 : Supprimer les anciens utilisateurs
  console.log('📋 Étape 1 : Suppression des anciens utilisateurs...\n')
  
  const { data: users, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', listError.message)
    return
  }

  for (const testUser of testUsers) {
    const existingUser = users.users.find(u => u.email === testUser.email)
    
    if (existingUser) {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id)
        if (deleteError) {
          console.error(`❌ Erreur suppression ${testUser.email}:`, deleteError.message)
        } else {
          console.log(`✅ ${testUser.email} supprimé`)
        }
      } catch (err) {
        console.error(`❌ Erreur suppression ${testUser.email}:`, err.message)
      }
    } else {
      console.log(`ℹ️  ${testUser.email} n'existe pas encore`)
    }
  }

  // Attendre un peu
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Étape 2 : Recréer les utilisateurs
  console.log('\n📋 Étape 2 : Création des nouveaux utilisateurs...\n')

  const supabaseAnon = createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  for (const user of testUsers) {
    try {
      const { data, error } = await supabaseAnon.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mon-compte`
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  ${user.email} existe déjà`)
        } else {
          console.error(`❌ Erreur création ${user.email}:`, error.message)
        }
      } else {
        console.log(`✅ ${user.email} créé`)
        
        // Si on a la clé service_role, confirmer immédiatement
        if (serviceRoleKey && data.user) {
          try {
            await supabase.auth.admin.updateUserById(data.user.id, { email_confirm: true })
            console.log(`   ✓ Email confirmé automatiquement`)
          } catch (confirmErr) {
            console.log(`   ⚠️  Email à confirmer manuellement`)
          }
        }
      }
    } catch (err) {
      console.error(`❌ Erreur création ${user.email}:`, err.message)
    }
  }

  console.log('\n✨ Terminé!')
  console.log('\n📝 Accès de test:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}`)
    console.log(`Mot de passe: ${user.password}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
  console.log('\n💡 Vous pouvez maintenant vous connecter sur http://localhost:3000/connexion')
}

deleteAndRecreate().catch(console.error)

