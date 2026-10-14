import React, { useState, useEffect, useRef } from 'react';
import { SubstanceData, SubstanceId } from '../types/substance';
import { SUBSTANCES, SUBSTANCE_LIST } from '../data/substances';
import { SimulationCanvas } from './SimulationCanvas';
import { MacroscopicStateView } from './MacroscopicStateView';
import { SymbolicDataView } from './SymbolicDataView';
import {
  initializeMolecules,
  stepSimulation,
  SimulationState,
} from '../physics/molecularDynamics';
import {
  Play,
  Pause,
  RotateCcw,
  Thermometer,
  Sliders,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Unlink,
  Sparkles,
} from 'lucide-react';

interface DualComparisonViewProps {
  initialSubstanceA?: SubstanceId;
  initialSubstanceB?: SubstanceId;
  initialTemperature?: number;
}

export const DualComparisonView: React.FC<DualComparisonViewProps> = ({
  initialSubstanceA = 'CH4',
  initialSubstanceB = 'C4H10',
  initialTemperature = -50,
}) => {
  const [subAId, setSubAId] = useState<SubstanceId>(initialSubstanceA);
  const [subBId, setSubBId] = useState<SubstanceId>(initialSubstanceB);

  const subA = SUBSTANCES[subAId];
  const subB = SUBSTANCES[subBId];

  // Control de temperatura sincronizada o independiente
  const [isSyncTemp, setIsSyncTemp] = useState<boolean>(true);
  const [tempA, setTempA] = useState<number>(initialTemperature);
  const [tempB, setTempB] = useState<number>(initialTemperature);

  // Controles de simulación
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [moleculeCount, setMoleculeCount] = useState<number>(24);

  // Toggles de visualización de interacciones
  const [showLondon, setShowLondon] = useState<boolean>(true);
  const [showDipole, setShowDipole] = useState<boolean>(true);
  const [showHbond, setShowHbond] = useState<boolean>(true);
  const [showDipoleVector, setShowDipoleVector] = useState<boolean>(true);
  const [showPartialCharges, setShowPartialCharges] = useState<boolean>(true);

  // Estados de simulación física A y B
  const [stateA, setStateA] = useState<SimulationState>(() => ({
    substance: subA,
    temperatureC: tempA,
    molecules: initializeMolecules(subA, 24, 380, 280, tempA),
    interactions: [],
    containerWidth: 380,
    containerHeight: 280,
    averageKineticEnergy: 0,
    averagePotentialEnergy: 0,
    totalEnergy: 0,
    activeHbondsCount: 0,
    activeDipoleCount: 0,
    activeLondonCount: 0,
    cohesiveFraction: 0,
    simulatedTimePs: 0,
  }));

  const [stateB, setStateB] = useState<SimulationState>(() => ({
    substance: subB,
    temperatureC: tempB,
    molecules: initializeMolecules(subB, 24, 380, 280, tempB),
    interactions: [],
    containerWidth: 380,
    containerHeight: 280,
    averageKineticEnergy: 0,
    averagePotentialEnergy: 0,
    totalEnergy: 0,
    activeHbondsCount: 0,
    activeDipoleCount: 0,
    activeLondonCount: 0,
    cohesiveFraction: 0,
    simulatedTimePs: 0,
  }));

  // Re-inicializar cuando cambia sustancia o cantidad
  const resetSimulationA = (newSub: SubstanceData = subA, count = moleculeCount, t = tempA) => {
    setStateA({
      substance: newSub,
      temperatureC: t,
      molecules: initializeMolecules(newSub, count, 380, 280, t),
      interactions: [],
      containerWidth: 380,
      containerHeight: 280,
      averageKineticEnergy: 0,
      averagePotentialEnergy: 0,
      totalEnergy: 0,
      activeHbondsCount: 0,
      activeDipoleCount: 0,
      activeLondonCount: 0,
      cohesiveFraction: 0,
      simulatedTimePs: 0,
    });
  };

  const resetSimulationB = (newSub: SubstanceData = subB, count = moleculeCount, t = tempB) => {
    setStateB({
      substance: newSub,
      temperatureC: t,
      molecules: initializeMolecules(newSub, count, 380, 280, t),
      interactions: [],
      containerWidth: 380,
      containerHeight: 280,
      averageKineticEnergy: 0,
      averagePotentialEnergy: 0,
      totalEnergy: 0,
      activeHbondsCount: 0,
      activeDipoleCount: 0,
      activeLondonCount: 0,
      cohesiveFraction: 0,
      simulatedTimePs: 0,
    });
  };

  useEffect(() => {
    resetSimulationA(subA, moleculeCount, tempA);
  }, [subAId, moleculeCount]);

  useEffect(() => {
    resetSimulationB(subB, moleculeCount, tempB);
  }, [subBId, moleculeCount]);

  // Actualizar temperatura en el estado físico
  const handleTempAChange = (val: number) => {
    setTempA(val);
    setStateA(prev => ({ ...prev, temperatureC: val }));
    if (isSyncTemp) {
      setTempB(val);
      setStateB(prev => ({ ...prev, temperatureC: val }));
    }
  };

  const handleTempBChange = (val: number) => {
    setTempB(val);
    setStateB(prev => ({ ...prev, temperatureC: val }));
    if (isSyncTemp) {
      setTempA(val);
      setStateA(prev => ({ ...prev, temperatureC: val }));
    }
  };

  // Loop de simulación a 60 fps
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (time: number) => {
      const dt = Math.min(0.04, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      if (isPlaying) {
        setStateA(prev =>
          stepSimulation(prev, dt, { showLondon, showDipole, showHbond })
        );
        setStateB(prev =>
          stepSimulation(prev, dt, { showLondon, showDipole, showHbond })
        );
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, showLondon, showDipole, showHbond]);

  return (
    <div className="space-y-6">
      {/* Barra de control general de la comparación */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Controles de reproducción */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-white transition-colors ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pausar Ambos' : 'Reanudar'}
            </button>

            <button
              onClick={() => {
                resetSimulationA(subA, moleculeCount, tempA);
                resetSimulationB(subB, moleculeCount, tempB);
              }}
              className="px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>

            {/* Toggle de sincronización de temperatura */}
            <button
              onClick={() => {
                const nextSync = !isSyncTemp;
                setIsSyncTemp(nextSync);
                if (nextSync) {
                  setTempB(tempA);
                  setStateB(prev => ({ ...prev, temperatureC: tempA }));
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-colors ${
                isSyncTemp
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSyncTemp ? <LinkIcon className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
              {isSyncTemp ? 'Temperaturas Sincronizadas' : 'Temperaturas Independientes'}
            </button>
          </div>

          {/* Slider de moléculas representadas */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              Moléculas representadas:
            </span>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={moleculeCount}
              onChange={e => setMoleculeCount(Number(e.target.value))}
              className="w-28 accent-indigo-600"
            />
            <span className="font-mono font-bold text-slate-900 w-6">
              {moleculeCount}
            </span>
          </div>
        </div>

        {/* Toggles de visualización de interacciones */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium mr-1">Visualizar FIM:</span>
          <button
            onClick={() => setShowLondon(!showLondon)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showLondon ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            London (Fuerzas de dispersión)
          </button>
          <button
            onClick={() => setShowDipole(!showDipole)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showDipole ? 'bg-sky-50 border-sky-300 text-sky-800 font-medium' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            Dipolo-Dipolo
          </button>
          <button
            onClick={() => setShowHbond(!showHbond)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showHbond ? 'bg-rose-50 border-rose-300 text-rose-800 font-medium' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            Puente de Hidrógeno
          </button>
          <button
            onClick={() => setShowDipoleVector(!showDipoleVector)}
            className={`px-2 py-1 rounded border transition-colors ${
              showDipoleVector ? 'bg-yellow-50 border-yellow-300 text-yellow-800' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            Vector Dipolo (μ)
          </button>
          <button
            onClick={() => setShowPartialCharges(!showPartialCharges)}
            className={`px-2 py-1 rounded border transition-colors ${
              showPartialCharges ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            Cargas (δ⁺/δ⁻)
          </button>
        </div>

        {/* Aclaración didáctica explícita sobre N */}
        <div className="text-[11px] text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded">
          * Aclaración didáctica: El número de moléculas simuladas ({moleculeCount}) corresponde a un microvolumen de observación
          y no debe confundirse con la cantidad de sustancia macroscópica medida en moles (1 mol = 6.022 × 10²³ moléculas).
        </div>
      </div>

      {/* Grid de comparación lado a lado (Substancia A vs Substancia B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMNA SUSTANCIA A */}
        <div className="space-y-4 bg-white rounded-xl border-2 border-indigo-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
              <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">Sustancia A</span>
            </div>
            {/* Selector de sustancia A */}
            <select
              value={subAId}
              onChange={e => setSubAId(e.target.value as SubstanceId)}
              className="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-indigo-500"
            >
              {SUBSTANCE_LIST.map(s => (
                <option key={s.id} value={s.id}>
                  {s.formula} — {s.name} (Teb: {s.boilingPointC}°C)
                </option>
              ))}
            </select>
          </div>

          {/* Slider de temperatura A */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-indigo-600" />
                Temperatura Sustancia A:
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {tempA > 0 ? `+${tempA}` : tempA} °C ({tempA + 273.15} K)
              </span>
            </div>
            <input
              type="range"
              min="-190"
              max="120"
              step="1"
              value={tempA}
              onChange={e => handleTempAChange(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Canvas Submicroscópico A */}
          <div className="h-64 rounded-lg overflow-hidden border border-slate-700">
            <SimulationCanvas
              simulationState={stateA}
              substance={subA}
              showLondon={showLondon}
              showDipole={showDipole}
              showHbond={showHbond}
              showDipoleVector={showDipoleVector}
              showPartialCharges={showPartialCharges}
            />
          </div>

          {/* Nivel Macroscópico A */}
          <MacroscopicStateView substance={subA} temperatureC={tempA} />

          {/* Nivel Simbólico A */}
          <SymbolicDataView substance={subA} />
        </div>

        {/* COLUMNA SUSTANCIA B */}
        <div className="space-y-4 bg-white rounded-xl border-2 border-emerald-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Sustancia B</span>
            </div>
            {/* Selector de sustancia B */}
            <select
              value={subBId}
              onChange={e => setSubBId(e.target.value as SubstanceId)}
              className="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-emerald-500"
            >
              {SUBSTANCE_LIST.map(s => (
                <option key={s.id} value={s.id}>
                  {s.formula} — {s.name} (Teb: {s.boilingPointC}°C)
                </option>
              ))}
            </select>
          </div>

          {/* Slider de temperatura B */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                Temperatura Sustancia B:
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {tempB > 0 ? `+${tempB}` : tempB} °C ({tempB + 273.15} K)
              </span>
            </div>
            <input
              type="range"
              min="-190"
              max="120"
              step="1"
              value={tempB}
              onChange={e => handleTempBChange(Number(e.target.value))}
              disabled={isSyncTemp}
              className={`w-full ${isSyncTemp ? 'accent-slate-400 opacity-60' : 'accent-emerald-600'}`}
            />
          </div>

          {/* Canvas Submicroscópico B */}
          <div className="h-64 rounded-lg overflow-hidden border border-slate-700">
            <SimulationCanvas
              simulationState={stateB}
              substance={subB}
              showLondon={showLondon}
              showDipole={showDipole}
              showHbond={showHbond}
              showDipoleVector={showDipoleVector}
              showPartialCharges={showPartialCharges}
            />
          </div>

          {/* Nivel Macroscópico B */}
          <MacroscopicStateView substance={subB} temperatureC={tempB} />

          {/* Nivel Simbólico B */}
          <SymbolicDataView substance={subB} />
        </div>
      </div>
    </div>
  );
};
