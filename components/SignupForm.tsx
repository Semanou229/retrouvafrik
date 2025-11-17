'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createSupabaseClient()

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '' }
    if (pwd.length < 8) return { strength: 1, label: 'Faible' }
    if (pwd.length < 12) return { strength: 2, label: 'Moyen' }
    return { strength: 3, label: 'Fort' }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)

    try {
      // Utiliser une URL absolue pour la redirection vers la complétion du profil
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/completer-profil`
        : 'https://retrouvafrik.vercel.app/completer-profil'
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        // Gérer les erreurs spécifiques
        if (error.message.includes('email rate limit')) {
          throw new Error('Limite d\'envoi d\'emails atteinte. Veuillez réessayer dans quelques minutes.')
        } else if (error.message.includes('sending confirmation email')) {
          throw new Error('Erreur lors de l\'envoi de l\'email de confirmation. Vérifiez votre configuration SMTP dans Supabase.')
        }
        throw error
      }

      // Vérifier si l'email nécessite une confirmation
      if (data.user && !data.session) {
        setSuccess(true)
        setError(null)
        // Ne pas rediriger immédiatement, attendre la confirmation email
        setTimeout(() => {
          router.push('/connexion?message=Vérifiez votre email pour confirmer votre compte')
        }, 3000)
      } else {
        setSuccess(true)
        // Rediriger vers la page de complétion du profil
        setTimeout(() => {
          router.push('/completer-profil')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-primary/10 border border-primary/20 text-primary-dark px-4 py-3 rounded-lg flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        <span>Compte créé avec succès ! Redirection...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="votre.email@exemple.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe *
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  passwordStrength.strength >= level
                    ? passwordStrength.strength === 1
                      ? 'bg-red-500'
                      : passwordStrength.strength === 2
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {passwordStrength.label && `Force : ${passwordStrength.label}`}
            {!passwordStrength.label && 'Minimum 8 caractères'}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer le mot de passe *
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-600 text-sm mt-1">Les mots de passe ne correspondent pas</p>
        )}
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 mr-2"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          J'accepte les conditions d'utilisation et la politique de confidentialité de RetrouvAfrik *
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Création...' : 'Créer mon compte'}
      </button>
    </form>
  )
}

