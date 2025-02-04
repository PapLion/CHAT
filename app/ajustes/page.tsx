"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

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

    // Cargar el estado actual del chat
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Ajustes</h1>
      <div className="flex items-center space-x-2">
        <Switch id="chat-status" checked={chatAbierto} onCheckedChange={toggleChatStatus} />
        <Label htmlFor="chat-status">{chatAbierto ? "Chat abierto" : "Chat cerrado"}</Label>
      </div>
    </div>
  )
}

