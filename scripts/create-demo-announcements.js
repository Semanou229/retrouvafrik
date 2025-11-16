/**
 * Script pour créer des annonces de démonstration dans RetrouvAfrik
 * Usage: node scripts/create-demo-announcements.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const demoAnnouncements = [
  {
    type: 'person',
    title: 'Recherche de mon frère Koffi, disparu depuis 3 semaines',
    description: 'Mon frère Koffi, 28 ans, a disparu le 15 janvier dernier à Cotonou. Il mesure environ 1m75, porte des lunettes et avait une cicatrice sur le bras gauche. Il était vêtu d\'un t-shirt blanc et d\'un jean bleu. Si vous avez des informations, merci de nous contacter. Sa famille est très inquiète.',
    disappearance_date: '2024-01-15',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Quartier Gbégamey',
    },
    urgency: 'urgent',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop',
    ],
    videos: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple YouTube
    ],
    contact_email: 'famille.koffi@example.com',
    contact_phone: '+229 97 12 34 56',
    contact_visibility: 'members_only',
    views_count: 245,
  },
  {
    type: 'animal',
    title: 'Chien perdu - Max, berger allemand à Cotonou',
    description: 'Max, notre berger allemand de 3 ans, s\'est échappé hier soir. Il est très gentil, porte un collier rouge avec une médaille. Il répond au nom de Max. Récompense offerte pour son retour.',
    disappearance_date: '2024-01-20',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Quartier Akpakpa',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889c4d5b9e?w=800&h=600&fit=crop',
    ],
    videos: [
      'https://www.youtube.com/watch?v=jNQXAC9IVRw', // Exemple YouTube
    ],
    contact_email: 'proprietaire.max@example.com',
    contact_phone: '+229 95 98 76 54',
    contact_visibility: 'members_only',
    views_count: 189,
  },
  {
    type: 'object',
    mode: 'perdu',
    title: 'Portefeuille perdu avec documents importants',
    description: 'J\'ai perdu mon portefeuille noir en cuir contenant ma carte d\'identité, mon permis de conduire et des photos de famille. Perdu dans le quartier de Fidjrossè près du marché. Très important pour moi.',
    disappearance_date: '2024-01-18',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Fidjrossè, marché central',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop',
    ],
    contact_email: 'proprietaire.portefeuille@example.com',
    contact_phone: '+229 96 11 22 33',
    contact_visibility: 'public',
    views_count: 156,
  },
  {
    type: 'person',
    title: 'À la recherche de mon ami d\'enfance Amadou',
    description: 'Je recherche Amadou Diallo, mon ami d\'enfance avec qui j\'ai grandi à Parakou. Nous avons perdu contact il y a 10 ans après qu\'il ait déménagé. Il aurait environ 32 ans maintenant. Si quelqu\'un le connaît, merci de me contacter.',
    disappearance_date: '2014-01-01',
    last_location: {
      country: 'Bénin',
      city: 'Parakou',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop',
    ],
    contact_email: 'recherche.amadou@example.com',
    contact_visibility: 'members_only',
    views_count: 98,
  },
  {
    type: 'animal',
    title: 'Chat perdu - Minou, chat tigré à Cotonou',
    description: 'Minou, notre chat tigré de 2 ans, a disparu depuis hier. Il est très craintif mais très gentil. Il a une tache blanche sur le ventre. Merci de nous aider à le retrouver.',
    disappearance_date: '2024-01-21',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Quartier Jéricho',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop',
    ],
    contact_email: 'proprietaire.minou@example.com',
    contact_phone: '+229 97 55 44 33',
    contact_visibility: 'members_only',
    views_count: 67,
  },
  {
    type: 'person',
    title: 'Recherche de Fatou, disparue depuis une semaine',
    description: 'Fatou, 25 ans, a quitté la maison le 14 janvier et n\'est jamais revenue. Elle mesure 1m60, cheveux tressés, portait une robe bleue. Dernière vue à Calavi. Toute information serait précieuse.',
    disappearance_date: '2024-01-14',
    last_location: {
      country: 'Bénin',
      city: 'Calavi',
      address: 'Zone universitaire',
    },
    urgency: 'urgent',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
    ],
    videos: [
      'https://vimeo.com/148751763', // Exemple Vimeo
    ],
    contact_email: 'famille.fatou@example.com',
    contact_phone: '+229 97 88 77 66',
    contact_visibility: 'members_only',
    views_count: 312,
  },
  {
    type: 'object',
    mode: 'perdu',
    title: 'Téléphone portable perdu - iPhone 12',
    description: 'J\'ai perdu mon iPhone 12 noir hier soir dans un taxi à Cotonou. Il contient des photos importantes et des contacts professionnels. Récompense généreuse pour son retour.',
    disappearance_date: '2024-01-19',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Route de l\'aéroport',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    ],
    contact_email: 'proprietaire.iphone@example.com',
    contact_phone: '+229 96 99 88 77',
    contact_visibility: 'public',
    views_count: 201,
  },
  {
    type: 'animal',
    title: 'Chiot perdu - Bella, chienne croisée à Porto-Novo',
    description: 'Bella, notre petite chienne de 6 mois, s\'est enfuie hier. Elle est de couleur beige avec des taches blanches. Très amicale et joueuse. Récompense pour son retour.',
    disappearance_date: '2024-01-22',
    last_location: {
      country: 'Bénin',
      city: 'Porto-Novo',
      address: 'Quartier Ouando',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
    ],
    contact_email: 'proprietaire.bella@example.com',
    contact_phone: '+229 95 44 33 22',
    contact_visibility: 'members_only',
    views_count: 134,
  },
  {
    type: 'person',
    title: 'Recherche de mon cousin Yves, perdu de vue depuis 5 ans',
    description: 'Je recherche mon cousin Yves, 35 ans, avec qui j\'ai perdu contact il y a 5 ans. Il travaillait dans le commerce à Cotonou. Si vous le connaissez ou avez des informations, contactez-moi.',
    disappearance_date: '2019-01-01',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Marché Dantokpa',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    ],
    contact_email: 'recherche.yves@example.com',
    contact_visibility: 'members_only',
    views_count: 89,
  },
  {
    type: 'object',
    mode: 'perdu',
    title: 'Clés de voiture perdues - Peugeot 206',
    description: 'J\'ai perdu mes clés de voiture hier. Il y a un porte-clés en cuir marron avec plusieurs clés. Perdues près du marché de Ganhi. Très urgent car je ne peux plus utiliser ma voiture.',
    disappearance_date: '2024-01-23',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Marché de Ganhi',
    },
    urgency: 'urgent',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    ],
    videos: [
      'https://www.youtube.com/watch?v=9bZkp7q19f0', // Exemple YouTube
    ],
    contact_email: 'proprietaire.cles@example.com',
    contact_phone: '+229 97 33 22 11',
    contact_visibility: 'public',
    views_count: 178,
  },
  {
    type: 'object',
    mode: 'trouve',
    title: 'Portefeuille trouvé près du marché Dantokpa',
    description: 'J\'ai trouvé un portefeuille noir en cuir hier après-midi près du marché Dantokpa. Il contient des documents et des cartes. Si c\'est le vôtre, contactez-moi et décrivez-le pour que je puisse vous le rendre.',
    disappearance_date: '2024-01-24',
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Marché Dantokpa',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop',
    ],
    secret_detail: 'Le portefeuille contient une carte d\'identité avec un prénom commençant par "K"',
    contact_email: 'trouveur.portefeuille@example.com',
    contact_phone: '+229 97 44 55 66',
    contact_visibility: 'members_only',
    views_count: 92,
  },
]

async function createDemoAnnouncements() {
  console.log('🚀 Création des annonces de démonstration...\n')

  // Récupérer un utilisateur de test pour associer les annonces
  const { data: users } = await supabase.auth.admin.listUsers()
  
  let userId = null
  if (users && users.users.length > 0) {
    userId = users.users[0].id
    console.log(`✓ Utilisation de l'utilisateur: ${users.users[0].email}\n`)
  } else {
    console.log('⚠️  Aucun utilisateur trouvé. Les annonces seront créées sans propriétaire.\n')
  }

  let created = 0
  let errors = 0

  for (const announcement of demoAnnouncements) {
    try {
      // Préparer les données avec videos par défaut si non défini
      const announcementData = {
        ...announcement,
        videos: announcement.videos || null,
        user_id: userId,
      }
      
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select()
        .single()

      if (error) {
        console.error(`❌ Erreur pour "${announcement.title}":`, error.message)
        errors++
      } else {
        console.log(`✓ Créée: ${announcement.title}`)
        created++
      }
    } catch (err) {
      console.error(`❌ Erreur pour "${announcement.title}":`, err.message)
      errors++
    }
  }

  console.log(`\n✅ Terminé! ${created} annonces créées, ${errors} erreurs`)
}

createDemoAnnouncements()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Erreur:', err)
    process.exit(1)
  })

