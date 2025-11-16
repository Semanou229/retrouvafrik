/**
 * Script pour créer 3 annonces "Perdu de vue" dans RetrouvAfrik
 * Usage: node scripts/create-lost-sight-announcements.js
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

const lostSightAnnouncements = [
  {
    type: 'person',
    is_lost_sight: true,
    title: 'Recherche de Fatou - Il y a 15 ans',
    description: `Lien avec cette personne : Ami(e)

Fatou était ma meilleure amie au collège. Nous nous sommes rencontrées en 2005 au Collège Notre-Dame de Cotonou. Elle était toujours souriante, très intelligente et passionnée de littérature. Nous avons partagé de nombreux moments ensemble : les récréations, les devoirs, les fêtes d'anniversaire.

Elle avait l'habitude de porter des tresses avec des perles colorées et adorait porter des robes aux couleurs vives. Sa famille était originaire de Porto-Novo et elle parlait souvent de retourner là-bas un jour.

Nous avons perdu contact après notre baccalauréat en 2009. Elle avait mentionné vouloir continuer ses études en France, mais je n'ai jamais eu de nouvelles après son départ. Je pense souvent à elle et j'aimerais savoir comment elle va, si elle a réalisé ses rêves.

Si quelqu'un la connaît ou a des informations sur son parcours, cela me ferait vraiment plaisir de reprendre contact.`,
    disappearance_date: new Date().toISOString().split('T')[0],
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Collège Notre-Dame',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
    ],
    videos: null,
    contact_email: 'test.trouvita@gmail.com',
    contact_phone: '+229 97 12 34 56',
    contact_visibility: 'members_only',
    approved: true,
    hidden: false,
    views_count: 87,
  },
  {
    type: 'person',
    is_lost_sight: true,
    title: 'Recherche de Mamadou - Période 2008-2010',
    description: `Lien avec cette personne : Collègue

Mamadou était mon collègue de travail à la banque où j'ai travaillé entre 2008 et 2010. C'était un homme très professionnel, toujours prêt à aider les autres. Il avait un sens de l'humour incroyable qui rendait les journées de travail plus agréables.

Il était passionné de football et jouait dans une équipe locale le weekend. Il parlait souvent de sa famille, de ses enfants qu'il adorait. Il était très respectueux et avait une grande intégrité professionnelle.

Nous avons travaillé ensemble sur plusieurs projets et il m'a beaucoup appris. Après son départ de la banque en 2010, nous avons échangé quelques messages mais avons fini par perdre contact. J'aimerais savoir ce qu'il est devenu et comment va sa famille.

Si quelqu'un le connaît ou a des informations, je serais ravi de reprendre contact avec lui.`,
    disappearance_date: new Date().toISOString().split('T')[0],
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Banque de quartier',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
    ],
    videos: null,
    contact_email: 'test.trouvita@gmail.com',
    contact_phone: '+229 95 98 76 54',
    contact_visibility: 'members_only',
    approved: true,
    hidden: false,
    views_count: 124,
  },
  {
    type: 'person',
    is_lost_sight: true,
    title: 'Recherche de Amina - Il y a 8 ans',
    description: `Lien avec cette personne : Voisin(e)

Amina était ma voisine quand j'habitais dans le quartier de Gbégamey. Elle était toujours là pour aider, que ce soit pour garder les enfants ou pour partager un repas. C'était une personne très généreuse et chaleureuse.

Elle avait un petit commerce de fruits et légumes devant sa maison. Elle connaissait tout le monde dans le quartier et était très appréciée. Elle avait l'habitude de raconter des histoires et de faire rire les enfants du quartier.

En 2016, j'ai déménagé pour le travail et nous avons perdu contact. J'ai essayé de la retrouver plusieurs fois mais sans succès. Je pense souvent à elle et à sa gentillesse.

Si quelqu'un la connaît ou sait où elle se trouve maintenant, cela me ferait vraiment plaisir de la revoir et de reprendre contact.`,
    disappearance_date: new Date().toISOString().split('T')[0],
    last_location: {
      country: 'Bénin',
      city: 'Cotonou',
      address: 'Quartier Gbégamey',
    },
    urgency: 'normal',
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
    ],
    videos: null,
    contact_email: 'test.trouvita@gmail.com',
    contact_phone: '+229 96 11 22 33',
    contact_visibility: 'members_only',
    approved: true,
    hidden: false,
    views_count: 156,
  },
]

async function createLostSightAnnouncements() {
  console.log('🚀 Création des annonces "Perdu de vue"...\n')

  // Récupérer l'ID de l'utilisateur test
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  
  if (userError) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', userError)
    return
  }

  const testUser = users.users.find(u => u.email === 'test.trouvita@gmail.com')
  
  if (!testUser) {
    console.error('❌ Utilisateur test.trouvita@gmail.com non trouvé')
    return
  }

  for (const announcement of lostSightAnnouncements) {
    try {
      const announcementData = {
        ...announcement,
        user_id: testUser.id,
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select()
        .single()

      if (error) {
        console.error(`❌ Erreur pour "${announcement.title}":`, error.message)
      } else {
        console.log(`✅ Annonce créée: "${announcement.title}"`)
      }
    } catch (err) {
      console.error(`❌ Erreur pour "${announcement.title}":`, err.message)
    }
  }

  console.log('\n✨ Terminé!')
}

createLostSightAnnouncements()

