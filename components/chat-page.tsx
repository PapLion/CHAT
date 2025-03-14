"use client"

import { useState } from "react"
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"

interface User {
  _id: string
  username: string
  roles: string[]
}

interface ChatPageProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function ChatPage({ user }: ChatPageProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar onSelectUser={handleSelectUser} />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  )
}

