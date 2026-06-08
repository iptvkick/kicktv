import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Tv, Smartphone, Monitor, ChevronLeft, PlaySquare } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  useEffect(() => {
    async function fetchDevices() {
      const { data, error } = await supabase
        .from('onboarding_devices')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (!error && data) {
        setDevices(data);
      }
      setIsLoading(false);
    }
    fetchDevices();
  }, []);

  // Mapeamento de strings de ícones para componentes Lucide
  const iconMap: Record<string, any> = {
    Tv: Tv,
    Smartphone: Smartphone,
    Monitor: Monitor,
  };

  if (selectedDevice) {
    return <OnboardingFlow device={selectedDevice} onBack={() => setSelectedDevice(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">KickTV</h1>
        <Link to="/cliente/dashboard" className="text-sm font-semibold bg-white px-4 py-2 rounded-full shadow-sm">
          Login
        </Link>
      </header>

      <main className="px-6 flex-1 flex flex-col pt-4 pb-32">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight leading-tight mb-4">
            A nova era do <br /> entretenimento.
          </h2>
          <p className="text-foreground/70 text-lg">
            Sem travamentos, sem dor de cabeça. Escolha onde vai assistir e receba seu teste grátis agora.
          </p>
        </div>

        {/* Onboarding Devices */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-2">Onde você quer assistir?</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
            </div>
          ) : devices.map((device) => {
            const Icon = iconMap[device.icon_name] || Tv;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className="bg-card p-5 rounded-[24px] shadow-sm flex items-center gap-4 border border-black/5 hover:border-black/10 transition-colors text-left group relative overflow-hidden"
              >
                <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg">{device.name}</span>
                  <span className="text-sm text-foreground/60">Configuração Rápida</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute right-6">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pb-8">
        <Link to="/cliente/dashboard" className="w-full bg-accent text-white h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform">
          Gerar Teste Grátis (4 Horas)
        </Link>
      </div>
    </div>
  );
}

function OnboardingFlow({ device, onBack }: { device: any, onBack: () => void }) {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSteps() {
      const { data } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('device_id', device.id)
        .order('step_number', { ascending: true });
      
      setSteps(data || []);
      setIsLoading(false);
    }
    fetchSteps();
  }, [device.id]);

  if (isLoading) return <div className="flex-1 flex justify-center items-center"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>;

  if (steps.length === 0) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h3 className="text-xl font-bold">Nenhum tutorial encontrado</h3>
      <button onClick={onBack} className="mt-4 text-accent font-bold">Voltar</button>
    </div>
  );

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{device.name}</h1>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-32">
        {currentStep.media_url ? (
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden mb-6 shadow-xl relative group">
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentStep.media_url}?autoplay=0`} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        ) : (
          <div className="w-full aspect-video bg-zinc-100 rounded-3xl mb-6 shadow-sm flex items-center justify-center text-zinc-400">
            <PlaySquare className="w-12 h-12 opacity-50" />
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-1.5 flex-1 rounded-full ${idx <= currentStepIndex ? 'bg-accent' : 'bg-black/10'}`} />
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-3">{currentStep.title}</h2>
        <p className="text-foreground/70 text-lg leading-relaxed">{currentStep.description}</p>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pb-8">
        <button 
          onClick={() => isLastStep ? onBack() : setCurrentStepIndex(i => i + 1)}
          className="w-full bg-accent text-white h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform"
        >
          {isLastStep ? "Concluir" : "Próximo Passo"}
        </button>
      </div>
    </div>
  );
}
