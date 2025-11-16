# 🎨 Expérience Utilisateur - Trouvita

## 🎯 Principes directeurs

### 1. Empathie avant tout
Trouvita traite des situations souvent difficiles et émotionnellement chargées. L'interface doit être :
- **Rassurante** : Ton bienveillant, couleurs apaisantes
- **Respectueuse** : Pas de langage commercial agressif
- **Supportive** : Messages d'encouragement et d'espoir
- **Claire** : Pas d'ambiguïté, pas de jargon technique

### 2. Simplicité maximale
- **Parcours intuitif** : Chaque action doit être évidente
- **Pas de frictions** : Réduction au maximum des étapes nécessaires
- **Guidance constante** : Aide contextuelle disponible partout
- **Feedback immédiat** : L'utilisateur sait toujours où il en est

### 3. Accessibilité universelle
- **Tous les niveaux techniques** : Interface compréhensible par tous
- **Tous les appareils** : Mobile-first, mais optimisé pour tous
- **Toutes les connexions** : Fonctionne même avec connexion lente
- **Toutes les langues** : Préparation pour multilingue (phase future)

---

## 🗺️ Parcours utilisateur principaux

### Parcours 1 : Publication d'une annonce (utilisateur non connecté)

**Objectif** : Permettre à quelqu'un de publier rapidement une annonce

**Étapes** :
1. **Arrivée sur le site**
   - Hero section claire avec CTA "Publier une annonce"
   - Message rassurant sur la mission de Trouvita

2. **Clic sur "Publier une annonce"**
   - Redirection vers formulaire de publication
   - Option : Créer un compte maintenant OU continuer sans compte
   - Si sans compte : Demande email pour notifications uniquement

3. **Remplissage du formulaire**
   - Étapes clairement numérotées (1/5, 2/5, etc.)
   - Barre de progression visible
   - Sauvegarde automatique des données (localStorage)
   - Possibilité de revenir en arrière à tout moment
   - Aide contextuelle à chaque étape

4. **Publication**
   - Aperçu avant publication
   - Confirmation claire
   - Message de succès avec prochaines étapes
   - Suggestion de partage immédiat

5. **Post-publication**
   - Redirection vers l'annonce publiée
   - Suggestions d'actions : Partager, Suivre, Publier une autre annonce
   - Invitation à créer un compte pour gérer l'annonce

**Points d'attention** :
- Ne jamais bloquer l'utilisateur
- Toujours permettre de sauvegarder et continuer plus tard
- Messages d'encouragement à chaque étape
- Rassurer sur la confidentialité des données

---

### Parcours 2 : Recherche et aide (visiteur)

**Objectif** : Permettre à quelqu'un de trouver une annonce et aider

**Étapes** :
1. **Arrivée sur le site**
   - Barre de recherche visible en haut
   - Suggestions d'annonces récentes/urgentes
   - Catégories visuelles (Personnes / Animaux / Objets)

2. **Recherche**
   - Barre de recherche avec autocomplétion
   - Filtres faciles à utiliser (accordéon ou sidebar)
   - Résultats en temps réel si possible
   - Affichage clair des résultats

3. **Consultation d'une annonce**
   - Toutes les informations visibles immédiatement
   - Photos en galerie facile à naviguer
   - Actions claires : Commenter, Partager, Signaler une info
   - Coordonnées de contact facilement accessibles

4. **Action d'aide**
   - Bouton "J'ai une information" bien visible
   - Formulaire simple et guidé
   - Confirmation que l'information a été transmise
   - Encouragement à partager l'annonce

**Points d'attention** :
- Recherche doit être rapide et efficace
- Résultats doivent être pertinents
- Actions d'aide doivent être simples (pas de friction)
- Toujours encourager le partage

---

### Parcours 3 : Gestion d'annonce (utilisateur connecté)

**Objectif** : Permettre à un utilisateur de gérer ses annonces

**Étapes** :
1. **Connexion**
   - Formulaire simple (email + mot de passe)
   - Option "Se souvenir de moi"
   - Lien "Mot de passe oublié" visible

2. **Accès à l'espace utilisateur**
   - Tableau de bord avec vue d'ensemble
   - Navigation claire vers "Mes annonces"
   - Statistiques visuelles (graphiques simples)

3. **Gestion des annonces**
   - Liste de toutes les annonces avec statut visible
   - Actions rapides : Modifier, Dupliquer, Archiver, Supprimer
   - Filtres pour trouver rapidement une annonce
   - Possibilité de marquer comme "Résolue"

