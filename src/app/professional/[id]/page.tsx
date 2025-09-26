"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, type Professional } from "@/lib/api"
import { Header } from "@/components/header"
import { RealMap } from "@/components/real-map"
import { ArrowLeft, Star, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, ExternalLink, Edit, Camera, DollarSign, User, MessageCircle } from "lucide-react"

export default function ProfessionalProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    if (params.id) {
      loadProfessional(Number.parseInt(params.id as string))
    }
    
    // Cargar usuario actual
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [params.id])

  const loadProfessional = async (id: number) => {
    try {
      const data = await api.getProfessional(id)
      if (data) {
        setProfessional(data)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error loading professional:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const isOwnProfile = currentUser && professional && currentUser.name === professional.name

  const handleWhatsAppContact = () => {
    if (professional) {
      const message = encodeURIComponent(
        `Hola ${professional.name}, vi tu perfil en KHUS SAC y me interesa contactarte para un proyecto.`,
      )
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${professional.phone.replace(/\D/g, "")}&text=${message}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleEditProfile = () => {
    window.location.href = "/dashboard/edit"
  }

  const nextImage = () => {
    if (professional) {
      setSelectedImageIndex((prev) => (prev + 1) % professional.gallery.length)
    }
  }

  const prevImage = () => {
    if (professional) {
      setSelectedImageIndex((prev) => (prev - 1 + professional.gallery.length) % professional.gallery.length)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!professional) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a profesionales
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative">
                    <Image
                      src={professional.profileImage || "/placeholder.svg"}
                      alt={professional.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-lg object-cover mx-auto sm:mx-0"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    {isOwnProfile && (
                      <button 
                        onClick={handleEditProfile}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-foreground">{professional.name}</h1>
                      {isOwnProfile && (
                        <Button variant="outline" size="sm" onClick={handleEditProfile}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      )}
                    </div>
                    <p className="text-xl text-primary font-medium mb-3">{professional.profession}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">{professional.rating}</span>
                        <span className="text-muted-foreground ml-1">({professional.reviewsCount} reseñas)</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {professional.location.district}, {professional.location.city}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {professional.services.map((service, index) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Sobre mí
                </CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{professional.description}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Servicios Ofrecidos</CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professional.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  Galería de Trabajos
                </CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {professional.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {professional.gallery.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Trabajo ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No hay trabajos en la galería</p>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Ubicación en el Mapa
                </CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <RealMap
                  district={professional.location.district}
                  city={professional.location.city}
                  address={professional.location.address}
                  coordinates={professional.location.coordinates}
                  isEditable={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Información de Contacto
                </CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{professional.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{professional.email || 'email@ejemplo.com'}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ubicación</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{professional.location.district}, {professional.location.city}</span>
                    {professional.location.address && (
                      <div className="text-xs text-muted-foreground">{professional.location.address}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary" />
                  Tarifas
                </CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {professional.rate.currency} {professional.rate.min}
                    {professional.rate.min !== professional.rate.max && ` - ${professional.rate.max}`}
                  </div>
                  <div className="text-sm text-muted-foreground">{professional.rate.type}</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Button */}
            <Card className="border-border">
              <CardContent className="p-6">
                {isOwnProfile ? (
                  <Button onClick={handleEditProfile} className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar por WhatsApp
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Calificación promedio</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{professional.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reseñas</span>
                  <span className="font-medium">{professional.reviewsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Proyectos completados</span>
                  <span className="font-medium">{professional.reviewsCount * 2}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && professional.gallery.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <Image
              src={professional.gallery[selectedImageIndex] || "/placeholder.svg"}
              alt={`Trabajo ${selectedImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />

            {professional.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} de {professional.gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
