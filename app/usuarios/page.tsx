"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/Navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
  is_banned: boolean
  is_muted: boolean
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "authority") {
      router.push("/chat")
      return
    }

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleAction = async (userId: number, action: "ban" | "unban" | "mute" | "unmute") => {
    try {
      const res = await fetch(`/api/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.ok) {
        fetchUsers()
        toast({
          title: "Acción exitosa",
          description: `Usuario ${action === "ban" || action === "mute" ? "" : "des"}${
            action === "ban" || action === "unban" ? "baneado" : "silenciado"
          } correctamente`,
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo realizar la acción",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Usuarios</h1>
          <Navigation />
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleAction(user.id, user.is_banned ? "unban" : "ban")}
                    variant={user.is_banned ? "default" : "destructive"}
                    className="mr-2"
                  >
                    {user.is_banned ? "Desbanear" : "Banear"}
                  </Button>
                  <Button
                    onClick={() => handleAction(user.id, user.is_muted ? "unmute" : "mute")}
                    variant={user.is_muted ? "default" : "secondary"}
                  >
                    {user.is_muted ? "Desmutear" : "Mutear"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

