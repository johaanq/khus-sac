"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api, type AuthUser } from "@/lib/api"
import { User, LogOut, Menu, X } from "lucide-react"

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setUser(api.getCurrentUser())
  }, [])

  const handleLogout = () => {
    api.logout()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="border-b border-border bg-background/98 backdrop-blur-sm sticky top-0 z-50 shadow-professional">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors tracking-tight">
            KHUS SAC
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
             {user ? (
               <div className="flex items-center space-x-4">
                 <Link href="/profile" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                   <User className="w-4 h-4" />
                   <span className="font-medium">{user.name}</span>
                   <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                     <User className="w-3 h-3 text-primary" />
                   </div>
                 </Link>
                 <Button variant="ghost" size="sm" onClick={handleLogout}>
                   <LogOut className="w-4 h-4 mr-2" />
                   Salir
                 </Button>
               </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-border bg-background/98">
            <nav className="flex flex-col space-y-3">
               {user ? (
                 <>
                   <Link
                     href="/profile"
                     className="text-muted-foreground hover:text-foreground transition-colors"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Mi Perfil
                   </Link>
                   <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                     <User className="w-4 h-4" />
                     <span>{user.name}</span>
                   </div>
                   <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                     <LogOut className="w-4 h-4 mr-2" />
                     Salir
                   </Button>
                 </>
               ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">Registrarse</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
