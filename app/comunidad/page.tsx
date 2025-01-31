export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Comunidad Educativa</h1>

        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Sobre Nosotros</h2>
            <p className="text-gray-600">
              La Unidad Educativa Fiscal Eloy Alfaro es una institución comprometida con la excelencia académica y el
              desarrollo integral de nuestros estudiantes.
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Eventos Próximos</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-medium text-gray-900">Reunión de Padres</h3>
                <p className="text-gray-600">15 de Febrero, 2025 - 14:00</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-medium text-gray-900">Feria de Ciencias</h3>
                <p className="text-gray-600">1 de Marzo, 2025 - 09:00</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recursos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Calendario Académico</h3>
                <p className="text-gray-600">Consulta las fechas importantes del año lectivo</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Biblioteca Digital</h3>
                <p className="text-gray-600">Accede a recursos educativos en línea</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

