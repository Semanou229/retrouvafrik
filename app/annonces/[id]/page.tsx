import Navigation from '@/components/Navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AnnouncementDetail from '@/components/AnnouncementDetail'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function AnnouncementPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()
  
      // Fetch announcement - Vérifier qu'elle n'est pas masquée ou non approuvée
      const { data: announcement, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', params.id)
        .eq('hidden', false)
        .eq('approved', true)
        .single()

  if (error || !announcement) {
    notFound()
  }

  // Increment views count
  await supabase
    .from('announcements')
    .update({ views_count: (announcement.views_count || 0) + 1 })
    .eq('id', params.id)

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, user:user_id(email)')
    .eq('announcement_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnnouncementDetail announcement={announcement} comments={comments || []} />
      </div>
    </div>
  )
}

