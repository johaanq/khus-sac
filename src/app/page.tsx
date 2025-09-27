"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Professional } from "@/lib/api"
import { Search, MapPin, Star, Filter, X, MessageCircle, Edit, ArrowRight, Users, Award, Shield } from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [minRate, setMinRate] = useState("")
  const [maxRate, setMaxRate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadProfessionals()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [professionals, searchTerm, locationFilter, minRate, maxRate])

  const loadProfessionals = async () => {
    try {
      const data = await api.getProfessionals()
      setProfessionals(data)
      setFilteredProfessionals(data)
    } catch (error) {
      console.error("Error loading professionals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = professionals

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.profession.toLowerCase().includes(search) ||
          p.services.some((s) => s.toLowerCase().includes(search)),
      )
    }

    // Location filter
    if (locationFilter) {
      const location = locationFilter.toLowerCase()
      filtered = filtered.filter(
        (p) => p.location.district.toLowerCase().includes(location) || p.location.city.toLowerCase().includes(location),
      )
    }

    // Rate filters
    if (minRate) {
      filtered = filtered.filter((p) => p.rate.min >= Number.parseInt(minRate))
    }
    if (maxRate) {
      filtered = filtered.filter((p) => p.rate.max <= Number.parseInt(maxRate))
    }

    setFilteredProfessionals(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setMinRate("")
    setMaxRate("")
    setShowFilters(false)
  }

  const hasActiveFilters = searchTerm || locationFilter || minRate || maxRate

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando profesionales...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Conecta con los mejores
              <span className="block font-medium text-gray-700">profesionales</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
              Encuentra y contrata profesionales verificados para tus proyectos. 
              Diseño, desarrollo, fotografía y más en un solo lugar.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, profesión o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-white border-2 border-gray-200 focus:border-gray-900 transition-colors text-lg rounded-full shadow-sm"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-gray-900 hover:bg-gray-800 rounded-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                <MapPin className="w-4 h-4 mr-2" />
                Lima
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                Diseño
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                Desarrollo
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                Fotografía
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      {showFilters && (
        <section className="bg-gray-50 py-8 px-4 border-t border-gray-200">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Ubicación</label>
                  <Input
                    placeholder="Distrito o ciudad"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-white border-gray-200 focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Tarifa mínima (PEN)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    className="bg-white border-gray-200 focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Tarifa máxima (PEN)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="bg-white border-gray-200 focus:border-gray-900"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex justify-end mt-6">
                  <Button variant="ghost" onClick={clearFilters} className="text-gray-600 hover:text-gray-900">
                    <X className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Professionals Grid */}
      <section id="professionals" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              {filteredProfessionals.length > 0 ? "Profesionales Disponibles" : "No se encontraron profesionales"}
            </h2>
            {filteredProfessionals.length > 0 && (
              <p className="text-gray-600 text-lg">
                {filteredProfessionals.length} profesional{filteredProfessionals.length !== 1 ? "es" : ""} encontrado{filteredProfessionals.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProfessionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">No se encontraron resultados</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Intenta ajustar tus filtros de búsqueda o explora nuestras categorías principales</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="px-8 py-3 border-gray-200 hover:border-gray-900">
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const isOwnProfile = user && professional.name === user.name

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = encodeURIComponent(
      `Hola ${professional.name}, vi tu perfil en KHUS SAC y me interesa contactarte para un proyecto.`,
    )
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${professional.phone.replace(/\D/g, "")}&text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = "/profile"
  }

  return (
    <Card className="group bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
      <CardContent className="p-0">
        <Link href={`/professional/${professional.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={professional.profileImage || "/placeholder.svg"}
              alt={professional.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6 space-y-4">
            {/* Name */}
            <h3 className="text-xl font-medium text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
              {professional.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              {professional.description}
            </p>

            {/* Pricing */}
            <div className="text-lg font-semibold text-gray-900">
              {professional.rate.currency} {professional.rate.min}
              {professional.rate.min !== professional.rate.max && ` - ${professional.rate.max}`}
              <span className="text-sm text-gray-500 ml-2">{professional.rate.type}</span>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{professional.location.district}, {professional.location.city}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-gray-200 hover:border-gray-900 hover:bg-gray-50 rounded-lg"
              >
                Ver Perfil
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {isOwnProfile ? (
                <Button
                  onClick={handleEditProfile}
                  size="sm"
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <Button
                  onClick={handleWhatsAppContact}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar
                </Button>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

