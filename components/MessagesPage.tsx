'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Send, Image as ImageIcon, MapPin, ArrowLeft, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/types'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'

interface MessagesPageProps {
  initialMessages: Message[]
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

export default function MessagesPage({ initialMessages, announcementId }: MessagesPageProps) {
  const { user } = useAuth()
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

  // Load user emails for messages that don't have them yet
  useEffect(() => {
    const loadUserEmails = async () => {
      if (!user || messages.length === 0) {
        setLoadingEmails(false)
        return
      }

      const messagesNeedingEmails = messages.filter(
        msg => !msg.sender?.email || msg.sender.email === 'Chargement...' ||
                !msg.recipient?.email || msg.recipient.email === 'Chargement...'
      )

      if (messagesNeedingEmails.length === 0) {
        setLoadingEmails(false)
        return
      }

      const messagesWithEmails = await Promise.all(
        messages.map(async (msg) => {
          // If emails are already loaded, skip
          if (msg.sender?.email && msg.sender.email !== 'Chargement...' && 
              msg.recipient?.email && msg.recipient.email !== 'Chargement...') {
            return msg
          }

          try {
            // Fetch emails using RPC function
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
  }, [user, supabase])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedConversation])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`,
        },
        async (payload) => {
          // Fetch the new message with relations
          const { data } = await supabase
            .from('messages')
            .select('*, announcement:announcements(id, title)')
            .eq('id', payload.new.id)
            .single()
          
          if (data) {
            // Fetch sender and recipient emails
            try {
              const { data: senderEmail } = await supabase.rpc('get_user_email', { user_id: data.sender_id })
              const { data: recipientEmail } = await supabase.rpc('get_user_email', { user_id: data.recipient_id })
              
              const messageWithUsers = {
                ...data,
                sender: { email: senderEmail || 'Utilisateur inconnu' },
                recipient: { email: recipientEmail || 'Utilisateur inconnu' },
              }
              
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.find(m => m.id === messageWithUsers.id)) return prev
                return [messageWithUsers, ...prev]
              })
            } catch (err) {
              console.error('Error loading user emails:', err)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        async (payload) => {
          // Same logic for messages received
          const { data } = await supabase
            .from('messages')
            .select('*, announcement:announcements(id, title)')
            .eq('id', payload.new.id)
            .single()
          
          if (data) {
            try {
              const { data: senderEmail } = await supabase.rpc('get_user_email', { user_id: data.sender_id })
              const { data: recipientEmail } = await supabase.rpc('get_user_email', { user_id: data.recipient_id })
              
              const messageWithUsers = {
                ...data,
                sender: { email: senderEmail || 'Utilisateur inconnu' },
                recipient: { email: recipientEmail || 'Utilisateur inconnu' },
              }
              
              setMessages((prev) => {
                if (prev.find(m => m.id === messageWithUsers.id)) return prev
                return [messageWithUsers, ...prev]
              })
            } catch (err) {
              console.error('Error loading user emails:', err)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  // Get unique conversations with unread count
  const conversationsMap = messages.reduce((acc, msg) => {
    if (!msg.announcement_id || !user) return acc
    
    const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
    const key = `${msg.announcement_id}-${otherUserId}`
    
    if (!acc[key]) {
      acc[key] = {
        announcementId: msg.announcement_id,
        otherUserId,
        otherUserEmail: msg.sender_id === user.id 
          ? (msg.recipient?.email || 'Utilisateur inconnu')
          : (msg.sender?.email || 'Utilisateur inconnu'),
        lastMessage: msg,
        announcementTitle: (msg as any).announcement?.title || 'Annonce',
        unreadCount: 0,
      }
    }
    
    // Update last message if this one is newer
    if (new Date(msg.created_at) > new Date(acc[key].lastMessage.created_at)) {
      acc[key].lastMessage = msg
    }
    
    // Count unread messages
    if (msg.recipient_id === user.id && !msg.is_read) {
      acc[key].unreadCount++
    }
    
    return acc
  }, {} as Record<string, Conversation>)
  
  const conversations: Conversation[] = Object.values(conversationsMap)
  
  const conversationList = conversations.sort((a, b) => 
    new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  )

  const currentConversation = conversationList.find(c => c.announcementId === selectedConversation)
  
  // If announcementId is provided but no conversation exists, try to fetch announcement info
  useEffect(() => {
    if (!announcementId || !user) return
    
    // Check if conversation exists for this announcementId
    const conversationExists = conversationList.some(c => c.announcementId === announcementId)
    
    if (!conversationExists) {
      const fetchAnnouncementInfo = async () => {
        const { data: announcement } = await supabase
          .from('announcements')
          .select('id, title, user_id')
          .eq('id', announcementId)
          .single()
        
        if (announcement && announcement.user_id !== user.id) {
          // Find any existing message for this announcement
          const existingMessage = messages.find(
            m => m.announcement_id === announcementId && 
            (m.sender_id === announcement.user_id || m.recipient_id === announcement.user_id)
          )
          
          if (existingMessage) {
            // Conversation exists, select it
            setSelectedConversation(announcementId)
          } else {
            // No conversation yet, but we can still show the announcement info
            setSelectedConversation(announcementId)
          }
        }
      }
      
      fetchAnnouncementInfo()
    }
  }, [announcementId, user, messages, supabase, conversationList])
  
  // Get messages for the selected conversation
  const currentConversationMessages = selectedConversation
    ? messages
        .filter(msg => {
          if (!currentConversation) {
            // If no conversation found but announcementId is selected, show all messages for this announcement
            return msg.announcement_id === selectedConversation
          }
          return msg.announcement_id === selectedConversation &&
            (msg.sender_id === currentConversation.otherUserId || msg.recipient_id === currentConversation.otherUserId)
        })
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : []

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (!selectedConversation || !user) return

    const unreadMessages = currentConversationMessages.filter(
      msg => msg.recipient_id === user.id && !msg.is_read
    )

    if (unreadMessages.length > 0) {
      supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessages.map(m => m.id))
        .then(() => {
          setMessages(prev => prev.map(msg => 
            unreadMessages.find(um => um.id === msg.id) 
              ? { ...msg, is_read: true }
              : msg
          ))
        })
    }
  }, [selectedConversation, currentConversationMessages, user, supabase])

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

  const removePhoto = () => {
    setSelectedPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedPhoto) || !selectedConversation || !user) return
    
    // If no currentConversation, we need to find the announcement owner
    let recipientId = currentConversation?.otherUserId
    
    if (!recipientId) {
      // Fetch announcement to get owner
      const { data: announcement } = await supabase
        .from('announcements')
        .select('user_id')
        .eq('id', selectedConversation)
        .single()
      
      if (!announcement) {
        alert('Impossible de trouver l\'annonce')
        return
      }
      
      recipientId = announcement.user_id
    }

    setIsSending(true)
    setUploadingPhoto(true)
    
    try {
      let photoUrl: string | null = null

      // Upload photo if provided
      if (selectedPhoto) {
        const fileExt = selectedPhoto.name.split('.').pop()
        const fileName = `${selectedConversation}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('messages')
          .upload(fileName, selectedPhoto)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('messages')
          .getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      const messageData: any = {
        announcement_id: selectedConversation,
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage || (photoUrl ? 'Photo partagée' : ''),
        message_type: selectedPhoto ? 'photo' : 'text',
      }

      if (photoUrl) messageData.photo_url = photoUrl

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select('*, announcement:announcements(id, title)')
        .single()

      if (error) throw error

      // Fetch sender and recipient emails using RPC
      const { data: senderEmail } = await supabase.rpc('get_user_email', { user_id: user.id })
      const { data: recipientEmail } = await supabase.rpc('get_user_email', { user_id: recipientId })
      
      const messageWithUsers = {
        ...data,
        sender: { email: senderEmail || 'Utilisateur inconnu' },
        recipient: { email: recipientEmail || 'Utilisateur inconnu' },
      }

      setMessages([messageWithUsers, ...messages])
      setNewMessage('')
      removePhoto()
      
      // Refresh the page to update conversations
      router.refresh()
    } catch (err: any) {
      console.error('Error sending message:', err)
      alert('Erreur lors de l\'envoi du message: ' + (err.message || 'Erreur inconnue'))
    } finally {
      setIsSending(false)
      setUploadingPhoto(false)
    }
  }

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date)
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm', { locale: fr })
    } else if (isYesterday(messageDate)) {
      return `Hier ${format(messageDate, 'HH:mm', { locale: fr })}`
    } else {
      return format(messageDate, 'd MMM yyyy à HH:mm', { locale: fr })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages RetrouvAfrik</h1>
        <p className="text-gray-600">
          {conversationList.length} conversation{conversationList.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex h-[700px]">
          {/* Conversations list */}
          <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-lg">Conversations</h2>
            </div>
            {conversationList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Aucune conversation</p>
                <p className="text-sm">Vos messages apparaîtront ici</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversationList.map((conv) => (
                  <button
                    key={`${conv.announcementId}-${conv.otherUserId}`}
                    onClick={() => setSelectedConversation(conv.announcementId)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation === conv.announcementId ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{conv.announcementTitle}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{conv.otherUserEmail}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {conv.lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatMessageTime(conv.lastMessage.created_at)}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="hidden md:flex flex-1 flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <p className="font-semibold text-lg">
                      {currentConversation?.announcementTitle || 
                       (messages.find(m => m.announcement_id === selectedConversation) as any)?.announcement?.title || 
                       'Annonce'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentConversation?.otherUserEmail || 
                       (currentConversationMessages.length > 0 
                         ? (currentConversationMessages[0].sender_id === user?.id 
                            ? currentConversationMessages[0].recipient?.email 
                            : currentConversationMessages[0].sender?.email)
                         : 'Chargement...')}
                    </p>
                  </div>
                  <LinkIcon
                    className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer"
                    onClick={() => router.push(`/annonces/${selectedConversation}`)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentConversationMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Aucun message dans cette conversation</p>
                      <p className="text-sm mt-2">Envoyez le premier message !</p>
                    </div>
                  ) : (
                    <>
                      {currentConversationMessages.map((msg, idx) => {
                        const isOwn = msg.sender_id === user?.id
                        const showDate = idx === 0 || 
                          new Date(msg.created_at).getDate() !== 
                          new Date(currentConversationMessages[idx - 1].created_at).getDate()
                        
                        return (
                          <div key={msg.id}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500">
                                  {format(new Date(msg.created_at), 'd MMMM yyyy', { locale: fr })}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isOwn
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                                }`}
                              >
                                {msg.photo_url && (
                                  <div className="mb-2">
                                    <Image
                                      src={msg.photo_url}
                                      alt="Photo partagée"
                                      width={300}
                                      height={300}
                                      className="rounded-lg max-w-full h-auto"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                {msg.location && (
                                  <div className={`mb-2 flex items-center gap-2 ${isOwn ? 'text-white/90' : 'text-gray-600'}`}>
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs">
                                      Localisation partagée
                                    </span>
                                  </div>
                                )}
                                {msg.content && (
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                )}
                                <p className={`text-xs mt-1 ${
                                  isOwn ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  {formatMessageTime(msg.created_at)}
                                  {isOwn && msg.is_read && (
                                    <span className="ml-1">✓✓</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  {photoPreview && (
                    <div className="mb-3 relative inline-block">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary">
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={isSending}
                    >
                      <ImageIcon className="w-5 h-5 text-gray-600" />
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
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isSending || (!newMessage.trim() && !selectedPhoto)}
                      className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Sélectionnez une conversation</p>
                  <p className="text-sm mt-2">ou créez-en une depuis une annonce</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
