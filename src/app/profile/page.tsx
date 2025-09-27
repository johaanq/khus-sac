"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { RealMap } from "@/components/real-map"
import { ArrowLeft, Edit, MapPin, Star, MessageCircle, Phone, Mail, Camera, DollarSign, User, Award, Users, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, type Professional } from "@/lib/api"

export default function ProfilePage() {
  const [, setUser] = useState<{ name: string; email: string } | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, unknown>>({})
  const [addressInput, setAddressInput] = useState("")
  const [searchResults, setSearchResults] = useState<
    { formatted_address: string; geometry: { location: { lat: number; lng: number } } }[]
  >([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)

      // Cargar usuario del localStorage
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const currentUser = JSON.parse(userData)
        setUser(currentUser)

        // Buscar el perfil del usuario actual en la lista de profesionales
        const professionals = await api.getProfessionals()
        const userProfile = professionals.find((p) => p.name === currentUser.name)

        if (userProfile) {
          setProfessional(userProfile)
        } else {
          // Si no se encuentra, crear un perfil básico
          const defaultProfile: Professional = {
            id: 999,
            name: currentUser.name,
            profession: "Profesional",
            email: currentUser.email || "email@ejemplo.com",
            description: "Perfil profesional en KHUS SAC",
            profileImage:
              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            rating: 4.5,
            reviewsCount: 0,
            location: {
              district: "Lima",
              city: "Lima",
              address: "Av. Principal 123, Lima",
              coordinates: { lat: -12.0464, lng: -77.0428 },
            },
            rate: { currency: "S/", min: 100, max: 500, type: "por proyecto" },
            services: ["Servicios profesionales"],
            phone: "+51999999999",
            gallery: [],
            isActive: true,
          }
          setProfessional(defaultProfile)
        }
      } else {
        // Si no hay usuario logueado, redirigir al login
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppContact = () => {
    if (professional) {
      const message = encodeURIComponent(
        `Hola ${professional.name}, vi tu perfil en KHUS SAC y me interesa contactarte para un proyecto.`,
      )
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${professional.phone.replace(/\D/g, "")}&text=${message}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      // Simular búsqueda de direcciones (en una app real usarías Google Places API)
      const mockResults = [
        {
          formatted_address: `${query}, Lima, Perú`,
          geometry: {
            location: {
              lat: -12.0464 + (Math.random() - 0.5) * 0.1,
              lng: -77.0428 + (Math.random() - 0.5) * 0.1,
            },
          },
        },
        {
          formatted_address: `${query}, Miraflores, Lima, Perú`,
          geometry: {
            location: {
              lat: -12.1191 + (Math.random() - 0.5) * 0.05,
              lng: -77.0292 + (Math.random() - 0.5) * 0.05,
            },
          },
        },
      ]

      setSearchResults(mockResults)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Error searching address:", error)
    }
  }

  const selectAddress = (result: {
    formatted_address: string
    geometry: { location: { lat: number; lng: number } }
  }) => {
    const address = result.formatted_address
    const coords = result.geometry.location

    setAddressInput(address)
    setShowSearchResults(false)

    if (professional) {
      const updatedProfessional = {
        ...professional,
        location: {
          district: address.split(",")[1]?.trim() || "Lima",
          city: "Lima",
          address: address,
          coordinates: coords,
        },
      }
      setProfessional(updatedProfessional)
    }
  }

  const handleEditSection = (section: string) => {
    setEditingSection(section)

    // Inicializar datos de edición según la sección
    switch (section) {
      case "description":
        setEditData({ description: professional?.description || "" })
        break
      case "services":
        setEditData({ services: professional?.services || [] })
        break
      case "gallery":
        setEditData({ gallery: professional?.gallery || [] })
        break
      case "pricing":
        setEditData({ rate: professional?.rate || { min: 0, max: 0, currency: "S/", type: "por proyecto" } })
        break
      case "contact":
        setEditData({
          phone: professional?.phone || "",
          email: professional?.email || "",
        })
        break
      case "location":
        setAddressInput(
          professional?.location.address ||
            `${professional?.location.district || ""}, ${professional?.location.city || ""}`,
        )
        break
    }
  }

  const handleSaveSection = (section: string) => {
    if (!professional) return

    const updatedProfessional = { ...professional }

    switch (section) {
      case "description":
        updatedProfessional.description = editData.description as string
        break
      case "services":
        updatedProfessional.services = editData.services as string[]
        break
      case "gallery":
        updatedProfessional.gallery = editData.gallery as string[]
        break
      case "pricing":
        updatedProfessional.rate = editData.rate as { min: number; max: number; currency: string; type: string }
        break
      case "contact":
        updatedProfessional.phone = editData.phone as string
        updatedProfessional.email = editData.email as string
        break
      case "location":
        // La ubicación ya se actualiza en selectAddress
        break
    }

    setProfessional(updatedProfessional)
    setEditingSection(null)
    setEditData({})
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditData({})
    setAddressInput("")
    setShowSearchResults(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Perfil no encontrado</h1>
            <p className="text-muted-foreground mb-6">No se pudo cargar la información del perfil.</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Mi Perfil Público</h1>
              <p className="text-gray-600">Gestiona tu presencia profesional</p>
            </div>
          </div>
        </div>

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
              />
              <button 
                onClick={() => handleEditSection('profile')}
                className="absolute bottom-2 right-8 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-soft"
              >
                <Edit className="w-4 h-4" />
              </button>
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

              <Button onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>

            {/* About Section */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-gray-900">Sobre mí</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection("description")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {editingSection === "description" ? (
                <div className="space-y-4">
                  <textarea
                    value={(editData.description as string) || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Describe tus servicios y experiencia..."
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[120px] resize-none transition-colors"
                  />
                  <div className="flex gap-3">
                    <Button size="sm" onClick={() => handleSaveSection("description")} className="bg-gray-900 hover:bg-gray-800">
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-gray-200 hover:border-gray-900">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">{professional.description}</p>
              )}
            </section>

            {/* Services Section */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-gray-900">Servicios</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection("services")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {editingSection === "services" ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {((editData.services as string[]) || []).map((service: string, index: number) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => {
                            const newServices = [...((editData.services as string[]) || [])]
                            newServices[index] = e.target.value
                            setEditData({ ...editData, services: newServices })
                          }}
                          className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newServices = ((editData.services as string[]) || []).filter(
                              (_: string, i: number) => i !== index,
                            )
                            setEditData({ ...editData, services: newServices })
                          }}
                          className="border-gray-200 hover:border-gray-900"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditData({
                        ...editData,
                        services: [...((editData.services as string[]) || []), ""],
                      })
                    }}
                    className="border-gray-200 hover:border-gray-900"
                  >
                    + Agregar Servicio
                  </Button>
                  <div className="flex gap-3">
                    <Button size="sm" onClick={() => handleSaveSection("services")} className="bg-gray-900 hover:bg-gray-800">
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-gray-200 hover:border-gray-900">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {professional.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-sm font-normal bg-gray-100 text-gray-700 border-0 px-3 py-1">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}
            </section>

            {/* Gallery Section */}
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-gray-900">Galería de Trabajos</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection("gallery")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {editingSection === "gallery" ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {((editData.gallery as string[]) || []).map((image: string, index: number) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => {
                            const newGallery = [...((editData.gallery as string[]) || [])]
                            newGallery[index] = e.target.value
                            setEditData({ ...editData, gallery: newGallery })
                          }}
                          placeholder="URL de la imagen"
                          className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newGallery = ((editData.gallery as string[]) || []).filter(
                              (_: string, i: number) => i !== index,
                            )
                            setEditData({ ...editData, gallery: newGallery })
                          }}
                          className="border-gray-200 hover:border-gray-900"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditData({
                        ...editData,
                        gallery: [...((editData.gallery as string[]) || []), ""],
                      })
                    }}
                    className="border-gray-200 hover:border-gray-900"
                  >
                    + Agregar Imagen
                  </Button>
                  <div className="flex gap-3">
                    <Button size="sm" onClick={() => handleSaveSection("gallery")} className="bg-gray-900 hover:bg-gray-800">
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-gray-200 hover:border-gray-900">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {professional.gallery.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Trabajo ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-xl shadow-subtle"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-soft">
                          <Edit className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Contact & Location Section */}
            <section className="mb-20">
              <h2 className="text-2xl font-light text-gray-900 mb-8">Contacto</h2>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Información de contacto</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection("contact")}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {editingSection === "contact" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                          type="tel"
                          value={(editData.phone as string) || ""}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          placeholder="+51999999999"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={(editData.email as string) || ""}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          placeholder="email@ejemplo.com"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveSection("contact")} className="bg-gray-900 hover:bg-gray-800">
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-gray-200 hover:border-gray-900">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Ubicación</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection("location")}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

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
                        isEditable={editingSection === "location"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}