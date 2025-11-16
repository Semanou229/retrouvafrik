'use client'

import { useState } from 'react'
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
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

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
        .select('*, user:user_id(email)')
        .single()

      if (error) throw error

      setComments([data, ...comments])
      setContent('')
    } catch (err) {
      console.error('Error posting comment:', err)
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

