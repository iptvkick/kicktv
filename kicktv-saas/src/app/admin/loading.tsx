export default function AdminLoading() {
  return (
    <div className="flex flex-col p-8 md:p-12 w-full max-w-7xl mx-auto gap-8 animate-pulse">
      <header className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-md"></div>
      </header>

      {/* Grid de Métricas Widescreen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela Esqueleto */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="h-6 w-64 bg-gray-200 rounded-md"></div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
            <div className="flex flex-col gap-6">
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Servidores Esqueleto */}
        <div className="flex flex-col gap-4">
          <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
