// Script Node.js pour créer et confirmer automatiquement des utilisateurs de test dans Supabase
// Exécuter avec: node scripts/create-and-confirm-test-users.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Charger les variables d'environnement depuis .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local non trouvé')
    console.log('💡 Créez un fichier .env.local avec vos variables Supabase')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  
  // Parser le fichier .env - méthode simple et robuste
  const lines = envContent.split(/\r?\n/)
  
  lines.forEach(line => {
    // Ignorer les lignes vides et les commentaires
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return
    }
    
    // Chercher le premier signe = pour séparer clé et valeur
    const equalIndex = trimmedLine.indexOf('=')
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim()
      const value = trimmedLine.substring(equalIndex + 1).trim()
      
      // Si la valeur commence et se termine par des guillemets, les enlever
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        env[key] = value.slice(1, -1)
      } else {
        env[key] = value
      }
    }
  })
  
  return env
}

const env = loadEnv()

// Debug: afficher les clés trouvées
console.log('🔍 Variables trouvées:', Object.keys(env))
console.log('🔍 NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Trouvé' : '❌ Manquant')
console.log('🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Trouvé (' + env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ' caractères)' : '❌ Manquant')
console.log('🔍 SUPABASE_SERVICE_ROLE_KEY:', env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Trouvé (' + env.SUPABASE_SERVICE_ROLE_KEY.length + ' caractères)' : '❌ Manquant')
console.log('')

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('Assurez-vous d\'avoir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante')
  console.log('💡 Cette clé est nécessaire pour confirmer automatiquement les emails')
  console.log('💡 Vous pouvez la trouver dans Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

// Client avec service_role pour les opérations admin
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client avec anon_key pour créer les utilisateurs
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const testUsers = [
  {
    email: 'admin.retrouvafrik@gmail.com',
    password: 'Admin123456!',
    name: 'Administrateur RetrouvAfrik',
    role: 'admin'
  },
  {
    email: 'test.retrouvafrik@gmail.com',
    password: 'Test123456!',
    name: 'Utilisateur Test',
    role: 'user'
  },
  {
    email: 'demo.retrouvafrik@gmail.com',
    password: 'Demo123456!',
    name: 'Compte Démo',
    role: 'user'
  }
]

async function createAndConfirmUsers() {
  console.log('🚀 Création et confirmation des utilisateurs de test...\n')

  for (const user of testUsers) {
    try {
      // Étape 1 : Créer l'utilisateur
      console.log(`📝 Création de ${user.email}...`)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role
          },
          emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL || 'https://retrouvafrik.vercel.app'}/mon-compte`
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          console.log(`⚠️  ${user.email} existe déjà, tentative de confirmation...`)
        } else {
          console.error(`❌ Erreur lors de la création de ${user.email}:`, signUpError.message)
          continue
        }
      }

      // Étape 2 : Confirmer l'email avec service_role
      if (signUpData?.user) {
        const userId = signUpData.user.id
        console.log(`✅ ${user.email} créé (ID: ${userId})`)
        
        // Confirmer l'email
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { email_confirm: true }
        )

        if (confirmError) {
          console.error(`⚠️  Erreur lors de la confirmation de ${user.email}:`, confirmError.message)
        } else {
          console.log(`✅ Email confirmé pour ${user.email}`)
        }

        // Mettre à jour les métadonnées pour le rôle admin
        if (user.role === 'admin') {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { 
              user_metadata: { 
                role: 'admin',
                name: user.name
              } 
            }
          )

          if (updateError) {
            console.error(`⚠️  Erreur lors de la mise à jour du rôle admin pour ${user.email}:`, updateError.message)
          } else {
            console.log(`✅ Rôle admin défini pour ${user.email}`)
          }
        }
      } else {
        // Si l'utilisateur existe déjà, essayer de le trouver et le confirmer
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        
        if (!listError && users) {
          const existingUser = users.find(u => u.email === user.email)
          if (existingUser) {
            console.log(`📋 Utilisateur existant trouvé: ${user.email}`)
            
            // Confirmer l'email
            const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
              existingUser.id,
              { email_confirm: true }
            )

            if (confirmError) {
              console.error(`⚠️  Erreur lors de la confirmation:`, confirmError.message)
            } else {
              console.log(`✅ Email confirmé pour ${user.email}`)
            }

            // Mettre à jour le rôle si admin
            if (user.role === 'admin') {
              const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { 
                  user_metadata: { 
                    role: 'admin',
                    name: user.name
                  } 
                }
              )

              if (updateError) {
                console.error(`⚠️  Erreur lors de la mise à jour du rôle:`, updateError.message)
              } else {
                console.log(`✅ Rôle admin défini pour ${user.email}`)
              }
            }
          }
        }
      }

      console.log('') // Ligne vide pour la lisibilité
    } catch (err) {
      console.error(`❌ Erreur pour ${user.email}:`, err.message)
      console.log('')
    }
  }

  console.log('\n✨ Terminé!')
  console.log('\n📝 Identifiants de connexion:')
  console.log('═══════════════════════════════════════════════════════════')
  testUsers.forEach(user => {
    console.log(`\n👤 ${user.role === 'admin' ? 'ADMIN' : 'UTILISATEUR'}`)
    console.log(`   Email    : ${user.email}`)
    console.log(`   Password : ${user.password}`)
    console.log('───────────────────────────────────────────────────────────')
  })
  console.log('\n💡 Vous pouvez maintenant vous connecter sur:')
  console.log('   https://retrouvafrik.vercel.app/connexion')
  console.log('\n🔗 URLs importantes:')
  console.log('   - Admin: https://retrouvafrik.vercel.app/admin')
  console.log('   - Mon compte: https://retrouvafrik.vercel.app/mon-compte')
}

createAndConfirmUsers().catch(console.error)
