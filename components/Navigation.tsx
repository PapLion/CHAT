"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users, Settings, HelpCircle, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

export function Navigation() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  return (
    <nav className="flex items-center space-x-4">
      <Button asChild variant="ghost">
        <Link href="/chat">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </Link>
      </Button>
      {(userRole === "parent" || userRole === "authority") && (
        <Button asChild variant="ghost">
          <Link href="/chat/padres">
            <Users className="mr-2 h-4 w-4" />
            Chat de Padres
          </Link>
        </Button>
      )}
      {userRole === "authority" && (
        <>
          <Button asChild variant="ghost">
            <Link href="/chat/autoridades">
              <Users className="mr-2 h-4 w-4" />
              Chat de Autoridades
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/usuarios">
              <Users className="mr-2 h-4 w-4" />
              Usuarios
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/cursos">
              <BookOpen className="mr-2 h-4 w-4" />
              Cursos
            </Link>
          </Button>
        </>
      )}
      <Button asChild variant="ghost">
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          Ajustes
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/soporte">
          <HelpCircle className="mr-2 h-4 w-4" />
          Soporte
        </Link>
      </Button>
      <Button onClick={handleLogout} variant="destructive">
        Cerrar Sesión
      </Button>
    </nav>
  )
}

