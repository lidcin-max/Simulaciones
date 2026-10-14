import React from 'react';
import { BookOpen, Sparkles, SlidersHorizontal, Scale } from 'lucide-react';

interface HeaderProps {
  viewMode: 'single' | 'compare';
  setViewMode: (mode: 'single' | 'compare') => void;
  onOpenModelModal: () => void;
  onSelectPresetScenario: (scenarioId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenModelModal,
  onSelectPresetScenario,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zona 1, 2 y 3 del Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zona 1: Brand wordmark puro de una sola línea */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
            FIM
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Fuerzas Intermoleculares
          </span>
        </div>

        {/* Zona 2: Enlaces / Modos de exploración limpios */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setViewMode('single')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'text-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Exploración Individual
          </button>

          <button
            onClick={() => setViewMode('compare')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              viewMode === 'compare'
                ? 'text-indigo-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            Comparación Simultánea
          </button>
        </nav>

        {/* Zona 3: 1 Acción Primaria destacada */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenModelModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Modelo Científico
          </button>
        </div>
      </div>

      {/* Barra de Casos de Estudio Pedagógicos recomendados (Bajo la cabecera) */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Experimentos Didácticos Clave:
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectPresetScenario('methane_butane')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors whitespace-nowrap text-[11.5px]"
            >
              1. Efecto del tamaño: CH₄ vs C₄H₁₀ (London)
            </button>
            <button
              onClick={() => onSelectPresetScenario('hcl_nh3')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors whitespace-nowrap text-[11.5px]"
            >
              2. Dipolo vs Puente H: HCl vs NH₃
            </button>
            <button
              onClick={() => onSelectPresetScenario('water_ammonia')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors whitespace-nowrap text-[11.5px]"
            >
              3. Anomalía del agua: H₂O vs NH₃ (Red 3D)
            </button>
            <button
              onClick={() => onSelectPresetScenario('alkane_series')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors whitespace-nowrap text-[11.5px]"
            >
              4. Homólogos: CH₄ vs C₂H₆ (Polarizabilidad)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
