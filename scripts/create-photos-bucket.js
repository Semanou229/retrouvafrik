// Script pour créer le bucket 'photos' dans Supabase Storage
// Exécuter avec: node scripts/create-photos-bucket.js

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
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createPhotosBucket() {
  console.log('🚀 Création du bucket "photos" dans Supabase Storage...\n')

  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Erreur lors de la vérification des buckets:', listError.message)
      process.exit(1)
    }

    const photosBucket = buckets?.find(b => b.name === 'photos')
    
    if (photosBucket) {
      console.log('✅ Le bucket "photos" existe déjà')
      console.log(`   ID: ${photosBucket.id}`)
      console.log(`   Public: ${photosBucket.public ? 'Oui' : 'Non'}`)
      console.log(`   Créé le: ${photosBucket.created_at}`)
      console.log('\n💡 Si vous rencontrez toujours une erreur "Bucket not found", vérifiez les politiques RLS.')
      return
    }

    // Créer le bucket
    console.log('📦 Création du bucket "photos"...')
    const { data: bucket, error: createError } = await supabase.storage.createBucket('photos', {
      public: true,
      fileSizeLimit: 5242880, // 5 MB
      allowedMimeTypes: ['image/*'],
    })

    if (createError) {
      console.error('❌ Erreur lors de la création du bucket:', createError.message)
      process.exit(1)
    }

    console.log('✅ Bucket "photos" créé avec succès!')
    console.log(`   ID: ${bucket.id}`)
    console.log(`   Public: Oui`)
    console.log(`   Limite de taille: 5 MB`)
    console.log(`   Types MIME autorisés: image/*`)
    
    console.log('\n📝 Note: Assurez-vous que les politiques RLS sont configurées pour permettre:')
    console.log('   - La lecture publique des photos')
    console.log('   - L\'upload par les utilisateurs authentifiés')
    console.log('   - La suppression par les propriétaires des fichiers')
    
  } catch (err) {
    console.error('❌ Erreur:', err.message)
    process.exit(1)
  }
}

createPhotosBucket()
  .then(() => {
    console.log('\n✨ Terminé!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Erreur fatale:', err)
    process.exit(1)
  })

