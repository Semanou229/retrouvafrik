'use client'

import { TrendingUp, Users, FileText, MapPin, BarChart3, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface AdminStatsDashboardProps {
  stats: {
    totalAnnouncements: number
    personAnnouncements: number
    animalAnnouncements: number
    objectAnnouncements: number
    resolvedAnnouncements: number
    topCities: Array<{ city: string; count: number }>
    monthlyStats: Record<string, number>
  }
}

export default function AdminStatsDashboard({ stats }: AdminStatsDashboardProps) {
  const monthlyData = Object.entries(stats.monthlyStats)
    .sort(([a], [b]) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(-6) // Derniers 6 mois

  const maxCount = Math.max(...monthlyData.map(([, count]) => count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Dashboard Statistiques</h1>
            </div>
            <p className="text-orange-100">Vue d'ensemble de l'activité sur RetrouvAfrik</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total annonces</p>
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Personnes</p>
            <Users className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{stats.personAnnouncements}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Animaux</p>
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{stats.animalAnnouncements}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Objets</p>
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{stats.objectAnnouncements}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retrouvés */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Retrouvés</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total retrouvés</p>
              <p className="text-4xl font-bold text-green-500">{stats.resolvedAnnouncements}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Taux de réussite</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{
                      width: `${stats.totalAnnouncements > 0 ? (stats.resolvedAnnouncements / stats.totalAnnouncements) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {stats.totalAnnouncements > 0
                    ? Math.round((stats.resolvedAnnouncements / stats.totalAnnouncements) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top villes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Villes les plus actives</h2>
          </div>
          <div className="space-y-3">
            {stats.topCities.length > 0 ? (
              stats.topCities.map((item, index) => (
                <div key={item.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary w-8">{index + 1}</span>
                    <span className="font-medium">{item.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.count / Math.max(...stats.topCities.map(c => c.count), 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Croissance du trafic */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Croissance du trafic</h2>
        </div>
        <div className="space-y-4">
          {monthlyData.length > 0 ? (
            <>
              <div className="grid grid-cols-6 gap-4">
                {monthlyData.map(([month, count]) => (
                  <div key={month} className="text-center">
                    <div className="relative h-32 bg-gray-100 rounded-lg flex items-end justify-center p-2">
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all"
                        style={{ height: `${(count / maxCount) * 100}%` }}
                      />
                      <span className="absolute -bottom-6 text-xs font-semibold text-gray-700">
                        {count}
                      </span>
                    </div>
                    <p className="mt-8 text-xs text-gray-600">{month}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Évolution sur 6 mois</span>
                  <span className="text-lg font-bold text-primary">
                    {monthlyData.length > 1
                      ? monthlyData[monthlyData.length - 1][1] - monthlyData[0][1] > 0
                        ? `+${monthlyData[monthlyData.length - 1][1] - monthlyData[0][1]}`
                        : monthlyData[monthlyData.length - 1][1] - monthlyData[0][1]
                      : 0}{' '}
                    annonces
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </div>
  )
}

