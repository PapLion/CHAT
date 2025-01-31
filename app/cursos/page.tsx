"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/Navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Course {
  id: number
  name: string
  parallel: string
  year: string
  specialization: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState({ name: "", parallel: "", year: "", specialization: "" })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "authority") {
      router.push("/chat")
      return
    }

    fetchCourses()
  }, [router])

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCourse),
      })

      if (res.ok) {
        fetchCourses()
        setNewCourse({ name: "", parallel: "", year: "", specialization: "" })
        toast({
          title: "Curso añadido",
          description: "El curso ha sido añadido correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo añadir el curso",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding course:", error)
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.ok) {
        fetchCourses()
        toast({
          title: "Curso eliminado",
          description: "El curso ha sido eliminado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el curso",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting course:", error)
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
          <h1 className="text-xl font-bold">Gestión de Cursos</h1>
          <Navigation />
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <form onSubmit={handleAddCourse} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="parallel">Paralelo</Label>
              <Input
                id="parallel"
                value={newCourse.parallel}
                onChange={(e) => setNewCourse({ ...newCourse, parallel: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                value={newCourse.year}
                onChange={(e) => setNewCourse({ ...newCourse, year: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="specialization">Especialización</Label>
              <Input
                id="specialization"
                value={newCourse.specialization}
                onChange={(e) => setNewCourse({ ...newCourse, specialization: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit">Añadir Curso</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Paralelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Especialización</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.parallel}</TableCell>
                <TableCell>{course.year}</TableCell>
                <TableCell>{course.specialization}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button asChild variant="secondary">
                      <Link href={`/chat/${course.id}`}>Ver Chat</Link>
                    </Button>
                    <Button onClick={() => handleDeleteCourse(course.id)} variant="destructive">
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

