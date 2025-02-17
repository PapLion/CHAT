"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, MessageSquare } from "lucide-react"
import { Navigation } from "@/components/Navigation"

export default function Ajustes() {
  const [chatAbierto, setChatAbierto] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "authority") {
      router.push("/chat")
      return
    }

    fetchChatStatus()
  }, [router])

  const fetchChatStatus = async () => {
    try {
      const res = await fetch("/api/chat-status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setChatAbierto(data.chatAbierto)
      }
    } catch (error) {
      console.error("Error fetching chat status:", error)
    }
  }

  const toggleChatStatus = async () => {
    try {
      const res = await fetch("/api/chat-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ chatAbierto: !chatAbierto }),
      })

      if (res.ok) {
        setChatAbierto(!chatAbierto)
        toast({
          title: "Estado del chat actualizado",
          description: chatAbierto ? "El chat ha sido cerrado" : "El chat ha sido abierto",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del chat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating chat status:", error)
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Ajustes del Sistema</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Control del Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="chat-status" className="text-base">
                    Estado del Chat
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {chatAbierto
                      ? "El chat está abierto para todos los usuarios"
                      : "El chat está cerrado para todos los usuarios"}
                  </p>
                </div>
                <Switch id="chat-status" checked={chatAbierto} onCheckedChange={toggleChatStatus} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Institución</h3>
                  <p className="text-sm text-muted-foreground">Unidad Educativa Fiscal Eloy Alfaro</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Versión del Sistema</h3>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

