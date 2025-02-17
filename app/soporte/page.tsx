"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Clock, HelpCircle, Send } from "lucide-react"
import { Navigation } from "@/components/Navigation"

export default function Support() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        alert("Su solicitud de soporte ha sido enviada. Nos pondremos en contacto pronto.")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        const data = await response.json()
        alert(`Error al enviar la solicitud: ${data.error}`)
      }
    } catch (error) {
      alert("Hubo un error al enviar la solicitud. Por favor, intente de nuevo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground mb-8">Soporte</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Enviar Solicitud de Soporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Correo Electrónico
                  </label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </form>
            </CardContent>
          </Card>

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
                  arriba, o utilizar el formulario de solicitud de soporte en esta página.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

