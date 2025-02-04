"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Message {
  id: number
  content: string
  sender_name: string
  created_at: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [chatAbierto, setChatAbierto] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchMessages()
    fetchChatStatus()
    const interval = setInterval(() => {
      fetchMessages()
      fetchChatStatus()
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !chatAbierto) return

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: input }),
      })

      if (res.ok) {
        setInput("")
        fetchMessages()
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Educativo</h1>
        <div className="flex items-center space-x-4">
          {localStorage.getItem("userRole") === "authority" && (
            <Link href="/ajustes" className="text-primary-foreground hover:underline">
              Ajustes
            </Link>
          )}
          <Button onClick={handleLogout} variant="secondary">
            Cerrar Sesión
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-secondary p-3 rounded-lg">
            <p className="font-semibold">{message.sender_name}</p>
            <p>{message.content}</p>
            <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t">
        {chatAbierto ? (
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button type="submit">Enviar</Button>
          </form>
        ) : (
          <p className="text-center text-muted-foreground">El chat está cerrado actualmente.</p>
        )}
      </footer>
    </div>
  )
}

