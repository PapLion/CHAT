"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Navigation } from "@/components/Navigation"

interface Message {
  id: number
  content: string
  sender_name: string
  created_at: string
}

export default function AuthoritiesChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "authority") {
      router.push("/chat")
      return
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [router])

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chats/autoridades/messages", {
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      const res = await fetch("/api/chats/autoridades/messages", {
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

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Chat de Autoridades</h1>
          <Navigation />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No hay mensajes aún. ¡Sé el primero en escribir!</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-secondary p-3 rounded-lg">
              <p className="font-semibold">{message.sender_name}</p>
              <p>{message.content}</p>
              <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </main>
      <footer className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button type="submit">Enviar</Button>
        </form>
      </footer>
    </div>
  )
}

