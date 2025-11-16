# 🎯 Architecture Fonctionnelle - Trouvita

## Vue d'ensemble

Trouvita est une plateforme communautaire dédiée à la recherche de personnes disparues, d'animaux perdus et d'objets égarés en Afrique. La plateforme met l'accent sur la solidarité, l'entraide et la mobilisation citoyenne.

---

## 📱 Structure de navigation principale

### 1. Page d'accueil
**Objectif** : Accueillir les visiteurs et présenter la mission de Trouvita

**Contenu** :
- Hero section avec message d'accueil et appel à l'action
- Statistiques de la communauté (nombre d'annonces, de retrouvailles, de membres)
- Annonces récentes en aperçu (3-6 annonces)
- Annonces urgentes mises en avant
- Section "Comment ça marche ?" (3 étapes simples)
- Témoignages de réussite

**Actions disponibles** :
- Bouton "Publier une annonce" (visible et accessible)
- Bouton "Rechercher" (barre de recherche principale)
- Navigation vers les catégories

---

### 2. Page de recherche et découverte
**Objectif** : Permettre la recherche et la découverte d'annonces

**Fonctionnalités** :
- Barre de recherche principale (nom, ville, description)
- Filtres avancés :
  - Type : Personne / Animal / Objet
  - Statut : En cours / Résolu / Urgent
  - Localisation : Pays / Ville / Région
  - Date de disparition (plage de dates)
  - Tri : Plus récent / Plus ancien / Plus populaire / Plus urgent
- Affichage en grille ou liste
- Pagination ou scroll infini

**Affichage des résultats** :
- Carte d'annonce avec :
  - Photo principale (ou avatar par défaut)
  - Titre
  - Type et statut (badge coloré)
  - Localisation
  - Date de disparition
  - Nombre de vues, commentaires, partages
  - Bouton "Voir les détails"

---

### 3. Page de publication d'annonce
**Objectif** : Guider l'utilisateur dans la création d'une annonce complète

**Étapes du formulaire** :

**Étape 1 : Type d'annonce**
- Sélection : Personne disparue / Animal perdu / Objet perdu
- Explication courte de chaque type

**Étape 2 : Informations essentielles**
- Titre de l'annonce (obligatoire, max 100 caractères)
- Description détaillée (obligatoire, min 50 caractères)
  - Pour les personnes : circonstances, histoire, détails physiques
  - Pour les animaux : race, couleur, taille, particularités
  - Pour les objets : description, valeur sentimentale, détails distinctifs
- Date de disparition (obligatoire)
- Dernière localisation connue (obligatoire)
  - Pays
  - Ville/Région
  - Adresse ou lieu précis (optionnel)
- Statut d'urgence (Urgent / Normal)

**Étape 3 : Photos**
- Upload de photos (minimum 1 recommandé, maximum 10)
- Drag & drop ou sélection de fichiers
- Prévisualisation avant publication
- Possibilité de définir une photo principale

**Étape 4 : Coordonnées de contact**
- Email (obligatoire, pré-rempli si connecté)
- Téléphone (optionnel)
- Autres moyens de contact (WhatsApp, Facebook, etc.) - optionnel
- Choix de visibilité : Public / Visible uniquement aux membres connectés

**Étape 5 : Vérification et publication**
- Aperçu de l'annonce
- Acceptation des conditions d'utilisation
- Bouton "Publier l'annonce"

**Aide contextuelle** :
- Conseils pour chaque étape
- Exemples de bonnes descriptions
- Recommandations pour les photos

---

### 4. Page de détail d'annonce
**Objectif** : Présenter toutes les informations d'une annonce et faciliter l'action

**Sections** :

**En-tête** :
- Badge de type et statut
- Titre
- Date de publication et dernière mise à jour
- Nombre de vues

**Galerie photos** :
- Photo principale en grand format
- Miniatures pour navigation
- Zoom sur les photos

**Informations principales** :
- Description complète
- Date de disparition
- Dernière localisation connue (avec carte interactive si possible)
- Coordonnées de contact (selon visibilité choisie)

**Actions communautaires** :
- Bouton "J'ai une information" (ouvre formulaire de signalement)
- Bouton "Partager" (réseaux sociaux, lien direct, email)
- Bouton "Signaler" (pour modération)
- Bouton "Suivre cette annonce" (notifications)

**Section commentaires** :
- Liste des commentaires publics
- Formulaire pour ajouter un commentaire (connexion requise)
- Possibilité de répondre aux commentaires
- Modération visible (commentaires en attente)

**Section signalements d'informations** :
- Nombre de signalements reçus (visible uniquement par le créateur)
- Liste des signalements (privée, visible uniquement par le créateur)
- Formulaire de signalement :
  - Type d'information : J'ai vu / J'ai des informations / Autre
  - Description détaillée
  - Coordonnées de contact
  - Photos jointes (optionnel)

**Informations complémentaires** :
- Profil du créateur (nom, date d'inscription)
- Annonces similaires
- Historique des mises à jour (si l'annonce a été modifiée)

---

### 5. Page "Perdu de vue" (Section éditoriale)
**Objectif** : Créer un espace inspirant pour les témoignages et histoires

**Contenu** :
- Introduction éditoriale :
  *"Peut-être reconnaîtrez-vous l'une des personnes évoquées dans ces histoires. À votre tour, publiez votre propre annonce 'Perdu de vue' et lancez votre bouteille à la mer."*

**Sections** :
- Histoires mises en avant (sélection éditoriale)
- Témoignages de la communauté
- Annonces "Perdu de vue" récentes
- Catégories d'histoires :
  - Famille éloignée
  - Amis d'enfance
  - Anciens voisins
  - Autres témoignages

**Format des histoires** :
- Titre évocateur
- Histoire racontée (format long)
- Photos associées
- Appel à la communauté
- Bouton "Je reconnais cette personne"

**Fonctionnalités** :
- Filtres par type d'histoire
- Recherche dans les témoignages
- Partage facilité
- Possibilité de contacter l'auteur directement

---

### 6. Espace utilisateur / Compte
**Objectif** : Gérer son profil et ses annonces

**Sections** :

**Tableau de bord** :
- Vue d'ensemble des statistiques :
  - Nombre d'annonces publiées
  - Nombre de vues totales
  - Nombre de commentaires reçus
  - Nombre de signalements reçus
  - Annonces résolues

**Mes annonces** :
- Liste de toutes les annonces créées
- Filtres : En cours / Résolues / Archivées
- Actions rapides : Modifier / Dupliquer / Archiver / Supprimer
- Possibilité de marquer une annonce comme "Résolue"

**Mes signalements** :
- Liste des signalements envoyés à d'autres annonces
- Statut de chaque signalement

**Mes commentaires** :
- Historique des commentaires laissés

**Profil** :
- Informations personnelles :
  - Nom (optionnel, peut être un pseudonyme)
  - Email
  - Photo de profil (optionnel)
  - Bio (optionnel)
- Paramètres de confidentialité
- Préférences de notifications

**Paramètres** :
- Changer le mot de passe
- Gérer les notifications :
  - Email pour nouveaux commentaires
  - Email pour nouveaux signalements
  - Email pour annonces similaires
- Supprimer le compte

---

### 7. Page de connexion / Inscription
**Objectif** : Authentification simple et rapide

**Inscription** :
- Formulaire simple :
  - Email (obligatoire, validation)
  - Mot de passe (obligatoire, min 8 caractères, indication de force)
  - Confirmation du mot de passe
  - Acceptation des conditions d'utilisation et politique de confidentialité
- Message de bienvenue après inscription
- Redirection vers la page d'accueil ou formulaire de publication

**Connexion** :
- Formulaire :
  - Email
  - Mot de passe
  - Case "Se souvenir de moi"
  - Lien "Mot de passe oublié ?"
- Connexion possible depuis toutes les pages nécessitant une authentification

**Récupération de mot de passe** :
- Formulaire avec email
- Envoi d'email de réinitialisation
- Page de réinitialisation avec nouveau mot de passe

---

## 🔍 Fonctionnalités transversales

### Système de recherche
- Recherche textuelle dans :
  - Titres d'annonces
  - Descriptions
  - Noms de personnes/animaux
  - Localisations
- Recherche par filtres multiples
- Suggestions de recherche
- Historique de recherche (pour utilisateurs connectés)
- Recherche sauvegardée (alertes)

### Système de notifications
- Notifications en temps réel (si possible) ou par email :
  - Nouveau commentaire sur une annonce
  - Nouveau signalement reçu
  - Nouvelle annonce similaire publiée
  - Mise à jour d'une annonce suivie
- Centre de notifications dans l'espace utilisateur
- Préférences de notification personnalisables

### Système de partage
- Partage sur réseaux sociaux :
  - Facebook
  - Twitter/X
  - WhatsApp
  - LinkedIn
- Partage par email
- Génération de lien direct
- Code QR pour partage mobile

### Système de modération
- Signalement de contenu :
  - Par les utilisateurs (bouton "Signaler")
  - Raisons : Contenu inapproprié / Spam / Fausse information / Autre
- Modération manuelle par l'équipe
- Modération automatique (filtres de base)
- Statuts d'annonce :
  - Publiée
  - En attente de modération
  - Modérée / Masquée
  - Supprimée

---

## 🎨 Principes d'interface utilisateur

### Design général
- **Style** : Moderne, épuré, accessible
- **Couleurs** : Palette sobre et rassurante (bleus, verts doux, oranges pour l'urgence)
- **Typographie** : Lisible, hiérarchie claire
- **Responsive** : Adapté mobile, tablette, desktop
- **Accessibilité** : Respect des standards WCAG

### Navigation
- Menu principal toujours visible :
  - Logo Trouvita (lien vers accueil)
  - Rechercher
  - Publier une annonce
  - Perdu de vue
  - Connexion / Mon compte
- Menu mobile : Hamburger avec navigation complète
- Breadcrumbs sur les pages profondes
- Boutons d'action clairs et visibles

### Expérience utilisateur
- **Rapidité** : Chargement optimisé, images lazy-load
- **Simplicité** : Parcours utilisateur intuitif, pas de frictions
- **Guidance** : Aide contextuelle, tooltips, messages d'encouragement
- **Feedback** : Confirmations d'actions, messages de succès/erreur clairs
- **Empathie** : Ton bienveillant, messages adaptés au contexte (disparition = ton respectueux)

---

## 📊 Gestion des données

### Types d'annonces
- **Personnes disparues** :
  - Informations personnelles (nom, âge, description physique)
  - Circonstances de disparition
  - Dernière localisation
  - Photos
  - Coordonnées de contact

- **Animaux perdus** :
  - Type d'animal (chien, chat, etc.)
  - Race
  - Description physique
  - Particularités (puce, collier, etc.)
  - Dernière localisation
  - Photos
  - Coordonnées de contact

- **Objets perdus** :
  - Type d'objet
  - Description détaillée
  - Valeur (sentimentale/monétaire)
  - Dernière localisation
  - Photos
  - Coordonnées de contact

### Métadonnées
- Date de création
- Date de dernière modification
- Statut (en cours, résolu, archivé)
- Niveau d'urgence
- Nombre de vues
- Nombre de commentaires
- Nombre de partages
- Nombre de signalements

---

## 🔐 Sécurité et confidentialité

### Protection des données
- Chiffrement des mots de passe
- Protection des données personnelles
- Respect du RGPD (si applicable)
- Politique de confidentialité claire

### Modération
- Vérification manuelle des annonces sensibles
- Filtres automatiques pour contenu inapproprié
- Système de signalement accessible
- Réponse rapide aux signalements

### Limites et règles
- Pas de contenu illégal
- Pas de harcèlement
- Respect de la vie privée
- Vérification des informations sensibles avant publication

---

## 🚀 Fonctionnalités futures (Améliorations suggérées)

### Phase 2
- **Carte interactive** : Visualisation géographique des annonces
- **Alertes géolocalisées** : Notifications pour nouvelles annonces dans une zone
- **Application mobile native** : iOS et Android
- **Chat intégré** : Communication directe entre utilisateurs
- **Vérification de compte** : Badge pour comptes vérifiés (familles, associations)

### Phase 3
- **Intelligence artificielle** : Reconnaissance faciale pour personnes disparues (avec consentement)
- **Réseau de partenaires** : Intégration avec associations, forces de l'ordre
- **Statistiques avancées** : Tableaux de bord pour associations
- **Multilingue** : Support de plusieurs langues africaines
- **Système de récompenses** : Badges pour membres actifs de la communauté

### Phase 4
- **API publique** : Pour intégrations tierces
- **Widgets** : Pour sites partenaires
- **Campagnes de sensibilisation** : Outils pour mobiliser autour d'une annonce
- **Rapports automatiques** : Génération de rapports pour autorités

---

## 📝 Contenus éditoriaux

Voir le document `CONTENUS_EDITORIAUX.md` pour tous les textes, messages et contenus de l'interface.

---

## 🎯 Objectifs de performance

- Temps de chargement < 3 secondes
- Taux de conversion inscription > 30%
- Taux de publication d'annonce > 60% après inscription
- Taux de résolution (annonces marquées résolues) > 15%
- Satisfaction utilisateur > 4/5

---

*Document créé le [Date] - Version 1.0*

