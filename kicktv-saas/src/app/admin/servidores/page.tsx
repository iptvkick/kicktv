export default function ServidoresPage() {
  return (
    <div className="flex flex-col gap-6 p-8 w-full max-w-7xl mx-auto mt-4 sm:mt-16 md:mt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Servidores Xtream</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte e gerencie seus painéis Xtream Codes ou IPTV.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium text-gray-900 mb-1">Módulo em Desenvolvimento</p>
          <p>A gestão de servidores será implementada em breve.</p>
        </div>
      </div>
    </div>
  );
}
