// Données de démonstration pour RetrouvAfrik

export const demoAnnouncements = [
  {
    type: 'person',
    title: 'Recherche de mon frère Koffi, disparu depuis 3 semaines',
    description: 'Mon frère Koffi, 28 ans, a disparu le 15 janvier dernier à Abidjan. Il mesure environ 1m75, porte des lunettes et avait une cicatrice sur le bras gauche. Il était vêtu d\'un t-shirt blanc et d\'un jean bleu. Si vous avez des informations, merci de nous contacter. Sa famille est très inquiète.',
    disappearance_date: '2024-01-15',
    last_location: {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Quartier Yopougon',
    },
    urgency: 'urgent',
    contact_email: 'famille.koffi@example.com',
    contact_phone: '+225 07 12 34 56 78',
  },
  {
    type: 'animal',
    title: 'Chien perdu - Max, berger allemand à Cocody',
    description: 'Max, notre berger allemand de 3 ans, s\'est échappé hier soir. Il est très gentil, porte un collier rouge avec une médaille. Il répond au nom de Max. Récompense offerte pour son retour.',
    disappearance_date: '2024-01-20',
    last_location: {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Cocody, Riviera',
    },
    urgency: 'normal',
    contact_email: 'proprietaire.max@example.com',
    contact_phone: '+225 05 98 76 54 32',
  },
  {
    type: 'object',
    title: 'Portefeuille perdu avec documents importants',
    description: 'J\'ai perdu mon portefeuille noir en cuir contenant ma carte d\'identité, mon permis de conduire et des photos de famille. Perdu dans le quartier de Treichville près du marché. Très important pour moi.',
    disappearance_date: '2024-01-18',
    last_location: {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Treichville, marché central',
    },
    urgency: 'normal',
    contact_email: 'proprietaire.portefeuille@example.com',
  },
  {
    type: 'person',
    title: 'À la recherche de mon ami d\'enfance Amadou',
    description: 'Je recherche Amadou Diallo, mon ami d\'enfance avec qui j\'ai grandi à Bouaké. Nous avons perdu contact il y a 10 ans après qu\'il ait déménagé. Il aurait environ 32 ans maintenant. Si quelqu\'un le connaît, merci de me contacter.',
    disappearance_date: '2014-01-01',
    last_location: {
      country: 'Côte d\'Ivoire',
      city: 'Bouaké',
    },
    urgency: 'normal',
    contact_email: 'recherche.amadou@example.com',
  },
  {
    type: 'animal',
    title: 'Chat perdu - Minou, chat tigré à Marcory',
    description: 'Minou, notre chat tigré de 2 ans, a disparu depuis hier. Il est très craintif mais très gentil. Il a une tache blanche sur le ventre. Merci de nous aider à le retrouver.',
    disappearance_date: '2024-01-21',
    last_location: {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Marcory',
    },
    urgency: 'normal',
    contact_email: 'proprietaire.minou@example.com',
  },
]

export const demoUsers = [
  {
    email: 'marie.kouassi@example.com',
    password: 'demo123456',
    name: 'Marie Kouassi',
  },
  {
    email: 'jean.traore@example.com',
    password: 'demo123456',
    name: 'Jean Traoré',
  },
  {
    email: 'amina.diallo@example.com',
    password: 'demo123456',
    name: 'Amina Diallo',
  },
]

