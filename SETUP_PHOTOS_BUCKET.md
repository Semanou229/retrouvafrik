# Configuration du bucket 'photos' pour RetrouvAfrik

## Bucket de stockage requis

Le bucket `photos` est utilisé pour stocker :
- Les photos des annonces (`announcements/`)
- Les visuels des campagnes publicitaires (`ads/`)

## Création automatique du bucket

Vous pouvez créer le bucket automatiquement en exécutant :

```bash
node scripts/create-photos-bucket.js
```

## Création manuelle du bucket

Si vous préférez créer le bucket manuellement :

1. Allez dans votre projet Supabase Dashboard
2. Naviguez vers **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Créez un bucket nommé `photos` avec les paramètres suivants :
   - **Name**: `photos`
   - **Public bucket**: ✅ Activé (pour permettre l'accès public aux photos)
   - **File size limit**: 5 MB (ou selon vos besoins)
   - **Allowed MIME types**: `image/*`

## Configuration des politiques RLS

Après avoir créé le bucket, vous devez appliquer les politiques RLS. Vous pouvez :

### Option 1 : Via l'éditeur SQL de Supabase (Recommandé)

1. Allez dans **SQL Editor** dans le dashboard Supabase
2. Copiez le contenu du fichier `supabase/migrations/021_create_photos_bucket_policies.sql`
3. Collez dans l'éditeur SQL
4. Cliquez sur **Run** pour exécuter

**Note** : Le script supprime d'abord les politiques existantes (si elles existent) avant de les recréer, ce qui évite les erreurs de syntaxe.

### Option 2 : Via la migration Supabase CLI

Si vous utilisez Supabase CLI :

```bash
supabase migration up
```

## Structure des dossiers

Les fichiers seront organisés comme suit :
- `photos/announcements/{timestamp}-{random}.{ext}` - Photos des annonces
- `photos/ads/{timestamp}-{random}.{ext}` - Visuels des campagnes publicitaires

## Vérification

Pour vérifier que le bucket fonctionne correctement :

1. Essayez de créer une nouvelle annonce avec une photo
2. Essayez de créer une campagne publicitaire avec un visuel

Si vous rencontrez toujours une erreur "Bucket not found", vérifiez :
- Que le bucket `photos` existe dans Supabase Storage
- Que les politiques RLS ont été appliquées correctement
- Que vous êtes connecté en tant qu'utilisateur authentifié (pour les uploads)

