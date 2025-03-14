"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface User {
  _id: string
  username: string
  roles: string[]
}

interface ChatSidebarProps {
  onSelectUser: (user: User) => void
}

export default function ChatSidebar({ onSelectUser }: ChatSidebarProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/chat/users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.some((role) => role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="w-[300px] bg-[#f3f4f6] p-4">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar usuarios..."
        className="mb-4"
      />
      <ul className="list-none p-0">
        {filteredUsers.map((user) => (
          <li key={user._id} onClick={() => onSelectUser(user)} className="p-2 cursor-pointer hover:bg-[#e5e7eb]">
            {user.username} ({user.roles.join(", ")})
          </li>
        ))}
      </ul>
    </div>
  )
}

