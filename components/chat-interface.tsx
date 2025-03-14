"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, LogOut, Send, Paperclip } from "lucide-react"
import ChatSidebar from "./chat-sidebar"

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

interface ChatInterfaceProps {
  user: User
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedChat) {
      fetchMessages()
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/${selectedChat}`)
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedChat,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ChatSidebar
          user={user}
          selectedChat={selectedChat}
          onSelectChat={(chatId) => {
            setSelectedChat(chatId)
            setIsMobileMenuOpen(false)
          }}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <h1 className="ml-2 text-xl font-bold text-gray-900">Chat</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={goToDashboard}>
                <Home className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className="flex max-w-[80%] items-end space-x-2">
                        {!message.isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                          </Avatar>
                        )}
                        <Card className={message.isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                          <CardContent className="p-3">
                            <p>{message.content}</p>
                            <div
                              className={`mt-1 text-right text-xs ${message.isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t bg-white p-4">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="shrink-0">
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Select a chat to start messaging</h2>
                <p className="mt-2 text-gray-500">Choose a conversation from the sidebar</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

