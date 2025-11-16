// Middleware pour Cloudflare Pages
// Ce fichier permet de gérer les routes Next.js sur Cloudflare Pages

export const onRequest: PagesFunction = async (context) => {
  // Laisser Cloudflare Pages gérer automatiquement les routes Next.js
  return context.next()
}

