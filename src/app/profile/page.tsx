"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { RealMap } from "@/components/real-map"
import { ArrowLeft, Edit, MapPin, Star, MessageCircle, Camera, DollarSign, User, Phone, Mail, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, type Professional } from "@/lib/api"

export default function ProfilePage() {
  const [, setUser] = useState<{ name: string; email: string } | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [addressInput, setAddressInput] = useState("")
  const [searchResults, setSearchResults] = useState<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, unknown>>({})

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
        const userProfile = professionals.find(p => p.name === currentUser.name)
        
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
            profileImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            rating: 4.5,
            reviewsCount: 0,
            location: { 
              district: "Lima", 
              city: "Lima",
              address: "Av. Principal 123, Lima",
              coordinates: { lat: -12.0464, lng: -77.0428 }
            },
            rate: { currency: "S/", min: 100, max: 500, type: "por proyecto" },
            services: ["Servicios profesionales"],
            phone: "+51999999999",
            gallery: [],
            isActive: true
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
        `Hola ${professional.name}, vi tu perfil en KHUS SAC y me interesa contactarte para un proyecto.`
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
              lng: -77.0428 + (Math.random() - 0.5) * 0.1
            }
          }
        },
        {
          formatted_address: `${query}, Miraflores, Lima, Perú`,
          geometry: {
            location: {
              lat: -12.1191 + (Math.random() - 0.5) * 0.05,
              lng: -77.0292 + (Math.random() - 0.5) * 0.05
            }
          }
        }
      ]
      
      setSearchResults(mockResults)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Error searching address:", error)
    }
  }

  const selectAddress = (result: { formatted_address: string; geometry: { location: { lat: number; lng: number } } }) => {
    const address = result.formatted_address
    const coords = result.geometry.location
    
    setAddressInput(address)
    setShowSearchResults(false)
    
    if (professional) {
      const updatedProfessional = {
        ...professional,
        location: {
          district: address.split(',')[1]?.trim() || "Lima",
          city: "Lima",
          address: address,
          coordinates: coords
        }
      }
      setProfessional(updatedProfessional)
    }
  }

  const handleSaveProfile = () => {
    // Aquí guardarías los cambios en la API
    setIsEditing(false)
    setEditingSection(null)
    setEditData({})
    console.log("Profile saved:", professional)
  }

  const handleEditSection = (section: string) => {
    setEditingSection(section)
    setIsEditing(true)
    
    // Inicializar datos de edición según la sección
    switch (section) {
      case 'description':
        setEditData({ description: professional?.description || '' })
        break
      case 'services':
        setEditData({ services: professional?.services || [] })
        break
      case 'gallery':
        setEditData({ gallery: professional?.gallery || [] })
        break
      case 'pricing':
        setEditData({ rate: professional?.rate || { min: 0, max: 0, currency: 'S/', type: 'por proyecto' } })
        break
      case 'contact':
        setEditData({ 
          phone: professional?.phone || '', 
          email: professional?.email || '' 
        })
        break
      case 'location':
        setAddressInput(professional?.location.address || `${professional?.location.district || ''}, ${professional?.location.city || ''}`)
        break
    }
  }

  const handleSaveSection = (section: string) => {
    if (!professional) return

    const updatedProfessional = { ...professional }

    switch (section) {
      case 'description':
        updatedProfessional.description = editData.description as string
        break
      case 'services':
        updatedProfessional.services = editData.services as string[]
        break
      case 'gallery':
        updatedProfessional.gallery = editData.gallery as string[]
        break
      case 'pricing':
        updatedProfessional.rate = editData.rate as { min: number; max: number; currency: string; type: string }
        break
      case 'contact':
        updatedProfessional.phone = editData.phone as string
        updatedProfessional.email = editData.email as string
        break
      case 'location':
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil Público</h1>
          </div>
        </div>

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
                    />
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{professional.name}</h1>
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('description')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {editingSection === 'description' ? (
                  <div className="space-y-3">
                    <textarea
                      value={(editData.description as string) || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Describe tus servicios y experiencia..."
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSection('description')}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{professional.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Servicios Ofrecidos</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('services')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {editingSection === 'services' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {((editData.services as string[]) || []).map((service: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => {
                              const newServices = [...((editData.services as string[]) || [])]
                              newServices[index] = e.target.value
                              setEditData({ ...editData, services: newServices })
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const newServices = ((editData.services as string[]) || []).filter((_: string, i: number) => i !== index)
                              setEditData({ ...editData, services: newServices })
                            }}
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
                          services: [...((editData.services as string[]) || []), ''] 
                        })
                      }}
                    >
                      + Agregar Servicio
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSection('services')}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {professional.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  Galería de Trabajos
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('gallery')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {editingSection === 'gallery' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {((editData.gallery as string[]) || []).map((image: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => {
                              const newGallery = [...((editData.gallery as string[]) || [])]
                              newGallery[index] = e.target.value
                              setEditData({ ...editData, gallery: newGallery })
                            }}
                            placeholder="URL de la imagen"
                            className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const newGallery = ((editData.gallery as string[]) || []).filter((_: string, i: number) => i !== index)
                              setEditData({ ...editData, gallery: newGallery })
                            }}
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
                          gallery: [...((editData.gallery as string[]) || []), ''] 
                        })
                      }}
                    >
                      + Agregar Imagen
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSection('gallery')}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
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
                            <Edit className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('contact')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingSection === 'contact' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Teléfono</label>
                      <input
                        type="tel"
                        value={(editData.phone as string) || ''}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="+51999999999"
                        className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={(editData.email as string) || ''}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="email@ejemplo.com"
                        className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSection('contact')}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{professional.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{professional.email || 'maria@email.com'}</span>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ubicación</span>
                    {editingSection === 'location' && (
                      <Button variant="ghost" size="sm" onClick={() => setAddressInput(professional.location.district + ", " + professional.location.city)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {editingSection === 'location' ? (
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={addressInput}
                          onChange={(e) => {
                            setAddressInput(e.target.value)
                            searchAddress(e.target.value)
                          }}
                          placeholder="Buscar dirección..."
                          className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </div>
                      {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              onClick={() => selectAddress(result)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0"
                            >
                              {result.formatted_address}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => {
                          setEditingSection(null)
                          setAddressInput("")
                          setShowSearchResults(false)
                        }}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-sm font-medium">{professional.location.district}, {professional.location.city}</span>
                      {professional.location.address && (
                        <div className="text-xs text-muted-foreground">{professional.location.address}</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mapa Real */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Ubicación en el Mapa
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('location')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <RealMap
                  district={professional.location.district}
                  city={professional.location.city}
                  address={professional.location.address}
                  coordinates={professional.location.coordinates}
                  isEditable={editingSection === 'location'}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary" />
                  Tarifas
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditSection('pricing')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {editingSection === 'pricing' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Precio Mínimo</label>
                        <input
                          type="number"
                          value={(editData.rate as { min: number; max: number; currency: string; type: string })?.min || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            rate: { ...(editData.rate as { min: number; max: number; currency: string; type: string }), min: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Precio Máximo</label>
                        <input
                          type="number"
                          value={(editData.rate as { min: number; max: number; currency: string; type: string })?.max || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            rate: { ...(editData.rate as { min: number; max: number; currency: string; type: string }), max: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Tarifa</label>
                      <select
                          value={(editData.rate as { min: number; max: number; currency: string; type: string })?.type || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            rate: { ...(editData.rate as { min: number; max: number; currency: string; type: string }), type: e.target.value }
                          })}
                        className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="por hora">Por Hora</option>
                        <option value="por proyecto">Por Proyecto</option>
                        <option value="por día">Por Día</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSection('pricing')}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {professional.rate.currency} {professional.rate.min}
                      {professional.rate.min !== professional.rate.max && ` - ${professional.rate.max}`}
                    </div>
                    <div className="text-sm text-muted-foreground">{professional.rate.type}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Button */}
            <Card className="border-border">
              <CardContent className="p-6">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
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
                  <span className="font-medium">45+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
