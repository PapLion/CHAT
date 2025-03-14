"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

interface Role {
  value: string
  label: string
}

export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showUploadButton, setShowUploadButton] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const roles: Role[] = [
    { value: "profesor", label: "Profesor" },
    { value: "personal_administrativo", label: "Personal administrativo" },
    { value: "estudiante", label: "Estudiante" },
    { value: "padre", label: "Padre" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePic(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProfilePic(null)
      setImagePreview(null)
    }
  }

  const isRoleDisabled = (role: string) => {
    if (
      (selectedRoles.includes("estudiante") && role === "padre") ||
      (selectedRoles.includes("padre") && role === "estudiante") ||
      (selectedRoles.includes("estudiante") && role === "profesor") ||
      (selectedRoles.includes("profesor") && role === "estudiante")
    ) {
      return true
    }
    return false
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const validateForm = () => {
    if (!username || !password || !confirmPassword) {
      throw new Error("Todos los campos son obligatorios")
    }

    if (password !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden")
    }

    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres")
    }

    if (selectedRoles.length === 0) {
      throw new Error("Debes seleccionar al menos un rol")
    }

    if (
      (selectedRoles.includes("estudiante") && selectedRoles.includes("padre")) ||
      (selectedRoles.includes("estudiante") && selectedRoles.includes("profesor"))
    ) {
      throw new Error("No puedes seleccionar 'Estudiante' con 'Padre' o 'Profesor' al mismo tiempo")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      setRoleError("")

      validateForm()

      const formData = new FormData()
      formData.append("username", username)
      formData.append("password", password)

      formData.append("roles", JSON.stringify(selectedRoles))

      if (profilePic) {
        formData.append("profilePic", profilePic)
      }

      console.log("📤 Enviando solicitud de registro...")

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      })

      console.log("📥 Respuesta recibida:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        alert("Usuario registrado exitosamente")
        resetForm()
        router.push("/login")
      } else {
        throw new Error(data.message || "Error en el registro")
      }
    } catch (error: any) {
      console.error("❌ Error en el registro:", error)
      setError(error.message || "Error en la conexión con el servidor")
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setConfirmPassword("")
    setProfilePic(null)
    setImagePreview(null)
    setSelectedRoles([])
    setError(null)
    setRoleError("")
  }

  return (
    <Card className="bg-white p-12 rounded-2xl shadow-xl">
      <CardHeader className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
        <p className="text-gray-600 mt-2">Añade un participante a nuestra comunidad educativa</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-[180px] h-[180px] border-2 ${imagePreview ? "border-transparent" : "border-gray-300"} rounded-xl flex flex-col justify-center items-center relative overflow-hidden`}
                onMouseOver={() => setShowUploadButton(true)}
                onMouseLeave={() => setShowUploadButton(false)}
              >
                {imagePreview ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">Foto de perfil</p>
                )}
                <div
                  className={`${!imagePreview || showUploadButton ? "opacity-100" : "opacity-0"} transition-opacity duration-300 mt-auto z-10 w-full`}
                >
                  <Label
                    htmlFor="file-upload"
                    className={`bg-blue-600 text-white py-3 px-4 rounded-lg cursor-pointer font-bold text-center block mx-auto ${!imagePreview ? "w-full" : "w-auto"} hover:bg-blue-700 transition-transform hover:scale-105`}
                  >
                    Subir imagen
                  </Label>
                  <Input id="file-upload" type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Nombre de usuario"
                  className="p-4 text-lg border-2 border-gray-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Contraseña"
                  className="p-4 text-lg border-2 border-gray-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Repite la contraseña"
                  className="p-4 text-lg border-2 border-gray-300 rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <h3 className="font-bold text-blue-600">Elige los roles</h3>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap justify-around gap-4">
              {roles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => toggleRole(role.value)}
                    disabled={isRoleDisabled(role.value)}
                  />
                  <Label htmlFor={`role-${role.value}`} className="text-gray-700">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
            {roleError && <p className="text-red-500 text-sm mt-2 text-center">{roleError}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-transform hover:translate-y-[-2px]"
          >
            {isLoading ? "Procesando..." : "Confirmar"}
          </Button>

          <p className="text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

