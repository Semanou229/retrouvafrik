'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Comment } from '@/lib/types'

interface CommentSectionProps {
  announcementId: string
  initialComments: Comment[]
}

export default function CommentSection({ announcementId, initialComments }: CommentSectionProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  // Charger les commentaires avec les emails des utilisateurs
  useEffect(() => {
    const loadCommentsWithEmails = async () => {
      if (!initialComments || initialComments.length === 0) {
        setComments([])
        return
      }

      // Récupérer les emails pour chaque commentaire via une requête directe
      const commentsWithEmails = await Promise.all(
        initialComments.map(async (comment) => {
          if (comment.user_id) {
            try {
              // Utiliser une fonction RPC si disponible, sinon récupérer depuis la table auth.users
              const { data: emailData, error } = await supabase.rpc('get_user_email', {
                user_id_param: comment.user_id
              })
              
              if (!error && emailData) {
                return {
                  ...comment,
                  user: { email: emailData }
                }
              }
              
              // Fallback: utiliser l'email de l'utilisateur actuel si c'est son commentaire
              if (user && user.id === comment.user_id) {
                return {
                  ...comment,
                  user: { email: user.email || 'Utilisateur' }
                }
              }
              
              return { ...comment, user: null }
            } catch (err) {
              console.error('Erreur récupération email:', err)
              // Fallback: utiliser l'email de l'utilisateur actuel si c'est son commentaire
              if (user && user.id === comment.user_id) {
                return {
                  ...comment,
                  user: { email: user.email || 'Utilisateur' }
                }
              }
              return { ...comment, user: null }
            }
          }
          return { ...comment, user: null }
        })
      )

      setComments(commentsWithEmails)
    }

    loadCommentsWithEmails()
  }, [initialComments, user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/connexion')
      return
    }

    if (!content.trim()) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            announcement_id: announcementId,
            user_id: user.id,
            content: content.trim(),
          },
        ])
        .select('*')
        .single()

      if (error) throw error

      // Ajouter l'email de l'utilisateur au commentaire
      const newComment = {
        ...data,
        user: { email: user.email || 'Utilisateur' }
      }

      setComments([newComment, ...comments])
      setContent('')
    } catch (err) {
      console.error('Error posting comment:', err)
      alert('Erreur lors de la publication du commentaire. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Commentaires ({comments.length})
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez un commentaire..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Publication...' : 'Publier'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <a href="/connexion" className="text-primary hover:underline">
              Connectez-vous
            </a>{' '}
            pour laisser un commentaire
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {comment.user?.email || 'Anonyme'}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {format(new Date(comment.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Soyez le premier à commenter et à apporter votre soutien.</p>
        </div>
      )}
    </div>
  )
}

