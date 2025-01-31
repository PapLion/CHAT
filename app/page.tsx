import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Chat Educativo</h1>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

