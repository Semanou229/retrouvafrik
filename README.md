# 🌍 RetrouvAfrik - Plateforme de Recherche et Solidarité

## 📖 À propos

RetrouvAfrik est une plateforme communautaire dédiée à la recherche de personnes disparues, d'animaux perdus et d'objets égarés en Afrique. Notre mission est de reconnecter ceux qui se cherchent grâce à la solidarité et à l'entraide de la communauté.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et npm/yarn
- Compte Supabase (gratuit)

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd retrouvafrik
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer Supabase**

   a. Créer un projet sur [Supabase](https://supabase.com)
   
   b. Créer un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

   c. Exécuter la migration SQL :
   - Aller dans Supabase Dashboard > SQL Editor
   - Copier le contenu de `supabase/migrations/001_initial_schema.sql`
   - Exécuter la requête

   d. Créer un bucket de stockage pour les photos :
   - Aller dans Storage > Create bucket
   - Nom : `photos`
   - Public : Oui

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du projet

```
retrouvafrik/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── search/            # Page de recherche
│   ├── publier/           # Page de publication
│   ├── connexion/         # Page de connexion
│   ├── inscription/       # Page d'inscription
│   ├── mon-compte/        # Espace utilisateur
│   ├── perdu-de-vue/      # Section "Perdu de vue"
│   └── annonces/[id]/     # Détail d'une annonce
├── components/            # Composants React réutilisables
│   ├── Navigation.tsx
│   ├── AnnouncementCard.tsx
│   ├── PublicationForm.tsx
│   └── ...
├── lib/                   # Utilitaires et configurations
│   ├── supabase/          # Client Supabase
│   └── types.ts           # Types TypeScript
├── supabase/
│   └── migrations/        # Migrations SQL
└── public/                # Fichiers statiques
```

## 🎯 Fonctionnalités

### ✅ Implémentées

- ✅ Authentification (inscription/connexion)
- ✅ Publication d'annonces (personnes, animaux, objets)
- ✅ Recherche et filtres
- ✅ Affichage des annonces
- ✅ Commentaires
- ✅ Signalements d'informations
- ✅ Partage sur réseaux sociaux
- ✅ Espace utilisateur
- ✅ Section "Perdu de vue"
- ✅ Gestion des annonces (modifier, archiver, supprimer)

### 🔄 À venir

- Carte interactive géographique
- Notifications en temps réel
- Application mobile
- Reconnaissance faciale (IA)
- Multilingue

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Supabase** - Backend (Base de données, Auth, Storage)
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **date-fns** - Manipulation de dates
- **react-share** - Partage social

## 📚 Documentation

Voir les fichiers de documentation :
- `ARCHITECTURE_FONCTIONNELLE.md` - Architecture complète
- `CONTENUS_EDITORIAUX.md` - Textes et contenus
- `EXPERIENCE_UTILISATEUR.md` - Design et UX
- `PROPOSITIONS_AMELIORATION.md` - Améliorations futures

## 🔐 Sécurité

- Row Level Security (RLS) activé sur Supabase
- Validation des données côté client et serveur
- Protection des routes authentifiées
- Gestion sécurisée des mots de passe

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter
```

## 🌐 Déploiement

### Vercel (recommandé)

1. Pousser le code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Ajouter les variables d'environnement
4. Déployer

### Autres plateformes

Le projet peut être déployé sur toute plateforme supportant Next.js :
- Netlify
- Railway
- AWS Amplify
- etc.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

---

**RetrouvAfrik** - Reconnectons ceux qui se cherchent 🌍
