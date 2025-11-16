// Script pour créer le bucket 'messages' dans Supabase Storage
// Exécuter avec: node scripts/create-messages-bucket.js

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
  
  const lines = envContent.split(/\r?\n/)
  
  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return
    }
    
    const equalIndex = trimmedLine.indexOf('=')
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim()
      const value = trimmedLine.substring(equalIndex + 1).trim()
      
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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('Assurez-vous d\'avoir NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local')
  process.exit(1)
}

// Client avec service_role pour créer le bucket
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createMessagesBucket() {
  console.log('🚀 Création du bucket "messages" dans Supabase Storage...\n')

  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Erreur lors de la vérification des buckets:', listError.message)
      process.exit(1)
    }

    const messagesBucket = buckets?.find(b => b.name === 'messages')
    
    if (messagesBucket) {
      console.log('✅ Le bucket "messages" existe déjà')
      console.log(`   ID: ${messagesBucket.id}`)
      console.log(`   Public: ${messagesBucket.public ? 'Oui' : 'Non'}`)
      console.log(`   Créé le: ${messagesBucket.created_at}`)
      return
    }

    // Créer le bucket
    console.log('📦 Création du bucket "messages"...')
    const { data: bucket, error: createError } = await supabase.storage.createBucket('messages', {
      public: true,
      fileSizeLimit: 10485760, // 10 MB
      allowedMimeTypes: ['image/*'],
    })

    if (createError) {
      console.error('❌ Erreur lors de la création du bucket:', createError.message)
      process.exit(1)
    }

    console.log('✅ Bucket "messages" créé avec succès!')
    console.log(`   ID: ${bucket.id}`)
    console.log(`   Public: Oui`)
    console.log(`   Limite de taille: 10 MB`)
    console.log(`   Types MIME autorisés: image/*`)
    
    console.log('\n📝 Note: Les politiques RLS pour le bucket sont définies dans supabase/migrations/003_storage_policies.sql')
    console.log('   Assurez-vous que cette migration a été appliquée.')
    
  } catch (err) {
    console.error('❌ Erreur:', err.message)
    process.exit(1)
  }
}

createMessagesBucket()
  .then(() => {
    console.log('\n✨ Terminé!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Erreur fatale:', err)
    process.exit(1)
  })

