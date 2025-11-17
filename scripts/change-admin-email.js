// Script pour changer l'email du compte admin dans Supabase Auth
// 
// Usage:
//   node scripts/change-admin-email.js
// 
// Ou avec les variables d'environnement:
//   OLD_EMAIL=admin.retrouvafrik@gmail.com NEW_EMAIL=hello@retrouvafrik.com node scripts/change-admin-email.js

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
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')
        env[key.trim()] = value.trim()
      }
    }
  })
  
  return env
}

const env = loadEnv()

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis')
  console.log('💡 Assurez-vous que ces variables sont dans .env.local ou dans les variables d\'environnement')
  process.exit(1)
}

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const OLD_EMAIL = process.env.OLD_EMAIL || 'admin.retrouvafrik@gmail.com'
const NEW_EMAIL = process.env.NEW_EMAIL || 'hello@retrouvafrik.com'

async function changeAdminEmail() {
  try {
    console.log('🔍 Recherche du compte admin avec l\'email:', OLD_EMAIL)
    
    // Lister tous les utilisateurs pour trouver celui avec l'ancien email
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', listError)
      return
    }
    
    const adminUser = users.find(u => u.email === OLD_EMAIL)
    
    if (!adminUser) {
      console.error(`❌ Aucun utilisateur trouvé avec l'email: ${OLD_EMAIL}`)
      console.log('📋 Utilisateurs disponibles:')
      users.forEach(u => console.log(`  - ${u.email} (${u.id})`))
      return
    }
    
    console.log('✅ Utilisateur trouvé:', {
      id: adminUser.id,
      email: adminUser.email,
      created_at: adminUser.created_at,
    })
    
    // Vérifier si le nouvel email existe déjà
    const existingUser = users.find(u => u.email === NEW_EMAIL)
    if (existingUser) {
      console.error(`❌ L'email ${NEW_EMAIL} est déjà utilisé par un autre compte (ID: ${existingUser.id})`)
      return
    }
    
    console.log(`🔄 Changement de l'email de ${OLD_EMAIL} vers ${NEW_EMAIL}...`)
    
    // Mettre à jour l'email de l'utilisateur
    const { data: updatedUser, error: updateError } = await adminSupabase.auth.admin.updateUserById(
      adminUser.id,
      {
        email: NEW_EMAIL,
        email_confirm: true, // Confirmer automatiquement le nouvel email
      }
    )
    
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour de l\'email:', updateError)
      return
    }
    
    console.log('✅ Email changé avec succès!')
    console.log('📧 Nouvel email:', updatedUser.user.email)
    console.log('📧 Email confirmé:', updatedUser.user.email_confirmed_at ? 'Oui' : 'Non')
    
    // Mettre à jour aussi les métadonnées si nécessaire
    const currentMetadata = adminUser.user_metadata || {}
    const { data: userWithMetadata, error: metadataError } = await adminSupabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          ...currentMetadata,
          old_email: OLD_EMAIL, // Garder une trace de l'ancien email
        },
      }
    )
    
    if (metadataError) {
      console.warn('⚠️ Erreur lors de la mise à jour des métadonnées:', metadataError)
    } else {
      console.log('✅ Métadonnées mises à jour')
    }
    
    console.log('\n✅ Migration terminée avec succès!')
    console.log(`📧 L'utilisateur peut maintenant se connecter avec: ${NEW_EMAIL}`)
    console.log(`\n⚠️  IMPORTANT: Déconnectez-vous et reconnectez-vous avec le nouvel email!`)
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

changeAdminEmail()

