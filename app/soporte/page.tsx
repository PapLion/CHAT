export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Soporte</h1>

        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Contacto</h2>
            <p className="text-gray-600 mb-4">
              Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>Email: soporte@eloyalfaro.edu.ec</li>
              <li>Teléfono: (04) 234-5678</li>
              <li>Horario: Lunes a Viernes, 8:00 AM - 4:00 PM</li>
            </ul>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">¿Cómo puedo cambiar mi contraseña?</h3>
                <p className="text-gray-600">
                  Para cambiar tu contraseña, ve a Configuración y selecciona la opción "Cambiar contraseña".
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">¿Qué hago si olvidé mi contraseña?</h3>
                <p className="text-gray-600">
                  En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

