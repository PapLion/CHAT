"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
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

  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <nav className="bg-[#4a0000] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R-removebg-preview-AjSoB6P5fWC8jC4xjI9kmnF4dRjFjw.png"
              alt="EFA Logo"
              width={40}
              height={40}
              className="rounded-sm"
            />
            <Link href="/chat" className="text-xl font-bold">
              Chat Educativo
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/chat" className="hover:text-gray-300">
              Chat
            </Link>
            <Link href="/soporte" className="hover:text-gray-300">
              Soporte
            </Link>
            {userRole === "authority" && (
              <Link href="/ajustes" className="hover:text-gray-300">
                Ajustes
              </Link>
            )}
          </div>
        </div>
        <Button onClick={handleLogout} variant="secondary">
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  )
}

