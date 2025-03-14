"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const usernameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameInputRef.current?.focus()
  }, [])

  const clearError = (field: "username" | "password") => {
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ username: "", password: "" })

    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: "El nombre de usuario es requerido" }))
      setIsLoading(false)
      return
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "La contraseña es requerida" }))
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes("Usuario")) {
          setErrors((prev) => ({ ...prev, username: result.error }))
        } else if (result.error.includes("Contraseña")) {
          setErrors((prev) => ({ ...prev, password: result.error }))
        } else {
          setErrors((prev) => ({ ...prev, password: "Usuario o contraseña incorrectos" }))
        }
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Error en el servidor. Inténtalo de nuevo." }))
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 animate-fadeInUp delay-200">
      <div className="space-y-4">
        <div className="animate-slideUp delay-100">
          <Label htmlFor="username" className="text-sm text-gray-500">
            Nombre de usuario
          </Label>
          <Input
            id="username"
            ref={usernameInputRef}
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              clearError("username")
            }}
            className={`mt-1 h-12 bg-gray-50 text-base ${errors.username ? "border-red-500" : "border-gray-200"}`}
            placeholder="Nombre de usuario"
          />
          {errors.username && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.username}</p>}
        </div>

        <div className="animate-slideUp delay-200">
          <Label htmlFor="password" className="text-sm text-gray-500">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearError("password")
              }}
              className={`mt-1 h-12 bg-gray-50 text-base ${errors.password ? "border-red-500" : "border-gray-200"}`}
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.password}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#0084ff] hover:bg-[#0077e6] text-white text-base font-medium animate-fadeInUp delay-200"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⟳</span> Cargando...
          </>
        ) : (
          "Ingresar"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600 animate-fadeInUp delay-200">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-[#0084ff] font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}