4. **Modification d'annonce**
   - Même formulaire que la création
   - Données pré-remplies
   - Indication des modifications récentes
   - Historique des modifications visible

5. **Suivi des interactions**
   - Notifications pour nouveaux commentaires/signalements
   - Liste des signalements reçus
   - Statistiques de chaque annonce (vues, partages)

**Points d'attention** :
- Accès rapide aux informations importantes
- Actions fréquentes facilement accessibles
- Notifications claires mais non intrusives
- Possibilité de gérer plusieurs annonces facilement

---

## 🎨 Design et interface

### Palette de couleurs

**Couleurs principales** :
- **Bleu confiance** : #2563EB (Actions principales, liens)
- **Vert espoir** : #10B981 (Succès, résolutions)
- **Orange urgence** : #F59E0B (Annonces urgentes, alertes)
- **Gris neutre** : #6B7280 (Textes secondaires)
- **Blanc/Nuance** : #FFFFFF / #F9FAFB (Fond)

**Utilisation** :
- Bleu pour les actions principales et la navigation
- Vert pour les messages de succès et annonces résolues
- Orange pour attirer l'attention sur les urgences
- Gris pour les textes secondaires et séparateurs
- Blanc pour les fonds et cartes

### Typographie

**Hiérarchie** :
- **Titres principaux** : 32-40px, gras
- **Titres de section** : 24-28px, semi-gras
- **Sous-titres** : 18-20px, normal
- **Corps de texte** : 16px, normal
- **Textes secondaires** : 14px, normal
- **Labels et légendes** : 12-14px, normal

**Famille de polices** :
- Police principale : Sans-serif moderne et lisible (ex: Inter, Roboto)
- Police de secours : Système (Arial, Helvetica)

### Espacements

**Système de grille** :
- Espacement de base : 8px
- Marges et paddings : Multiples de 8px (8, 16, 24, 32, 48, 64)
- Largeur maximale du contenu : 1200px
- Marges latérales : 16px (mobile), 24px (tablette), 32px (desktop)

### Composants d'interface

#### Boutons

