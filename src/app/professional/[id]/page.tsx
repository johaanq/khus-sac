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
import { ArrowLeft, Star, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, ExternalLink, Edit, Camera, DollarSign, User, MessageCircle, Award, Users, Eye } from "lucide-react"

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
    window.location.href = "/profile"
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

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a inicio
        </Link>

        <div className="flex min-h-screen">
          {/* Left Sidebar Navigation */}
          <div className="w-80 bg-white border-r border-gray-200 p-8 sticky top-0 h-screen overflow-y-auto">
            {/* Profile Image */}
            <div className="relative mb-8">
              <Image
                src={professional.profileImage || "/placeholder.svg"}
                alt={professional.name}
                width={120}
                height={120}
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-soft"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              {isOwnProfile && (
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-2 right-8 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-soft"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2 mb-8">
              <div className="text-sm font-medium text-gray-900 py-2 border-l-2 border-gray-900 pl-4 bg-gray-50">
                sobre mí
              </div>
              <div className="text-sm text-gray-600 hover:text-gray-900 py-2 pl-4 cursor-pointer transition-colors">
                servicios
              </div>
              <div className="text-sm text-gray-600 hover:text-gray-900 py-2 pl-4 cursor-pointer transition-colors">
                galería
              </div>
              <div className="text-sm text-gray-600 hover:text-gray-900 py-2 pl-4 cursor-pointer transition-colors">
                contacto
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="space-y-4 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calificación</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{professional.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Proyectos</span>
                <span className="text-sm font-medium">45+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reseñas</span>
                <span className="text-sm font-medium">{professional.reviewsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vistas</span>
                <span className="text-sm font-medium">{professional.views || 0}</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl mx-auto p-12">
            {/* Header Section */}
            <div className="mb-16">
              <h1 className="text-5xl font-light text-gray-900 mb-4 text-balance">{professional.name}</h1>
              <p className="text-xl text-gray-600 mb-8 font-light">{professional.profession}</p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {professional.location.district}, {professional.location.city}
                  </span>
                </div>
                <div className="text-2xl font-light text-gray-900">
                  {professional.rate.currency} {professional.rate.min}
                  {professional.rate.min !== professional.rate.max && ` - ${professional.rate.max}`}
                  <span className="text-sm text-gray-600 ml-2">{professional.rate.type}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {professional.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700 border-0">
                    {service}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
                {isOwnProfile && (
                  <Button 
                    onClick={handleEditProfile}
                    variant="outline"
                    className="border-gray-200 hover:border-gray-900 hover:bg-gray-50 px-8 py-3 rounded-xl"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>

            {/* About Section */}
            <section className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">Sobre mí</h2>
              <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">{professional.description}</p>
            </section>

            {/* Services Section */}
            <section className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">Servicios</h2>
              <div className="flex flex-wrap gap-2">
                {professional.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700 border-0 px-3 py-1">
                    {service}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">Galería de Trabajos</h2>
              
              {professional.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {professional.gallery.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Trabajo ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-xl shadow-subtle cursor-pointer"
                        onClick={() => {
                          setSelectedImageIndex(index)
                          setShowImageModal(true)
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-soft">
                          <ExternalLink className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay trabajos en la galería</p>
                </div>
              )}
            </section>

            {/* Contact & Location Section */}
            <section className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">Contacto</h2>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Información de contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{professional.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900">{professional.email}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Ubicación</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-gray-900">
                          {professional.location.district}, {professional.location.city}
                        </div>
                        {professional.location.address && (
                          <div className="text-sm text-gray-600">{professional.location.address}</div>
                        )}
                      </div>
                    </div>

                    <div className="h-48 rounded-xl overflow-hidden">
                      <RealMap
                        district={professional.location.district}
                        city={professional.location.city}
                        address={professional.location.address}
                        coordinates={professional.location.coordinates}
                        isEditable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && professional.gallery.length > 0 && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 text-gray-900 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <Image
                  src={professional.gallery[selectedImageIndex]}
                  alt={`Trabajo ${selectedImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                
                {professional.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-gray-900 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 text-gray-900 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="text-center mt-4 text-white">
                <p className="text-sm">
                  {selectedImageIndex + 1} de {professional.gallery.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}