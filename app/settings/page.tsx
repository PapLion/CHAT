"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/Navigation"

export default function Settings() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [announcement, setAnnouncement] = useState("")
  const [isAuthority, setIsAuthority] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    setIsAuthority(userRole === "authority")
    // Fetch user data here
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar los ajustes del usuario
    toast({
      title: "Ajustes actualizados",
      description: "Tus ajustes han sido actualizados correctamente.",
    })
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: announcement }),
      })

      if (res.ok) {
        setAnnouncement("")
        toast({
          title: "Anuncio enviado",
          description: "El anuncio ha sido enviado a todos los chats.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar el anuncio",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending announcement:", error)
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ajustes</h1>
          <Navigation />
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <Button type="submit">Guardar cambios</Button>
        </form>

        {isAuthority && (
          <form onSubmit={handleAnnouncementSubmit} className="mt-8 space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold">Enviar anuncio global</h2>
            <div>
              <Label htmlFor="announcement">Contenido del anuncio</Label>
              <Textarea
                id="announcement"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Escribe aquí tu anuncio..."
                rows={4}
              />
            </div>
            <Button type="submit">Enviar anuncio</Button>
          </form>
        )}
      </main>
    </div>
  )
}

