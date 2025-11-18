'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { Search, Plus, Eye, LogIn, LogOut, User, MessageCircle, LayoutDashboard, ChevronDown, Shield, HelpCircle, Info, BookOpen } from 'lucide-react'
import UnreadMessagesBadge from './UnreadMessagesBadge'
import AdBanner from './AdBanner'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getUserDisplayName } from '@/lib/utils/user'
import RetrouvAfrikLogo from './RetrouvAfrikLogo'

export default function Navigation() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <React.Fragment>
      {/* Publicité header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner placement="header" />
        </div>
      </div>
      <nav className={`bg-white shadow-lg md:sticky md:top-0 ${mobileMenuOpen ? 'z-[50]' : 'z-[100]'} border-b border-gray-100 backdrop-blur-sm bg-white/95 relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <RetrouvAfrikLogo variant="header" width={40} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/annonces"
              className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/annonces')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Annonces</span>
            </Link>
            <Link
              href="/perdu-de-vue"
              className={`px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/perdu-de-vue')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              Perdu de vue
            </Link>

            {/* Comment ça marche - Toujours visible */}
            <Link
              href="/comment-ca-marche"
              className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/comment-ca-marche')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden lg:inline">Comment ça marche</span>
              <span className="lg:hidden">Comment</span>
            </Link>

            {/* Ressources */}
            <Link
              href="/ressources"
              className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/ressources')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ressources</span>
            </Link>

            {/* FAQ et Contact - Visible uniquement si non connecté */}
            {!loading && !user && (
              <>
                <Link
                  href="/faq"
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive('/faq')
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  FAQ
                </Link>
                <Link
                  href="/contact"
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive('/contact')
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Contact
                </Link>
              </>
            )}

                {loading ? (
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                ) : user ? (
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    {/* Publier une annonce - Visible quand connecté */}
                    <Link
                      href="/publier"
                      className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden lg:inline">Publier une annonce</span>
                      <span className="lg:hidden">Publier</span>
                    </Link>
                    {/* Admin - Visible uniquement pour les admins */}
                    {(user.email?.includes('admin') || user.user_metadata?.role === 'admin') && (
                      <Link
                        href="/admin"
                        className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive('/admin')
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm hidden lg:inline">Admin</span>
                      </Link>
                    )}

                    {/* Tableau de bord - Directement dans le header */}
                    <Link
                      href="/mon-compte"
                      className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive('/mon-compte')
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="text-sm hidden lg:inline">Tableau de bord</span>
                      <span className="text-sm lg:hidden">Dashboard</span>
                    </Link>

                    {/* Messages - Directement dans le header */}
                    <Link
                      href="/messages"
                      className={`relative flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive('/messages')
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm hidden lg:inline">Messages</span>
                      <UnreadMessagesBadge />
                    </Link>

                    {/* Support - Visible uniquement pour les non-admins */}
                    {!(user.email?.includes('admin') || user.user_metadata?.role === 'admin') && (
                      <Link
                        href="/support"
                        className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive('/support')
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm hidden lg:inline">Support</span>
                      </Link>
                    )}

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-1.5 px-2 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-primary hover:bg-gray-50 whitespace-nowrap"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">Profil</span>
                    <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{getUserDisplayName(user)}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      </div>
                      <Link
                        href="/profil"
                        onClick={(e) => {
                          e.preventDefault()
                          setProfileMenuOpen(false)
                          window.location.href = '/profil'
                        }}
                        className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                          isActive('/profil')
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Mon profil</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1" />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          signOut()
                          setProfileMenuOpen(false)
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Publier une annonce - À côté de Connexion quand non connecté */}
                <Link
                  href="/publier"
                  className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Publier une annonce</span>
                  <span className="sm:hidden">Publier</span>
                </Link>
                <Link
                  href="/connexion"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Connexion</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and messages icon */}
          <div className="md:hidden flex items-center gap-2">
            {/* Messages icon - Only when connected */}
            {!loading && user && (
              <Link
                href="/messages"
                className="relative p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Messages"
              >
                <MessageCircle className="w-6 h-6" />
                <UnreadMessagesBadge />
              </Link>
            )}
            {/* Mobile menu button */}
            {!mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu overlay - Rendered via Portal */}
        {typeof window !== 'undefined' && mobileMenuOpen && document.body && createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block' }}
            />
            {/* Mobile menu sidebar */}
            <div 
              className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white shadow-2xl z-[9999] md:hidden overflow-y-auto"
              style={{ display: 'block', visibility: 'visible', opacity: 1 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <RetrouvAfrikLogo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    aria-label="Fermer le menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Menu items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="space-y-1 px-2">
                    <Link
                      href="/"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive('/')
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>🏠</span>
                      <span>Accueil</span>
                    </Link>
                    <Link
                      href="/annonces"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive('/annonces')
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Search className="w-5 h-5" />
                      <span>Annonces</span>
                    </Link>
                    <Link
                      href="/perdu-de-vue"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive('/perdu-de-vue')
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>💭</span>
                      <span>Perdu de vue</span>
                    </Link>

                    {/* Comment ça marche - Toujours visible */}
                    <Link
                      href="/comment-ca-marche"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive('/comment-ca-marche')
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Info className="w-5 h-5" />
                      <span>Comment ça marche</span>
                    </Link>

                    {/* Ressources */}
                    <Link
                      href="/ressources"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive('/ressources')
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Ressources</span>
                    </Link>

                    {/* Section pour utilisateurs non connectés */}
                    {!loading && !user && (
                      <>
                        {/* FAQ et Contact - Visible uniquement si non connecté */}
                        <Link
                          href="/faq"
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive('/faq')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <HelpCircle className="w-5 h-5" />
                          <span>FAQ</span>
                        </Link>
                        <Link
                          href="/contact"
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive('/contact')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Contact</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-4" />

                        {/* Bouton Publier une annonce */}
                        <Link
                          href="/publier"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Plus className="w-5 h-5" />
                          <span>Publier une annonce</span>
                        </Link>

                        {/* Divider avant Connexion */}
                        <div className="border-t border-gray-200 my-4" />

                        {/* Bouton Connexion */}
                        <Link
                          href="/connexion"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LogIn className="w-5 h-5" />
                          <span>Connexion</span>
                        </Link>
                      </>
                    )}

                    {/* Section pour utilisateurs connectés */}
                    {!loading && user && (
                      <>
                        {/* Divider */}
                        <div className="border-t border-gray-200 my-4" />

                        {/* Admin - Visible uniquement pour les admins */}
                        {(user.email?.includes('admin') || user.user_metadata?.role === 'admin') && (
                          <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                              isActive('/admin')
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Shield className="w-5 h-5" />
                            <span>Administration</span>
                          </Link>
                        )}

                        {/* Tableau de bord */}
                        <Link
                          href="/mon-compte"
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive('/mon-compte')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Tableau de bord</span>
                        </Link>

                        {/* Messages */}
                        <Link
                          href="/messages"
                          className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            isActive('/messages')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Messages</span>
                          <UnreadMessagesBadge />
                        </Link>

                        {/* Support - Visible uniquement pour les non-admins */}
                        {!(user.email?.includes('admin') || user.user_metadata?.role === 'admin') && (
                          <Link
                            href="/support"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                              isActive('/support')
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <HelpCircle className="w-5 h-5" />
                            <span>Support</span>
                          </Link>
                        )}

                      </>
                    )}

                    {/* État de chargement */}
                    {loading && (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                      </div>
                    )}
                  </nav>
                </div>

                {/* Footer - Profile Menu - Seulement si connecté */}
                {!loading && user && (
                  <div className="border-t border-gray-200 p-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setProfileMenuOpen(!profileMenuOpen)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {profileMenuOpen && (
                      <div className="pl-4 pt-2 space-y-1">
                        <Link
                          href="/profil"
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer touch-manipulation ${
                            isActive('/profil')
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMobileMenuOpen(false)
                            setProfileMenuOpen(false)
                            window.location.href = '/profil'
                          }}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <User className="w-5 h-5" />
                          <span>Mon profil</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            signOut()
                            setMobileMenuOpen(false)
                            setProfileMenuOpen(false)
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </nav>
    </React.Fragment>
  )
}

