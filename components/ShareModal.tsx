'use client'

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton } from 'react-share'
import { X, Facebook, Twitter, Mail, MessageCircle, Link2 } from 'lucide-react'
import { useState } from 'react'
import type { Announcement } from '@/lib/types'

interface ShareModalProps {
  announcement: Announcement
  onClose: () => void
}

export default function ShareModal({ announcement, onClose }: ShareModalProps) {
  const [linkCopied, setLinkCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/annonces/${announcement.id}` : ''
  const shareTitle = announcement.title

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Partager cette annonce</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <FacebookShareButton url={shareUrl} title={shareTitle}>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Facebook className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Facebook</span>
            </div>
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Twitter className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium">Twitter</span>
            </div>
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">WhatsApp</span>
            </div>
          </WhatsappShareButton>

          <EmailShareButton url={shareUrl} subject={shareTitle}>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Mail className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium">Email</span>
            </div>
          </EmailShareButton>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lien direct
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              {linkCopied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

