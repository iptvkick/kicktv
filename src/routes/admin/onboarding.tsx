import { createFileRoute } from '@tanstack/react-router'
import { GripVertical, Youtube, Plus, Save, Tv, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/onboarding')({
  component: OnboardingAdminPage,
})

function OnboardingAdminPage() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: '',
    icon_name: 'tv',
    order_index: 1,
    is_active: true
  })
  const [isSavingDevice, setIsSavingDevice] = useState(false)

  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [stepsLoading, setStepsLoading] = useState(false)

  useEffect(() => {
    async function fetchDevices() {
      const { data, error } = await supabase
        .from('onboarding_devices')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (data && !error) {
        setDevices(data)
      }
      setLoading(false)
    }
    fetchDevices()
  }, [])

  const handleSelectDevice = async (device: any) => {
    setSelectedDevice(device)
    setStepsLoading(true)
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('device_id', device.id)
      .order('order_index', { ascending: true })
    
    if (data && !error) {
      setSteps(data)
    } else {
      setSteps([])
    }
    setStepsLoading(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Deseja realmente deletar este aparelho?')) return
    const { error } = await supabase.from('onboarding_devices').delete().eq('id', id)
    if (!error) {
      setDevices(devices.filter(d => d.id !== id))
      if (selectedDevice?.id === id) setSelectedDevice(null)
    } else {
      alert('Erro ao deletar aparelho.')
    }
  }

  const handleSaveDevice = async () => {
    setIsSavingDevice(true)
    const toInsert = { ...newDevice, order_index: devices.length + 1 }
    const { data, error } = await supabase.from('onboarding_devices').insert(toInsert).select().single()
    setIsSavingDevice(false)
    if (data && !error) {
      setDevices([...devices, data])
      setIsAddingDevice(false)
      setNewDevice({
        name: '',
        icon_name: 'tv',
        order_index: 1,
        is_active: true
      })
    } else {
      alert('Erro ao criar aparelho.')
    }
  }

  const handleAddStep = () => {
    if (!selectedDevice) return
    const newStep = {
      device_id: selectedDevice.id,
      title: '',
      description: '',
      youtube_id: '',
      order_index: steps.length + 1,
      isEditing: true // flag local para UI
    }
    setSteps([...steps, newStep])
  }

  const handleSaveStep = async (index: number, stepData: any) => {
    const { isEditing, ...toSave } = stepData
    if (toSave.id) {
      const { data, error } = await supabase.from('onboarding_steps').update(toSave).eq('id', toSave.id).select().single()
      if (data && !error) {
        const newSteps = [...steps]
        newSteps[index] = data
        setSteps(newSteps)
      } else {
        alert('Erro ao atualizar passo.')
      }
    } else {
      const { data, error } = await supabase.from('onboarding_steps').insert(toSave).select().single()
      if (data && !error) {
        const newSteps = [...steps]
        newSteps[index] = data
        setSteps(newSteps)
      } else {
        alert('Erro ao criar passo.')
      }
    }
  }

  const handleDeleteStep = async (index: number, stepData: any) => {
    if (!stepData.id) {
      setSteps(steps.filter((_, i) => i !== index))
      return
    }
    if (!confirm('Deseja realmente deletar este passo?')) return
    const { error } = await supabase.from('onboarding_steps').delete().eq('id', stepData.id)
    if (!error) {
      setSteps(steps.filter((_, i) => i !== index))
    } else {
      alert('Erro ao deletar passo.')
    }
  }

  const toggleEditStep = (index: number, isEditing: boolean) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], isEditing }
    setSteps(newSteps)
  }

  const updateStepLocalData = (index: number, field: string, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 p-8 w-full max-w-7xl mx-auto min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Onboarding Builder</h1>
          <p className="text-foreground/60 mt-2">Personalize a lista de aparelhos que aparece na tela de "Gerar Teste" e crie tutoriais embutindo vídeos do YouTube.</p>
        </div>
        <button className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Ordem
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Esquerdo: Lista de Aparelhos */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground">Aparelhos na Landing Page</h3>
            {!isAddingDevice && (
              <button 
                onClick={() => setIsAddingDevice(true)}
                className="text-foreground border border-border hover:bg-black/5 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            )}
          </div>

          {isAddingDevice && (
            <div className="bg-card border border-border p-4 rounded-[24px] flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Nome do Aparelho" 
                className="border p-2 rounded-xl text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                value={newDevice.name}
                onChange={e => setNewDevice({...newDevice, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Ícone (ex: tv, monitor)" 
                className="border p-2 rounded-xl text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                value={newDevice.icon_name}
                onChange={e => setNewDevice({...newDevice, icon_name: e.target.value})}
              />
              <div className="flex gap-2">
                <button onClick={() => setIsAddingDevice(false)} className="flex-1 bg-zinc-100 text-zinc-900 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors">Cancelar</button>
                <button onClick={handleSaveDevice} disabled={isSavingDevice} className="flex-1 bg-zinc-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                  {isSavingDevice ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-sm text-foreground/50">Carregando aparelhos...</div>
            ) : devices.length === 0 ? (
              <div className="text-sm text-foreground/50">Nenhum aparelho cadastrado.</div>
            ) : (
              devices.map(device => (
                <div 
                  key={device.id} 
                  onClick={() => handleSelectDevice(device)}
                  className={`bg-card border p-4 rounded-[24px] flex items-center gap-4 cursor-pointer transition-colors group ${selectedDevice?.id === device.id ? 'border-primary shadow-sm' : 'border-border hover:bg-border/50'}`}
                >
                  <GripVertical className="w-5 h-5 text-foreground/30 group-hover:text-foreground/60 cursor-grab shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-foreground">{device.name}</span>
                    <span className="text-xs text-foreground/50">Ícone: {device.icon_name}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(device.id, e)}
                    className="text-foreground/30 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Painel Direito: O Editor Visual de Passos */}
        <div className="col-span-2 bg-card border border-border rounded-[32px] p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
          
          <h3 className="font-bold text-2xl text-foreground mb-1">Passos de Onboarding</h3>
          <p className="text-foreground/50 text-sm mb-8">
            {selectedDevice ? `Telas de ajuda para: ${selectedDevice.name}` : 'Selecione um aparelho na lista para gerenciar os passos.'}
          </p>

          {!selectedDevice ? (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-[24px]">
              <span className="text-foreground/50 text-sm font-medium">Nenhum aparelho selecionado</span>
            </div>
          ) : stepsLoading ? (
            <div className="text-sm text-foreground/50">Carregando passos...</div>
          ) : (
            <div className="flex flex-col gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-background p-6 rounded-[24px] border border-border flex flex-col gap-4 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                  
                  {step.isEditing || !step.id ? (
                    // Modo Edição
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Título do Passo</label>
                        <input 
                          type="text" 
                          value={step.title} 
                          onChange={e => updateStepLocalData(idx, 'title', e.target.value)}
                          className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary font-medium transition-colors" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Descrição (Markdown)</label>
                        <textarea 
                          rows={2} 
                          value={step.description} 
                          onChange={e => updateStepLocalData(idx, 'description', e.target.value)}
                          className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm resize-none transition-colors" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider flex items-center gap-1.5">
                          <Youtube className="w-4 h-4 text-red-500" />
                          ID do Vídeo do YouTube (Opcional)
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ex: dQw4w9WgXcQ" 
                          value={step.youtube_id || ''} 
                          onChange={e => updateStepLocalData(idx, 'youtube_id', e.target.value)}
                          className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-sm transition-colors" 
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-4 mt-2 border-t border-border">
                        <button 
                          onClick={() => {
                            if (!step.id) handleDeleteStep(idx, step)
                            else toggleEditStep(idx, false)
                          }} 
                          className="px-4 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-black/5 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => handleSaveStep(idx, step)} 
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Salvar
                        </button>
                      </div>
                    </>
                  ) : (
                    // Modo Leitura
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <h4 className="font-bold text-foreground text-lg">{step.title}</h4>
                          <p className="text-sm text-foreground/70">{step.description}</p>
                          {step.youtube_id && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium mt-2">
                              <Youtube className="w-3 h-3" /> {step.youtube_id}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleEditStep(idx, true)} className="text-xs font-bold text-foreground/50 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border hover:bg-black/5">
                            Editar
                          </button>
                          <button onClick={() => handleDeleteStep(idx, step)} className="text-xs font-bold text-red-500/50 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50">
                            Apagar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button onClick={handleAddStep} className="border-2 border-dashed border-border text-foreground/50 hover:border-foreground/30 hover:bg-black/5 hover:text-foreground transition-all py-4 rounded-[24px] font-bold flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Adicionar Passo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

