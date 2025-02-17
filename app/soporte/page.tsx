"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Clock, HelpCircle } from "lucide-react"
import { Navigation } from "@/components/Navigation"

export default function Support() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground mb-8">Soporte</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>soporte@eloyalfaro.edu.ec</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>(04) 234-5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Lunes a Viernes, 8:00 AM - 4:00 PM</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Preguntas Frecuentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">¿Cómo puedo cambiar mi contraseña?</h3>
                <p className="text-muted-foreground">
                  Para cambiar tu contraseña, ve a Configuración y selecciona la opción "Cambiar contraseña".
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">¿Qué hago si olvidé mi contraseña?</h3>
                <p className="text-muted-foreground">
                  En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">¿Cómo puedo reportar un problema?</h3>
                <p className="text-muted-foreground">
                  Puedes contactar al soporte técnico a través del correo electrónico o número telefónico proporcionado
                  arriba.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

