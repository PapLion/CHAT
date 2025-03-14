import LoginForm from "@/components/login-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md animate-fadeInUp bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center animate-slideUp">
          <h2 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

