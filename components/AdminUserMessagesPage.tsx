'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Send, Image as ImageIcon, MapPin, ArrowLeft, X, Loader2 } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/types'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

interface AdminUserMessagesPageProps {
  initialMessages: Message[]
  userId: string
  userEmail: string
  announcementId?: string
}

interface Conversation {
  announcementId: string
  announcementTitle: string
  otherUserId: string
  otherUserEmail: string
  lastMessage: Message
  unreadCount: number
}

export default function AdminUserMessagesPage({
  initialMessages,
  userId,
  userEmail,
  announcementId,
}: AdminUserMessagesPageProps) {
  const router = useRouter()
  const supabase = createSupabaseClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    announcementId || null
  )
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [loadingEmails, setLoadingEmails] = useState(true)

  // Load user emails for messages
  useEffect(() => {
    const loadUserEmails = async () => {
      if (messages.length === 0) {
        setLoadingEmails(false)
        return
      }

      const messagesWithEmails = await Promise.all(
        messages.map(async (msg) => {
          try {
            const { data: senderEmail } = await supabase.rpc('get_user_email', { user_id: msg.sender_id })
            const { data: recipientEmail } = await supabase.rpc('get_user_email', { user_id: msg.recipient_id })
            
            return {
              ...msg,
              sender: { email: senderEmail || 'Utilisateur inconnu' },
              recipient: { email: recipientEmail || 'Utilisateur inconnu' },
            }
          } catch (err) {
            console.error('Error loading emails:', err)
            return {
              ...msg,
              sender: { email: msg.sender?.email || 'Utilisateur inconnu' },
              recipient: { email: msg.recipient?.email || 'Utilisateur inconnu' },
            }
          }
        })
      )

      setMessages(messagesWithEmails)
      setLoadingEmails(false)
    }

    loadUserEmails()
  }, [supabase])

  // Group messages by conversation (announcement)
  const conversations = messages.reduce((acc: Record<string, Conversation>, msg: Message) => {
    if (!msg.announcement_id) return acc

    const key = msg.announcement_id
    if (!acc[key]) {
      acc[key] = {
        announcementId: key,
        announcementTitle: msg.announcement?.title || 'Annonce supprimée',
        otherUserId: msg.sender_id === userId ? msg.recipient_id : msg.sender_id,
        otherUserEmail: msg.sender_id === userId 
          ? msg.recipient?.email || 'Utilisateur inconnu'
          : msg.sender?.email || 'Utilisateur inconnu',
        lastMessage: msg,
        unreadCount: 0,
      }
    } else {
      // Update last message if this one is newer
      if (new Date(msg.created_at) > new Date(acc[key].lastMessage.created_at)) {
        acc[key].lastMessage = msg
      }
    }
    return acc
  }, {})

  const conversationList = Object.values(conversations).sort(
    (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  )

  // Get messages for selected conversation
  const conversationMessages = selectedConversation
    ? messages
        .filter((msg) => msg.announcement_id === selectedConversation)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : []

  const selectedConv = selectedConversation ? conversations[selectedConversation] : null

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedPhoto) return
    if (!selectedConversation) return

    setIsSending(true)

    try {
      // Determine recipient (the other user in the conversation)
      // If userId is the sender, recipient is recipient_id, otherwise sender_id
      const lastMessage = conversationMessages[conversationMessages.length - 1]
      if (!lastMessage) {
        throw new Error('Aucun message dans cette conversation')
      }

      // Determine recipient: if userId sent the last message, recipient is recipient_id, otherwise sender_id
      const recipientId = lastMessage.sender_id === userId 
        ? lastMessage.recipient_id 
        : lastMessage.sender_id

      let photoUrl = null
      if (selectedPhoto) {
        const fileExt = selectedPhoto.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `messages/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, selectedPhoto)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath)

        photoUrl = publicUrl
      }

      const messageData: any = {
        announcement_id: selectedConversation,
        sender_id: userId,
        recipient_id: recipientId,
        content: newMessage.trim() || '',
        message_type: selectedPhoto ? 'photo' : 'text',
      }

      if (photoUrl) {
        messageData.photo_url = photoUrl
      }

      // Utiliser l'API admin pour envoyer le message au nom de l'utilisateur
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'envoi')
      }

      setNewMessage('')
      setSelectedPhoto(null)
      setPhotoPreview(null)
      router.refresh()
    } catch (err: any) {
      alert('Erreur lors de l\'envoi: ' + err.message)
    } finally {
      setIsSending(false)
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex h-[calc(100vh-300px)] min-h-[600px]">
        {/* Liste des conversations */}
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-2">Conversations</h2>
            <p className="text-sm text-gray-600">Utilisateur: {userEmail}</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingEmails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : conversationList.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {conversationList.map((conv) => (
                  <button
                    key={conv.announcementId}
                    onClick={() => setSelectedConversation(conv.announcementId)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.announcementId ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm truncate">{conv.announcementTitle}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {conv.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isToday(new Date(conv.lastMessage.created_at))
                        ? format(new Date(conv.lastMessage.created_at), 'HH:mm', { locale: fr })
                        : isYesterday(new Date(conv.lastMessage.created_at))
                        ? `Hier ${format(new Date(conv.lastMessage.created_at), 'HH:mm', { locale: fr })}`
                        : format(new Date(conv.lastMessage.created_at), 'd MMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Avec: {conv.otherUserEmail}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages de la conversation sélectionnée */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{selectedConv?.announcementTitle}</h3>
                  <p className="text-sm text-gray-600">
                    Conversation avec {selectedConv?.otherUserEmail}
                  </p>
                </div>
                <Link
                  href={`/annonces/${selectedConversation}`}
                  className="text-primary hover:text-primary-dark text-sm"
                >
                  Voir l'annonce
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((msg: Message) => {
                  const isFromUser = msg.sender_id === userId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isFromUser
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.photo_url && (
                          <div className="mb-2">
                            <Image
                              src={msg.photo_url}
                              alt="Photo partagée"
                              width={300}
                              height={300}
                              className="rounded-lg"
                            />
                          </div>
                        )}
                        {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                        {msg.location && (
                          <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                            <MapPin className="w-3 h-3" />
                            <span>Localisation partagée</span>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${isFromUser ? 'text-white/70' : 'text-gray-500'}`}>
                          {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-200">
                {photoPreview && (
                  <div className="mb-2 relative inline-block">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setPhotoPreview(null)
                        setSelectedPhoto(null)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ajouter une photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Tapez un message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || (!newMessage.trim() && !selectedPhoto)}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ Mode Admin : Les messages seront envoyés au nom de l'utilisateur
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une conversation pour voir les messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

