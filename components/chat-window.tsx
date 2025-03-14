"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { io, type Socket } from "socket.io-client"

interface User {
  _id: string
  username: string
  roles: string[]
}

interface Message {
  _id: string
  senderId: string
  message: string
}

interface ChatWindowProps {
  selectedUser: User | null
}

export default function ChatWindow({ selectedUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socketInstance = io("http://localhost:3000")
    setSocket(socketInstance)

    socketInstance.on("receiveMessage", handleNewMessage)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/chat/messages/${selectedUser._id}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedUser || !socket) return

    socket.emit("sendMessage", {
      senderId: "currentUserId",
      receiverId: selectedUser._id,
      message: newMessage,
    })

    setNewMessage("")
  }

  const messageClass = (message: Message) => {
    return message.senderId === "currentUserId"
      ? "bg-[#3b82f6] text-white self-end"
      : "bg-[#e5e7eb] text-black self-start"
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex-1 p-4 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message._id} className={`m-2 p-2 rounded-lg max-w-[70%] ${messageClass(message)}`}>
            {message.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="p-2 border border-gray-300 rounded-lg"
        />
      </form>
    </div>
  )
}

