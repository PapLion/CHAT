"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Home, LogOut, BarChart, UserPlus, MessageSquare, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardContentProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    roles?: string[]
  }
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const menuItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
    {
      name: "Crear Actividad",
      icon: <UserPlus className="h-5 w-5" />,
      path: "/dashboard/create-activity",
      role: "profesor",
    },
    {
      name: "Unirse a Actividad",
      icon: <User className="h-5 w-5" />,
      path: "/dashboard/join-activity",
      role: "estudiante",
    },
    {
      name: "Resultados",
      icon: <BarChart className="h-5 w-5" />,
      path: "/dashboard/activity-results",
      role: "profesor",
    },
    { name: "Chat", icon: <MessageSquare className="h-5 w-5" />, path: "/dashboard/chat" },
  ]

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.role) return true
    return user.roles?.includes(item.role)
  })

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <div className="flex h-screen w-full">
      <aside
        className={`flex h-full flex-col bg-white transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="flex items-center gap-4 border-b border-gray-100 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <span
            className={`font-medium text-gray-900 transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            {user.name}
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex w-full items-center gap-4 rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#4e73df] ${
                isCollapsed ? "justify-center" : "justify-start"
              }`}
            >
              {item.icon}
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 p-4 text-red-600 transition-colors hover:bg-red-50 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <LogOut className="h-5 w-5" />
          <span className={`text-sm font-medium transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}>
            Cerrar sesión
          </span>
        </button>
      </aside>

      <main className="flex-1 bg-gray-50 p-8">
        <div className="h-full rounded-lg bg-white p-6 shadow-sm"></div>
      </main>
    </div>
  )
}

