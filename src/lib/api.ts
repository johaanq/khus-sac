// Fake API service to simulate backend calls
const API_BASE = "/api"

export interface Professional {
  id: number
  name: string
  profession: string
  email: string
  phone: string
  password?: string
  profileImage: string
  gallery: string[]
  description: string
  services: string[]
  location: {
    district: string
    city: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  rate: {
    min: number
    max: number
    currency: string
    type: string
  }
  rating: number
  reviewsCount: number
  isActive: boolean
}

export interface AuthUser {
  id: number
  name: string
  email: string
}

// Simulate API calls with local storage and db.json data
class ApiService {
  private async loadDb() {
    try {
      const response = await fetch("/db.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error loading db.json:", error)
      return {
        professionals: [
          {
            id: 1,
            name: "María González",
            profession: "Diseñadora Gráfica",
            email: "maria@email.com",
            phone: "+51987654321",
            password: "123456",
            profileImage: "/placeholder.svg?height=300&width=300",
            gallery: [
              "/placeholder.svg?height=400&width=600",
              "/placeholder.svg?height=400&width=600",
              "/placeholder.svg?height=400&width=600",
            ],
            description:
              "Especialista en diseño gráfico y branding con más de 5 años de experiencia. Creo identidades visuales únicas que conectan con tu audiencia y fortalecen tu marca.",
            services: ["Diseño de logotipos", "Identidad corporativa", "Material publicitario", "Diseño web"],
            location: {
              district: "Miraflores",
              city: "Lima",
              coordinates: {
                lat: -12.1191,
                lng: -77.0292,
              },
            },
            rate: {
              min: 150,
              max: 500,
              currency: "PEN",
              type: "por proyecto",
            },
            rating: 4.8,
            reviewsCount: 24,
            isActive: true,
          },
          {
            id: 2,
            name: "Carlos Mendoza",
            profession: "Desarrollador Web",
            email: "carlos@email.com",
            phone: "+51987654322",
            password: "123456",
            profileImage: "/placeholder.svg?height=300&width=300",
            gallery: [
              "/placeholder.svg?height=400&width=600",
              "/placeholder.svg?height=400&width=600",
              "/placeholder.svg?height=400&width=600",
            ],
            description:
              "Desarrollador full-stack especializado en React y Node.js. Transformo ideas en aplicaciones web modernas y funcionales que impulsan tu negocio.",
            services: ["Desarrollo web", "Aplicaciones móviles", "E-commerce", "Mantenimiento web"],
            location: {
              district: "San Isidro",
              city: "Lima",
              coordinates: {
                lat: -12.0931,
                lng: -77.0465,
              },
            },
            rate: {
              min: 80,
              max: 120,
              currency: "PEN",
              type: "por hora",
            },
            rating: 4.9,
            reviewsCount: 31,
            isActive: true,
          },
        ],
        auth: { currentUser: null },
      }
    }
  }

  async getProfessionals(filters?: {
    search?: string
    location?: string
    minRate?: number
    maxRate?: number
  }): Promise<Professional[]> {
    const db = await this.loadDb()
    let professionals = db.professionals.filter((p: Professional) => p.isActive)

    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase()
        professionals = professionals.filter(
          (p: Professional) =>
            p.name.toLowerCase().includes(search) ||
            p.profession.toLowerCase().includes(search) ||
            p.services.some((s) => s.toLowerCase().includes(search)),
        )
      }

      if (filters.location) {
        professionals = professionals.filter(
          (p: Professional) =>
            p.location.district.toLowerCase().includes(filters.location!.toLowerCase()) ||
            p.location.city.toLowerCase().includes(filters.location!.toLowerCase()),
        )
      }

      if (filters.minRate !== undefined) {
        professionals = professionals.filter((p: Professional) => p.rate.min >= filters.minRate!)
      }

      if (filters.maxRate !== undefined) {
        professionals = professionals.filter((p: Professional) => p.rate.max <= filters.maxRate!)
      }
    }

    return professionals
  }

  async getProfessional(id: number): Promise<Professional | null> {
    const db = await this.loadDb()
    return db.professionals.find((p: Professional) => p.id === id) || null
  }

  async login(email: string, password: string): Promise<AuthUser | null> {
    const db = await this.loadDb()
    const professional = db.professionals.find((p: Professional) => p.email === email && p.password === password)

    if (professional) {
      const user = {
        id: professional.id,
        name: professional.name,
        email: professional.email,
      }
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }

    return null
  }

  async register(userData: {
    name: string
    email: string
    password: string
    profession: string
    phone: string
  }): Promise<AuthUser | null> {
    const db = await this.loadDb()

    // Check if email already exists
    const existingUser = db.professionals.find((p: Professional) => p.email === userData.email)
    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    // Create new professional (in real app, this would be saved to backend)
    const newProfessional: Professional = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profession: userData.profession,
      phone: userData.phone,
      profileImage: "/professional-person.png",
      gallery: [],
      description: "",
      services: [],
      location: {
        district: "",
        city: "Lima",
        address: "",
        coordinates: { lat: -12.0464, lng: -77.0428 },
      },
      rate: {
        min: 0,
        max: 0,
        currency: "PEN",
        type: "por hora",
      },
      rating: 0,
      reviewsCount: 0,
      isActive: true,
    }

    const user = {
      id: newProfessional.id,
      name: newProfessional.name,
      email: newProfessional.email,
    }

    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  }

  logout(): void {
    localStorage.removeItem("currentUser")
  }
}

export const api = new ApiService()
