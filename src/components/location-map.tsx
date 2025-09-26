"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from "lucide-react"

interface LocationMapProps {
  district: string
  city: string
  onLocationChange: (district: string, city: string, coordinates?: { lat: number; lng: number }) => void
}

export function LocationMap({ district, city, onLocationChange }: LocationMapProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Simular coordenadas para distritos de Lima
  const limaDistricts = {
    "Miraflores": { lat: -12.1201, lng: -77.0341 },
    "San Isidro": { lat: -12.0956, lng: -77.0301 },
    "Barranco": { lat: -12.1419, lng: -77.0206 },
    "Surco": { lat: -12.1508, lng: -76.9933 },
    "La Molina": { lat: -12.0759, lng: -76.9508 },
    "Pueblo Libre": { lat: -12.0708, lng: -77.0625 },
    "Jesús María": { lat: -12.0833, lng: -77.0500 },
    "Magdalena": { lat: -12.1000, lng: -77.0667 },
    "San Miguel": { lat: -12.0833, lng: -77.0833 },
    "Callao": { lat: -12.0566, lng: -77.1181 }
  }

  useEffect(() => {
    if (district && limaDistricts[district as keyof typeof limaDistricts]) {
      const coords = limaDistricts[district as keyof typeof limaDistricts]
      setSelectedLocation(coords)
      onLocationChange(district, city, coords)
    }
  }, [district, city, onLocationChange])

  const handleSearch = () => {
    const foundDistrict = Object.keys(limaDistricts).find(d => 
      d.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (foundDistrict) {
      const coords = limaDistricts[foundDistrict as keyof typeof limaDistricts]
      setSelectedLocation(coords)
      onLocationChange(foundDistrict, city, coords)
    }
  }

  const handleDistrictSelect = (selectedDistrict: string) => {
    const coords = limaDistricts[selectedDistrict as keyof typeof limaDistricts]
    setSelectedLocation(coords)
    onLocationChange(selectedDistrict, city, coords)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Ubicación en el Mapa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="locationSearch">Buscar distrito</Label>
          <div className="flex gap-2">
            <Input
              id="locationSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: Miraflores, San Isidro..."
              className="bg-background"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selector de distritos */}
        <div className="space-y-2">
          <Label>Distritos de Lima</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(limaDistricts).map((districtName) => (
              <Button
                key={districtName}
                variant={district === districtName ? "default" : "outline"}
                size="sm"
                onClick={() => handleDistrictSelect(districtName)}
                className="justify-start"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {districtName}
              </Button>
            ))}
          </div>
        </div>

        {/* Mapa simulado */}
        <div className="space-y-2">
          <Label>Vista del mapa</Label>
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center relative overflow-hidden">
            {selectedLocation ? (
              <>
                {/* Puntos de referencia simulados */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                
                {/* Ubicación seleccionada */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
                    {district}
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Selecciona un distrito para ver la ubicación</p>
              </div>
            )}
          </div>
        </div>

        {/* Información de ubicación */}
        {selectedLocation && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{district}, {city}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
