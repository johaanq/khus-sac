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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="font-light text-2xl text-gray-900 hover:text-gray-700 transition-colors">
            KHUS SAC
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
             {user ? (
               <div className="flex items-center space-x-6">
                 <Link href="/profile" className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 transition-colors group">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                     <User className="w-4 h-4 text-gray-600" />
                   </div>
                   <span className="font-medium">{user.name}</span>
                 </Link>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleLogout}
                   className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                 >
                   <LogOut className="w-4 h-4 mr-2" />
                   Salir
                 </Button>
               </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
               {user ? (
                 <>
                   <Link
                     href="/profile"
                     className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors py-2"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                       <User className="w-4 h-4 text-gray-600" />
                     </div>
                     <span className="font-medium">{user.name}</span>
                   </Link>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={handleLogout} 
                     className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                   >
                     <LogOut className="w-4 h-4 mr-2" />
                     Salir
                   </Button>
                 </>
               ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gray-900 hover:bg-gray-800 text-white">
                      Registrarse
                    </Button>
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
