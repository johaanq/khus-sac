"use client"

import { useEffect, useRef } from "react"
import { MapPin, Navigation } from "lucide-react"
import type L from "leaflet"

interface RealMapProps {
  district: string
  city: string
  address?: string
  coordinates?: { lat: number; lng: number }
  onLocationChange?: (district: string, city: string, address: string, coordinates: { lat: number; lng: number }) => void
  isEditable?: boolean
}

export function RealMap({ district, city, address, coordinates, onLocationChange, isEditable = false }: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  // Coordenadas para distritos de Lima
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
    "Callao": { lat: -12.0566, lng: -77.1181 },
    "Lince": { lat: -12.0833, lng: -77.0333 },
    "Breña": { lat: -12.0667, lng: -77.0500 },
    "La Victoria": { lat: -12.0667, lng: -77.0167 },
    "Rimac": { lat: -12.0333, lng: -77.0167 },
    "Los Olivos": { lat: -11.9833, lng: -77.0667 },
    "San Martín de Porres": { lat: -12.0000, lng: -77.0833 },
    "Independencia": { lat: -11.9833, lng: -77.0500 },
    "Comas": { lat: -11.9500, lng: -77.0667 },
    "Carabayllo": { lat: -11.9167, lng: -77.0500 },
    "Santa Rosa": { lat: -11.8833, lng: -77.0333 }
  }

  const currentCoords = coordinates || (district && limaDistricts[district as keyof typeof limaDistricts]) || { lat: -12.0464, lng: -77.0428 }

  useEffect(() => {
    if (mapRef.current && typeof window !== 'undefined') {
      // Importar Leaflet dinámicamente
      import('leaflet').then((L) => {
        // Limpiar mapa anterior
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        // Crear mapa
        const map = L.default.map(mapRef.current!, {
          center: [currentCoords.lat, currentCoords.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        })

        // Agregar capa de tiles moderna
        L.default.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map)

        // Crear icono personalizado moderno
        const customIcon = L.default.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-size: 18px;
                font-weight: bold;
              ">📍</div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        })

        // Agregar marcador
        const marker = L.default.marker([currentCoords.lat, currentCoords.lng], { icon: customIcon })
          .addTo(map)

        // Crear popup con información
        const popupContent = `
          <div style="padding: 12px; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
              "></div>
              <strong style="color: #333; font-size: 14px;">${district}</strong>
            </div>
            <div style="color: #666; font-size: 12px; margin-bottom: 4px;">${city}, Perú</div>
            ${address ? `<div style="color: #888; font-size: 11px; margin-bottom: 8px;">${address}</div>` : ''}
            <div style="
              background: #f8f9fa;
              padding: 6px 8px;
              border-radius: 4px;
              font-size: 10px;
              color: #666;
              font-family: monospace;
            ">
              ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}
            </div>
            <div style="margin-top: 8px;">
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || `${district}, ${city}`)}" 
                 target="_blank" 
                 style="
                   display: inline-flex;
                   align-items: center;
                   gap: 4px;
                   background: #667eea;
                   color: white;
                   padding: 4px 8px;
                   border-radius: 4px;
                   text-decoration: none;
                   font-size: 11px;
                   font-weight: 500;
                 ">
                <span>🗺️</span>
                Ver en Google Maps
              </a>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)

        // Si es editable, permitir hacer click en el mapa para cambiar ubicación
        if (isEditable) {
          map.on('click', (e) => {
            const { lat, lng } = e.latlng
            marker.setLatLng([lat, lng])
            map.setView([lat, lng], map.getZoom())
            
            if (onLocationChange) {
              // Generar dirección aproximada basada en coordenadas
              const newAddress = `${district}, ${city}`
              onLocationChange(district, city, newAddress, { lat, lng })
            }
          })
        }

        mapInstanceRef.current = map
      }).catch((error) => {
        console.error('Error loading Leaflet:', error)
        // Fallback a diseño simple si Leaflet no carga
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-align: center;
              padding: 20px;
              border-radius: 12px;
            ">
              <div>
                <div style="font-size: 24px; margin-bottom: 8px;">📍</div>
                <div style="font-weight: 600; margin-bottom: 4px;">${district}</div>
                <div style="font-size: 14px; opacity: 0.9;">${city}, Perú</div>
                ${address ? `<div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${address}</div>` : ''}
              </div>
            </div>
          `
        }
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [currentCoords.lat, currentCoords.lng, district, city, address, isEditable, onLocationChange])

  const handleDistrictSelect = (selectedDistrict: string) => {
    const coords = limaDistricts[selectedDistrict as keyof typeof limaDistricts]
    if (coords && onLocationChange) {
      // Generar una dirección de ejemplo para el distrito seleccionado
      const sampleAddresses = {
        "Miraflores": "Av. Larco 1234, Miraflores",
        "San Isidro": "Av. Javier Prado Este 456, San Isidro",
        "Barranco": "Jr. Pedro de Osma 789, Barranco",
        "Surco": "Av. El Derby 321, Surco",
        "La Molina": "Av. Raúl Ferrero 654, La Molina"
      }
      const newAddress = sampleAddresses[selectedDistrict as keyof typeof sampleAddresses] || `${selectedDistrict}, Lima`
      onLocationChange(selectedDistrict, city, newAddress, coords)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mapa real con Leaflet */}
      <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg border border-border/50">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>

      {/* Selector de distritos (solo si es editable) */}
      {isEditable && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Seleccionar distrito</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(limaDistricts).map((districtName) => (
              <button
                key={districtName}
                onClick={() => handleDistrictSelect(districtName)}
                className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                  district === districtName
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-background border-border hover:bg-muted hover:border-primary/50'
                }`}
              >
                {districtName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{district}, {city}</span>
        </div>
        {address && (
          <div className="text-xs text-muted-foreground pl-6">
            {address}
          </div>
        )}
        <div className="text-xs text-muted-foreground pl-6">
          {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
        </div>
      </div>
    </div>
  )
}
