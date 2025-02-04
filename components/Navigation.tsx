import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null

  return (
    <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/chat" className="text-xl font-bold">
          Chat Educativo
        </Link>
        <Link href="/soporte" className="hover:underline">
          Soporte
        </Link>
        {userRole === "authority" && (
          <Link href="/ajustes" className="hover:underline">
            Ajustes
          </Link>
        )}
      </div>
      <Button onClick={handleLogout} variant="secondary">
        Cerrar Sesión
      </Button>
    </nav>
  )
}

