/**
 * Script pour nettoyer le cache webpack après le build
 * Cloudflare Pages a une limite de 25 MiB par fichier
 * Le cache webpack peut contenir des fichiers très volumineux (>50 MiB)
 */

const fs = require('fs')
const path = require('path')

const cacheDir = path.join(process.cwd(), '.next', 'cache')

if (fs.existsSync(cacheDir)) {
  console.log('🧹 Nettoyage du cache webpack pour Cloudflare Pages...')
  
  // Supprimer le cache webpack qui peut être très volumineux
  const webpackCacheDir = path.join(cacheDir, 'webpack')
  if (fs.existsSync(webpackCacheDir)) {
    // Supprimer récursivement tous les dossiers de cache webpack
    const entries = fs.readdirSync(webpackCacheDir, { withFileTypes: true })
    let totalSize = 0
    let filesRemoved = 0
    
    entries.forEach(entry => {
      const entryPath = path.join(webpackCacheDir, entry.name)
      if (entry.isDirectory()) {
        // Calculer la taille avant suppression
        const stats = getDirSize(entryPath)
        totalSize += stats.size
        filesRemoved += stats.files
        
        fs.rmSync(entryPath, { recursive: true, force: true })
        console.log(`  ✓ Supprimé: ${entry.name} (${formatBytes(stats.size)})`)
      } else {
        const stat = fs.statSync(entryPath)
        totalSize += stat.size
        filesRemoved++
        fs.unlinkSync(entryPath)
        console.log(`  ✓ Supprimé: ${entry.name} (${formatBytes(stat.size)})`)
      }
    })
    
    console.log(`✓ Cache webpack supprimé: ${filesRemoved} fichiers, ${formatBytes(totalSize)} libérés`)
  } else {
    console.log('ℹ Aucun cache webpack trouvé')
  }
  
  // Garder le cache SWC qui est plus petit et utile
  console.log('✓ Cache nettoyé (SWC conservé)')
} else {
  console.log('ℹ Aucun cache à nettoyer')
}

function getDirSize(dirPath) {
  let size = 0
  let files = 0
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    entries.forEach(entry => {
      const entryPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        const subStats = getDirSize(entryPath)
        size += subStats.size
        files += subStats.files
      } else {
        const stat = fs.statSync(entryPath)
        size += stat.size
        files++
      }
    })
  } catch (error) {
    // Ignorer les erreurs de lecture
  }
  
  return { size, files }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
