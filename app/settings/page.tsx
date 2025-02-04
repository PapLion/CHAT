"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Settings() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "authority") {
      router.push("/chat")
    }
  }, [router])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Configuración General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la Institución</label>
              <input
                type="text"
                defaultValue="Unidad Educativa Fiscal Eloy Alfaro"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black">
                <option>América/Guayaquil</option>
                <option>América/Quito</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Notificaciones</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Notificaciones por Email</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">Guardar Cambios</button>
        </div>
      </div>
    </div>
  )
}

