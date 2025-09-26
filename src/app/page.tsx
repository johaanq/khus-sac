"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Professional } from "@/lib/api"
import { Search, MapPin, Star, Filter, X, MessageCircle, Edit } from "lucide-react"
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando profesionales...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />


      {/* Search and Filters */}
      <section className="py-12 px-4 border-b border-border/60 bg-gradient-to-r from-muted/20 to-muted/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Busca tu profesional ideal</h2>
            <p className="text-muted-foreground">Filtra por ubicación, precio y especialidad</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, profesión o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-background border-2 border-border/50 focus:border-primary transition-colors text-lg shadow-sm"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-background h-12 px-6 border-2 border-border/50 hover:border-primary transition-colors shadow-sm"
            >
              <Filter className="w-5 h-5" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary">
                  {[searchTerm, locationFilter, minRate, maxRate].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2 h-12 px-6 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ubicación</label>
                  <Input
                    placeholder="Distrito o ciudad"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tarifa mínima (PEN)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tarifa máxima (PEN)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {filteredProfessionals.length > 0 ? "Profesionales Disponibles" : "No se encontraron profesionales"}
            </h2>
            {filteredProfessionals.length > 0 && (
              <p className="text-muted-foreground text-lg">
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
              <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Search className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">No se encontraron resultados</h3>
              <p className="text-muted-foreground mb-8 text-lg">Intenta ajustar tus filtros de búsqueda</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="px-8 py-3">
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
    window.location.href = "/dashboard/edit"
  }

  return (
    <Card className="border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <Link href={`/professional/${professional.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={professional.profileImage || "/placeholder.svg"}
              alt={professional.name}
              className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-800">{professional.rating}</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">Disponible</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground leading-tight">{professional.name}</h3>
              <p className="text-primary font-semibold text-lg">{professional.profession}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {professional.description}
            </p>

            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span className="font-medium">{professional.location.district}, {professional.location.city}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="space-y-1">
                <div className="text-lg font-bold text-foreground">
                  {professional.rate.currency} {professional.rate.min}
                  {professional.rate.min !== professional.rate.max && ` - ${professional.rate.max}`}
                </div>
                <div className="text-xs text-muted-foreground">{professional.rate.type}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{professional.reviewsCount} reseñas</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {professional.services.slice(0, 2).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                  {service}
                </Badge>
              ))}
              {professional.services.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{professional.services.length - 2} más
                </Badge>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="sm" className="flex-1 border-primary/20 hover:bg-primary/5 hover:border-primary/40">
                Ver Perfil
              </Button>
              {isOwnProfile ? (
                <Button
                  onClick={handleEditProfile}
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <Button
                  onClick={handleWhatsAppContact}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all"
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