**Bouton principal** :
- Fond bleu (#2563EB)
- Texte blanc
- Padding : 12px 24px
- Border-radius : 8px
- Hover : Légèrement plus foncé
- Taille minimale : 44x44px (touch-friendly)

**Bouton secondaire** :
- Fond transparent
- Bordure bleue
- Texte bleu
- Même padding et border-radius

**Bouton urgence** :
- Fond orange (#F59E0B)
- Texte blanc
- Animation subtile (pulse léger)

#### Cartes d'annonce

**Structure** :
- Fond blanc
- Ombre légère (elevation)
- Border-radius : 12px
- Padding : 16px
- Image en haut (ratio 16:9)
- Badge de type/statut en haut à droite
- Titre en gras
- Informations essentielles (localisation, date)
- Actions en bas (Partager, Voir détails)

**États** :
- Par défaut : Ombre légère
- Hover : Ombre plus prononcée, légère élévation
- Urgent : Bordure orange, badge "Urgent" visible

#### Formulaire

**Champs de saisie** :
- Bordure : 1px solid #E5E7EB
- Border-radius : 8px
- Padding : 12px 16px
- Focus : Bordure bleue, ombre légère
- Erreur : Bordure rouge, message d'erreur en dessous
- Succès : Bordure verte

**Labels** :
- Au-dessus du champ
- Taille : 14px
- Couleur : #374151
- Astérisque pour champs obligatoires

**Aide contextuelle** :
- Icône d'information à côté du label
- Tooltip au survol
- Texte d'aide sous le champ si nécessaire

#### Navigation

**Menu principal** :
- Fixe en haut (sticky)
- Fond blanc avec ombre légère
- Logo à gauche
- Navigation au centre
- Actions à droite (Connexion, Publier)
- Menu mobile : Hamburger avec drawer

**Breadcrumbs** :
- Sur les pages profondes
- Liens cliquables
- Séparateur : ">"
- Dernier élément non cliquable

---

## 📱 Responsive Design

### Mobile (< 768px)

**Adaptations** :
- Menu hamburger
- Cartes d'annonce en pleine largeur
- Formulaire en une colonne
- Boutons pleine largeur
- Images optimisées pour mobile
- Touch targets minimum 44x44px

**Priorités** :
- Recherche facilement accessible
- Publication simplifiée
- Actions principales visibles

### Tablette (768px - 1024px)

**Adaptations** :
- Menu peut être étendu
- Cartes en grille 2 colonnes
- Formulaire peut être en 2 colonnes
- Espacements ajustés

### Desktop (> 1024px)

**Adaptations** :
- Menu complet visible
- Cartes en grille 3-4 colonnes
- Sidebar pour filtres (si pertinent)
- Espacements généreux
- Hover states activés

---

## ⚡ Performance et optimisation

### Temps de chargement

**Objectifs** :
- Page d'accueil : < 2 secondes
- Page de recherche : < 1.5 secondes
- Page de détail : < 2 secondes
- Formulaire : < 1 seconde

**Stratégies** :
- Images optimisées (WebP, lazy loading)
- Code minifié
- CDN pour assets statiques
- Mise en cache appropriée
- Pagination ou lazy loading pour listes

### Accessibilité

**Standards** :
- WCAG 2.1 niveau AA minimum
- Contraste de couleurs suffisant
- Navigation au clavier
- Screen readers compatibles
- Alt text pour toutes les images

**Implémentation** :
- Attributs ARIA appropriés
- Focus visible
- Messages d'erreur accessibles
- Structure sémantique HTML

---

## 🎭 États et interactions

### États de chargement

**Indicateurs** :
- Spinner pour actions courtes (< 2s)
- Skeleton screens pour chargements de pages
- Barre de progression pour actions longues
- Messages clairs : "Chargement en cours..."

### États d'erreur

**Gestion** :
- Messages d'erreur clairs et actionnables
- Pas de jargon technique
- Suggestions de solutions
- Possibilité de réessayer facilement

**Exemples** :
- "Une erreur s'est produite. Veuillez réessayer."
- "Votre connexion semble interrompue. Vérifiez votre connexion internet."
- "Cette annonce n'existe plus ou a été supprimée."

### États de succès

**Confirmation** :
- Messages de succès visibles
- Animation subtile (checkmark, fade-in)
- Actions suivantes suggérées
- Pas de redirection automatique (sauf si nécessaire)

### États vides

**Messages** :
- "Aucune annonce trouvée" avec suggestion de recherche différente
- "Vous n'avez pas encore publié d'annonce" avec CTA
- "Aucun commentaire" avec encouragement à être le premier

---

## 🧭 Navigation et orientation

### Structure de navigation

**Niveaux** :
1. **Navigation principale** : Accueil, Rechercher, Publier, Perdu de vue
2. **Navigation secondaire** : Filtres, Catégories
3. **Navigation contextuelle** : Actions sur une annonce, Gestion de compte

### Orientation utilisateur

**Indicateurs** :
- Breadcrumbs sur pages profondes
- Titre de page clair
- Barre de progression sur formulaires multi-étapes
- Highlight de la section active dans le menu

### Retour et annulation

**Règles** :
- Toujours permettre de revenir en arrière
- Confirmation avant actions destructives
- Sauvegarde automatique des formulaires
- Possibilité d'annuler les modifications

---

## 💡 Micro-interactions

### Animations subtiles

**Objectifs** :
- Donner du feedback visuel
- Guider l'attention
- Rendre l'interface vivante
- Améliorer la perception de performance

**Exemples** :
- Hover sur boutons : Légère élévation
- Clic sur bouton : Animation de pression
- Chargement : Skeleton screens animés
- Succès : Checkmark animé
- Erreur : Shake léger

### Transitions

**Règles** :
- Durée : 200-300ms maximum
- Easing : ease-in-out
- Pas d'animations distrayantes
- Respecter les préférences utilisateur (reduced motion)

---

## 🎯 Points d'attention spécifiques

### Sensibilité du contenu

**Considérations** :
- Ton respectueux et empathique
- Pas de langage commercial agressif
- Messages d'espoir et d'encouragement
- Respect de la vie privée et de la dignité

### Urgence vs Normalité

**Distinction** :
- Annonces urgentes : Visuellement distinctes mais pas alarmantes
- Badge "Urgent" visible mais discret
- Pas de couleurs agressives (rouge vif)
- Mise en avant sans créer de panique

### Confidentialité

**Transparence** :
- Indiquer clairement qui peut voir quoi
- Options de visibilité explicites
- Explication de l'utilisation des données
- Contrôle utilisateur sur ses informations

---

*Document créé le [Date] - Version 1.0*

