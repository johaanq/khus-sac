"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Camera, Image as ImageIcon, X, Plus } from "lucide-react"

interface PhotoUploadProps {
  profileImage: string
  gallery: string[]
  onProfileImageChange: (url: string) => void
  onGalleryChange: (gallery: string[]) => void
}

export function PhotoUpload({ profileImage, gallery, onProfileImageChange, onGalleryChange }: PhotoUploadProps) {
  const [newGalleryImage, setNewGalleryImage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // En una implementación real, aquí subirías el archivo a un servicio como Cloudinary
      // Por ahora, simulamos la subida creando una URL local
      const url = URL.createObjectURL(file)
      onProfileImageChange(url)
    }
  }

  const addGalleryImage = () => {
    if (newGalleryImage.trim() && !gallery.includes(newGalleryImage.trim())) {
      onGalleryChange([...gallery, newGalleryImage.trim()])
      setNewGalleryImage("")
    }
  }

  const removeGalleryImage = (imageToRemove: string) => {
    onGalleryChange(gallery.filter(image => image !== imageToRemove))
  }

  return (
    <div className="space-y-6">
      {/* Foto Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2 text-primary" />
            Foto Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/25">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="profileImage">URL de la imagen</Label>
                <Input
                  id="profileImage"
                  value={profileImage}
                  onChange={(e) => onProfileImageChange(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Galería */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-primary" />
            Galería de Trabajos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Trabajo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(image)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={newGalleryImage}
              onChange={(e) => setNewGalleryImage(e.target.value)}
              placeholder="URL de imagen para la galería"
              className="bg-background"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
            />
            <Button type="button" onClick={addGalleryImage} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Consejo:</strong> Agrega imágenes de tus mejores trabajos para mostrar tu experiencia y estilo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
