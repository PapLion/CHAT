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
  sender_id: number
  created_at: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [chatAbierto, setChatAbierto] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

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
    return () => {
      clearInterval(interval)
    }
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

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-4 max-w-4xl">
        <main className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[calc(100vh-200px)]">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === Number(userId)
            return (
              <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwnMessage
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="font-semibold text-sm">{message.sender_name}</p>
                  <p className="break-words">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(message.created_at).toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </main>
        <footer className="border-t pt-4 bg-background rounded-lg p-4">
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
    </>
  )
}

