# 🔧 Solution pour l'Erreur async_hooks

## Problème

```
Error: No such module "__next-on-pages-dist__/functions/async_hooks".
```

`@cloudflare/next-on-pages` essaie d'utiliser `async_hooks` qui n'est pas disponible dans Edge Runtime.

## Solution

Retirer `export const runtime = 'edge'` des pages qui causent des problèmes et laisser Cloudflare Pages utiliser le runtime Node.js par défaut.

## Pages à Modifier

Les pages suivantes doivent utiliser Node.js runtime au lieu d'Edge Runtime :
- `app/page.tsx` (page d'accueil)
- Toutes les pages admin
- Toutes les pages qui utilisent `supabase.auth.getSession()`

## Alternative

Si le problème persiste, on peut :
1. Utiliser `output: 'export'` dans `next.config.js` pour un export statique
2. Ou utiliser Vercel au lieu de Cloudflare Pages (meilleur support Next.js)

