import React, { useState, useEffect, useRef } from 'react';
import { SubstanceData, SubstanceId } from './types/substance';
import { SUBSTANCES, SUBSTANCE_LIST } from './data/substances';
import {
  initializeMolecules,
  stepSimulation,
  SimulationState,
  MoleculeParticle,
} from './physics/molecularDynamics';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { MacroscopicStateView } from './components/MacroscopicStateView';
import { SymbolicDataView } from './components/SymbolicDataView';
import { ThermodynamicsChart } from './components/ThermodynamicsChart';
import { DualComparisonView } from './components/DualComparisonView';
import { ScientificModelModal } from './components/ScientificModelModal';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Thermometer,
  Eye,
  Sliders,
  Scale,
  Sparkles,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';

export default function App() {
  // Modo de vista: 'single' (individual) o 'compare' (comparación simultánea)
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  // Sustancia seleccionada en modo individual
  const [currentSubstanceId, setCurrentSubstanceId] = useState<SubstanceId>('H2O');
  const substance = SUBSTANCES[currentSubstanceId];

  // Sustancia secundaria (para comparación rápida en gráficos)
  const [secondarySubstanceId, setSecondarySubstanceId] = useState<SubstanceId>('NH3');

  // Variable manipulable: Temperatura en °C
  const [temperatureC, setTemperatureC] = useState<number>(25); // 25 °C ambiente por defecto

  // Variable manipulable: Cantidad de moléculas representadas (N)
  const [moleculeCount, setMoleculeCount] = useState<number>(26);

  // Variables manipulables: Toggles de visualización de interacciones
  const [showLondon, setShowLondon] = useState<boolean>(true);
  const [showDipole, setShowDipole] = useState<boolean>(true);
  const [showHbond, setShowHbond] = useState<boolean>(true);
  const [showDipoleVector, setShowDipoleVector] = useState<boolean>(true);
  const [showPartialCharges, setShowPartialCharges] = useState<boolean>(true);

  // Controles de simulación (reproducción)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  // Modal del Modelo Científico
  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);

  // Molécula inspeccionada con el mouse
  const [inspectedMolecule, setInspectedMolecule] = useState<MoleculeParticle | null>(null);

  // Estado físico de la simulación
  const [simState, setSimState] = useState<SimulationState>(() => ({
    substance,
    temperatureC,
    molecules: initializeMolecules(substance, moleculeCount, 540, 360, temperatureC),
    interactions: [],
    containerWidth: 540,
    containerHeight: 360,
    averageKineticEnergy: 0,
    averagePotentialEnergy: 0,
    totalEnergy: 0,
    activeHbondsCount: 0,
    activeDipoleCount: 0,
    activeLondonCount: 0,
    cohesiveFraction: 0,
    simulatedTimePs: 0,
  }));

  // Re-inicializar moléculas cuando cambia la sustancia o la cantidad
  const handleResetSimulation = (
    newSub: SubstanceData = substance,
    newCount: number = moleculeCount,
    newTemp: number = temperatureC
  ) => {
    setSimState({
      substance: newSub,
      temperatureC: newTemp,
      molecules: initializeMolecules(newSub, newCount, 540, 360, newTemp),
      interactions: [],
      containerWidth: 540,
      containerHeight: 360,
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
    handleResetSimulation(substance, moleculeCount, temperatureC);
  }, [currentSubstanceId, moleculeCount]);

  // Actualizar temperatura en el estado de simulación
  const handleTemperatureChange = (newTemp: number) => {
    setTemperatureC(newTemp);
    setSimState(prev => ({ ...prev, temperatureC: newTemp }));
  };

  // Ciclo de animación a 60 fps
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - lastTimeRef.current) / 1000) * speedMultiplier;
      lastTimeRef.current = now;

      if (isPlaying && viewMode === 'single') {
        setSimState(prev =>
          stepSimulation(prev, dt, { showLondon, showDipole, showHbond })
        );
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speedMultiplier, viewMode, showLondon, showDipole, showHbond]);

  // Manejador para escenarios didácticos clave
  const handlePresetScenario = (scenarioId: string) => {
    if (scenarioId === 'methane_butane') {
      setViewMode('compare');
      // Comparar CH4 vs C4H10 a -50 °C: Metano es gas hirviendo, Butano es líquido denso por London masivo
    } else if (scenarioId === 'hcl_nh3') {
      setViewMode('compare');
      // Comparar HCl vs NH3: Dipolo vs Puente de H
    } else if (scenarioId === 'water_ammonia') {
      setViewMode('compare');
      // Comparar H2O vs NH3: Anomalía del agua
    } else if (scenarioId === 'alkane_series') {
      setViewMode('compare');
      // CH4 vs C2H6
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Cabecera académica workbench */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenModelModal={() => setIsModelModalOpen(true)}
        onSelectPresetScenario={handlePresetScenario}
      />

      {/* Cuerpo principal de la aplicación */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {viewMode === 'compare' ? (
          /* MODO COMPARACIÓN SIMULTÁNEA LADO A LADO */
          <DualComparisonView />
        ) : (
          /* MODO EXPLORACIÓN INDIVIDUAL CON LOS 3 NIVELES DE JOHNSTONE */
          <div className="space-y-6">
            {/* BARRA DE CONTROL PRINCIPAL: Selección de sustancia y Temperatura */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
              {/* Selección de sustancia mediante botones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. Selección de Sustancia a Modelizar:
                  </span>
                  <span className="text-xs text-slate-500">
                    6 sustancias representativas con diferentes simetrías y fuerzas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {SUBSTANCE_LIST.map(sub => {
                    const isSelected = sub.id === currentSubstanceId;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setCurrentSubstanceId(sub.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-sm font-bold">
                            {sub.formula}
                          </span>
                          <span
                            className={`text-[10px] font-mono ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            Teb: {sub.boilingPointC}°
                          </span>
                        </div>
                        <div
                          className={`text-xs truncate font-medium mt-0.5 ${
                            isSelected ? 'text-slate-200' : 'text-slate-600'
                          }`}
                        >
                          {sub.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider de Temperatura con atajos pedagógicos */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      2. Temperatura del Sistema (T):
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-indigo-900">
                      {temperatureC > 0 ? `+${temperatureC}` : temperatureC} °C
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      ({(temperatureC + 273.15).toFixed(1)} K)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400">-190 °C</span>
                  <input
                    type="range"
                    min="-190"
                    max="120"
                    step="1"
                    value={temperatureC}
                    onChange={e => handleTemperatureChange(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-xs text-slate-400">+120 °C</span>
                </div>

                {/* Atajos de temperatura pedagógicos */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                  <span className="text-slate-500 text-[11px] mr-1">Atajos físicos:</span>
                  <button
                    onClick={() => handleTemperatureChange(substance.meltingPointC)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                  >
                    Tfusión ({substance.meltingPointC}°C)
                  </button>
                  <button
                    onClick={() => handleTemperatureChange(substance.boilingPointC)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                  >
                    Tebullición ({substance.boilingPointC}°C)
                  </button>
                  <button
                    onClick={() => handleTemperatureChange(0)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                  >
                    0 °C (Fusión H₂O)
                  </button>
                  <button
                    onClick={() => handleTemperatureChange(25)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors font-semibold"
                  >
                    25 °C (Ambiente)
                  </button>
                  <button
                    onClick={() => handleTemperatureChange(100)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 transition-colors"
                  >
                    100 °C (Ebullición H₂O)
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN PRINCIPAL: Grid de Johnstone (Submicroscópico + Macroscópico + Simbólico) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* COLUMNA IZQUIERDA (7 columnas): Nivel Submicroscópico (Canvas) y Controles */}
              <div className="lg:col-span-7 space-y-4">
                {/* Contenedor del Canvas de Simulación */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  {/* Barra de herramientas sobre el canvas */}
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <span className="font-semibold text-slate-100">
                        Nivel Submicroscópico: Cámara de Dinámica Molecular
                      </span>
                    </div>

                    {/* Controles de reproducción Play/Pause/Reset */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                          isPlaying
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title={isPlaying ? 'Pausar simulación' : 'Iniciar simulación'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? 'Pausar' : 'Iniciar'}</span>
                      </button>

                      <button
                        onClick={() => {
                          // Paso a paso
                          setIsPlaying(false);
                          setSimState(prev =>
                            stepSimulation(prev, 0.02, { showLondon, showDipole, showHbond })
                          );
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Avanzar un paso temporal (Δt)"
                      >
                        <StepForward className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetSimulation(substance, moleculeCount, temperatureC)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Reiniciar posiciones moleculares"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-700 mx-1"></div>

                      {/* Selector de velocidad */}
                      <div className="flex items-center gap-1">
                        {[0.5, 1, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => setSpeedMultiplier(speed)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              speedMultiplier === speed
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Canvas interactivo */}
                  <div className="h-96 w-full relative">
                    <SimulationCanvas
                      simulationState={simState}
                      substance={substance}
                      showLondon={showLondon}
                      showDipole={showDipole}
                      showHbond={showHbond}
                      showDipoleVector={showDipoleVector}
                      showPartialCharges={showPartialCharges}
                      onHoverMolecule={mol => setInspectedMolecule(mol)}
                    />
                  </div>

                  {/* Barra de opciones de visualización de interacciones (Bajo el canvas) */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        Capas de visualización de FIM:
                      </span>

                      {/* Slider de moléculas N */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-[11px]">
                          Moléculas simuladas (N):
                        </span>
                        <input
                          type="range"
                          min="10"
                          max="48"
                          step="1"
                          value={moleculeCount}
                          onChange={e => setMoleculeCount(Number(e.target.value))}
                          className="w-24 accent-indigo-600"
                        />
                        <span className="font-mono font-bold text-slate-800 text-[11px] w-5">
                          {moleculeCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        onClick={() => setShowLondon(!showLondon)}
                        className={`px-2.5 py-1 rounded border transition-colors ${
                          showLondon
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1"></span>
                        London (Dispersión)
                      </button>

                      <button
                        onClick={() => setShowDipole(!showDipole)}
                        className={`px-2.5 py-1 rounded border transition-colors ${
                          showDipole
                            ? 'bg-sky-100 border-sky-300 text-sky-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-sky-500 inline-block mr-1"></span>
                        Dipolo-Dipolo
                      </button>

                      <button
                        onClick={() => setShowHbond(!showHbond)}
                        className={`px-2.5 py-1 rounded border transition-colors ${
                          showHbond
                            ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1"></span>
                        Puente de Hidrógeno
                      </button>

                      <button
                        onClick={() => setShowDipoleVector(!showDipoleVector)}
                        className={`px-2 py-1 rounded border transition-colors ${
                          showDipoleVector
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        Vector Dipolo (μ)
                      </button>

                      <button
                        onClick={() => setShowPartialCharges(!showPartialCharges)}
                        className={`px-2 py-1 rounded border transition-colors ${
                          showPartialCharges
                            ? 'bg-slate-200 border-slate-300 text-slate-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        Cargas Parciales (δ⁺/δ⁻)
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 italic">
                      * Nota didáctica: La cantidad de moléculas en pantalla ({moleculeCount}) modela un microvolumen de observación
                      y no debe confundirse con la cantidad de sustancia en moles (1 mol = 6.022 × 10²³ moléculas).
                    </div>
                  </div>
                </div>

                {/* Nivel Macroscópico (Vaso cerrado, manómetro y termómetro) */}
                <MacroscopicStateView
                  substance={substance}
                  temperatureC={temperatureC}
                />
              </div>

              {/* COLUMNA DERECHA (5 columnas): Nivel Simbólico y Gráficos Termodinámicos */}
              <div className="lg:col-span-5 space-y-4">
                {/* Nivel Simbólico (Fórmulas, parámetros moleculares, desglose de fuerzas) */}
                <SymbolicDataView substance={substance} />

                {/* Gráficos Termodinámicos (Curvas Pvap vs T y barras de propiedades) */}
                <ThermodynamicsChart
                  activeSubstance={substance}
                  secondarySubstance={SUBSTANCES[secondarySubstanceId]}
                  temperatureC={temperatureC}
                  onSelectSubstance={id => setCurrentSubstanceId(id)}
                />

                {/* Tarjeta de indagación didáctica orientadora */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3.5 text-xs space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-700 shrink-0" />
                    Preguntas Guía para la Indagación Universitaria:
                  </div>
                  <ul className="space-y-1.5 text-indigo-900 list-disc list-inside leading-relaxed text-[11.5px]">
                    <li>
                      <strong>Butano vs Metano:</strong> Ambas son no polares (μ = 0 D). ¿Por qué el butano hierve a -0.5 °C y el metano a -161.5 °C? Observá la cantidad de electrones y la polarizabilidad.
                    </li>
                    <li>
                      <strong>Agua vs Amoníaco:</strong> Ambas tienen masa similar (~18 g/mol) y forman puentes de H. ¿Por qué el agua ebulle 133 °C más arriba? Analizá la proporción de hidrógenos donores frente a pares libres en el átomo central.
                    </li>
                    <li>
                      <strong>Cloruro de hidrógeno (HCl):</strong> ¿Por qué a pesar de tener un dipolo permanente de 1.08 D, las fuerzas de London representan más del 80% de su cohesión?
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal accesible del Modelo Científico */}
      <ScientificModelModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
}
