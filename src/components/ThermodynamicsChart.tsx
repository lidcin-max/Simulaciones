import React, { useState } from 'react';
import { SubstanceData, SubstanceId } from '../types/substance';
import { SUBSTANCES, calculateVaporPressure } from '../data/substances';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface ThermodynamicsChartProps {
  activeSubstance: SubstanceData;
  secondarySubstance?: SubstanceData | null;
  temperatureC: number;
  onSelectSubstance?: (id: SubstanceId) => void;
}

export const ThermodynamicsChart: React.FC<ThermodynamicsChartProps> = ({
  activeSubstance,
  secondarySubstance,
  temperatureC,
  onSelectSubstance,
}) => {
  const [activeTab, setActiveTab] = useState<'vaporPressure' | 'propertyBars' | 'energyComparison'>('vaporPressure');
  const [barProperty, setBarProperty] = useState<'boilingPointC' | 'enthalpyVap' | 'polarizability' | 'dipoleMoment'>('boilingPointC');

  // Rango de temperatura para el gráfico Pvap vs T: [-190 °C a 120 °C]
  const minT = -190;
  const maxT = 120;
  const minP = 0;
  const maxP = 1000; // mmHg (1 atm = 760 mmHg)

  const chartW = 500;
  const chartH = 240;
  const padL = 50;
  const padR = 25;
  const padT = 20;
  const padB = 35;

  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const scaleX = (t: number) => padL + ((t - minT) / (maxT - minT)) * innerW;
  const scaleY = (p: number) => padT + innerH - (Math.min(maxP, Math.max(minP, p)) / maxP) * innerH;

  // Generar datos de curvas para todas las sustancias
  const allSubstances = Object.values(SUBSTANCES);

  const substanceColors: Record<SubstanceId, string> = {
    CH4: '#94A3B8', // gris pizarra
    HCl: '#10B981', // esmeralda
    NH3: '#3B82F6', // azul
    H2O: '#EF4444', // rojo carmesí
    C2H6: '#F59E0B', // ámbar
    C4H10: '#8B5CF6', // púrpura
  };

  // Puntos para cada curva
  const sampleStep = 4;
  const curves = allSubstances.map(sub => {
    const points: { x: number; y: number }[] = [];
    for (let t = Math.max(minT, sub.meltingPointC - 20); t <= Math.min(maxT, sub.boilingPointC + 25); t += sampleStep) {
      const p = calculateVaporPressure(sub, t);
      if (p <= maxP + 100) {
        points.push({ x: scaleX(t), y: scaleY(p) });
      }
    }
    return {
      sub,
      points,
      color: substanceColors[sub.id],
      isPrimary: sub.id === activeSubstance.id,
      isSecondary: secondarySubstance ? sub.id === secondarySubstance.id : false,
    };
  });

  // Coordenadas actuales de la sustancia activa
  const currentP = calculateVaporPressure(activeSubstance, temperatureC);
  const currentX = scaleX(temperatureC);
  const currentY = scaleY(currentP);

  // Línea de 1 atm (760 mmHg)
  const y1Atm = scaleY(760);

  // Propiedades para el modo de barras
  const propertyLabels = {
    boilingPointC: {
      title: 'Temperatura de Ebullición Normal (Teb)',
      unit: '°C',
      desc: 'Medida directa de la energía requerida para vencer las fuerzas intermoleculares cohesivas en el líquido a 1 atm.',
      getValue: (s: SubstanceData) => s.boilingPointC,
      formatter: (val: number) => `${val} °C`,
      range: [-170, 110],
    },
    enthalpyVap: {
      title: 'Entalpía Molar de Vaporización (ΔHvap)',
      unit: 'kJ/mol',
      desc: 'Energía necesaria para separar completamente un mol de moléculas de la fase líquida a la fase gaseosa.',
      getValue: (s: SubstanceData) => s.enthalpyVap,
      formatter: (val: number) => `${val.toFixed(1)} kJ/mol`,
      range: [0, 45],
    },
    polarizability: {
      title: 'Polarizabilidad Molecular Electrónica (α)',
      unit: '×10⁻²⁴ cm³',
      desc: 'Facilidad con la que la nube de electrones se distorsiona para formar dipolos instantáneos (Fuerzas de London).',
      getValue: (s: SubstanceData) => s.polarizability,
      formatter: (val: number) => `${val.toFixed(2)}`,
      range: [0, 10],
    },
    dipoleMoment: {
      title: 'Momento Dipolar Permanente (μ)',
      unit: 'Debye (D)',
      desc: 'Magnitud de la asimetría de distribución de carga eléctrica originada por geometría y diferencias de electronegatividad.',
      getValue: (s: SubstanceData) => s.dipoleMoment,
      formatter: (val: number) => `${val.toFixed(2)} D`,
      range: [0, 2.2],
    },
  };

  const currentPropMeta = propertyLabels[barProperty];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
      {/* Selector de pestañas */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('vaporPressure')}
            className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'vaporPressure'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            Curvas Pvap vs T
          </button>
          <button
            onClick={() => setActiveTab('propertyBars')}
            className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'propertyBars'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 inline mr-1" />
            Comparación de Propiedades
          </button>
          <button
            onClick={() => setActiveTab('energyComparison')}
            className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'energyComparison'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 inline mr-1" />
            Balance Térmico (Ek vs Efim)
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: Curvas de Presión de Vapor vs Temperatura */}
      {activeTab === 'vaporPressure' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              Presión de Vapor (mmHg) en función de la Temperatura (°C)
            </span>
            <span className="text-[11px] text-slate-500">
              Cruce con la línea de 1 atm = Teb normal
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-auto select-none font-sans text-[10px]"
            >
              {/* Ejes y marcas de cuadrícula */}
              <rect x={padL} y={padT} width={innerW} height={innerH} fill="#F8FAFC" />

              {/* Líneas horizontales de presión */}
              {[0, 200, 400, 600, 760, 1000].map(p => {
                const y = scaleY(p);
                const is1Atm = p === 760;
                return (
                  <g key={p}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke={is1Atm ? '#E11D48' : '#E2E8F0'}
                      strokeWidth={is1Atm ? 1.5 : 1}
                      strokeDasharray={is1Atm ? '4,3' : undefined}
                    />
                    <text
                      x={padL - 6}
                      y={y + 3}
                      textAnchor="end"
                      fill={is1Atm ? '#E11D48' : '#64748B'}
                      fontWeight={is1Atm ? 'bold' : 'normal'}
                      fontFamily="monospace"
                    >
                      {p}
                    </text>
                  </g>
                );
              })}

              {/* Etiqueta destacada de 1 atm */}
              <text
                x={chartW - padR - 5}
                y={y1Atm - 4}
                textAnchor="end"
                fill="#E11D48"
                fontWeight="bold"
                fontSize="9"
              >
                1 atm (760 mmHg) = Pext normal
              </text>

              {/* Líneas verticales de temperatura */}
              {[-150, -100, -50, 0, 50, 100].map(t => {
                const x = scaleX(t);
                return (
                  <g key={t}>
                    <line
                      x1={x}
                      y1={padT}
                      x2={x}
                      y2={chartH - padB}
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={chartH - padB + 14}
                      textAnchor="middle"
                      fill="#64748B"
                      fontFamily="monospace"
                    >
                      {t}°
                    </text>
                  </g>
                );
              })}

              {/* Curvas de cada sustancia */}
              {curves.map(({ sub, points, color, isPrimary, isSecondary }) => {
                if (points.length < 2) return null;
                const pathD = points.reduce(
                  (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
                  ''
                );

                const isHighlighted = isPrimary || isSecondary;
                const strokeW = isPrimary ? 3.0 : isSecondary ? 2.5 : 1.2;
                const strokeOpacity = isHighlighted ? 1.0 : 0.35;

                return (
                  <g key={sub.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={color}
                      strokeWidth={strokeW}
                      strokeOpacity={strokeOpacity}
                    />
                    {/* Punto exacto de ebullición donde cruza 760 mmHg */}
                    <circle
                      cx={scaleX(sub.boilingPointC)}
                      cy={scaleY(760)}
                      r={isPrimary ? 4.5 : isSecondary ? 3.5 : 2.5}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Cursor vertical en la temperatura actual del slider */}
              {temperatureC >= minT && temperatureC <= maxT && (
                <g>
                  <line
                    x1={currentX}
                    y1={padT}
                    x2={currentX}
                    y2={chartH - padB}
                    stroke="#0F172A"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                  {/* Punto actual de la sustancia activa */}
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r="5"
                    fill="#0F172A"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Etiqueta con valor numérico */}
                  <rect
                    x={Math.min(chartW - padR - 70, Math.max(padL + 5, currentX - 35))}
                    y={Math.max(padT + 5, currentY - 24)}
                    width="70"
                    height="18"
                    rx="3"
                    fill="#0F172A"
                  />
                  <text
                    x={Math.min(chartW - padR - 35, Math.max(padL + 40, currentX))}
                    y={Math.max(padT + 17, currentY - 12)}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontFamily="monospace"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    {currentP > 999 ? '>1000' : currentP.toFixed(0)} mmHg
                  </text>
                </g>
              )}

              {/* Títulos de ejes */}
              <text
                x={chartW * 0.5}
                y={chartH - 4}
                textAnchor="middle"
                fill="#475569"
                fontWeight="500"
              >
                Temperatura (°C)
              </text>
              <text
                x={-chartH * 0.5}
                y="15"
                textAnchor="middle"
                fill="#475569"
                fontWeight="500"
                transform="rotate(-90)"
              >
                Pvap (mmHg)
              </text>
            </svg>
          </div>

          {/* Chips interactivos de leyenda */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {allSubstances.map(sub => {
              const isSelected = sub.id === activeSubstance.id;
              const isComp = secondarySubstance?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubstance && onSelectSubstance(sub.id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : isComp
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: substanceColors[sub.id] }}
                  ></span>
                  <span className="font-semibold">{sub.formula}</span>
                  <span className="text-slate-400 font-mono">({sub.boilingPointC}°C)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Comparación cuantitativa de barras */}
      {activeTab === 'propertyBars' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-800">
              Seleccionar Propiedad a Comparar:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded text-xs">
              <button
                onClick={() => setBarProperty('boilingPointC')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  barProperty === 'boilingPointC' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                P. Ebullición (Teb)
              </button>
              <button
                onClick={() => setBarProperty('enthalpyVap')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  barProperty === 'enthalpyVap' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                ΔHvap
              </button>
              <button
                onClick={() => setBarProperty('polarizability')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  barProperty === 'polarizability' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Polarizabilidad (α)
              </button>
              <button
                onClick={() => setBarProperty('dipoleMoment')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  barProperty === 'dipoleMoment' ? 'bg-white font-medium text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Dipolo (μ)
              </button>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-600 leading-normal">
            {currentPropMeta.desc}
          </p>

          {/* Gráfico de barras horizontales de las 6 sustancias */}
          <div className="space-y-2 pt-1">
            {allSubstances.map(sub => {
              const val = currentPropMeta.getValue(sub);
              const isSelected = sub.id === activeSubstance.id;
              const isComp = secondarySubstance?.id === sub.id;

              // Calcular ancho de barra
              let barWidth = 0;
              if (barProperty === 'boilingPointC') {
                // Escala de -185 a 105 °C
                barWidth = Math.max(5, ((val - -190) / 300) * 100);
              } else if (barProperty === 'enthalpyVap') {
                barWidth = Math.max(5, (val / 45) * 100);
              } else if (barProperty === 'polarizability') {
                barWidth = Math.max(5, (val / 9) * 100);
              } else if (barProperty === 'dipoleMoment') {
                barWidth = Math.max(5, (val / 2.0) * 100);
              }

              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubstance && onSelectSubstance(sub.id)}
                  className={`flex items-center gap-3 p-1.5 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100 border border-slate-300'
                      : isComp
                      ? 'bg-indigo-50/60 border border-indigo-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="w-16 shrink-0 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: substanceColors[sub.id] }}
                    ></span>
                    {sub.formula}
                  </div>

                  <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden relative border border-slate-200/60">
                    <div
                      className="h-full transition-all duration-300 rounded"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: substanceColors[sub.id],
                      }}
                    ></div>
                  </div>

                  <div className="w-24 text-right font-mono text-xs font-bold text-slate-800">
                    {currentPropMeta.formatter(val)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Balance Térmico Cuantitativo (Ek térmica vs Efim) */}
      {activeTab === 'energyComparison' && (
        <div className="space-y-3 text-xs">
          <div className="text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">
              ¿Por qué cambia el estado de agregación a nivel microscópico?
            </span>{' '}
            El estado físico es el resultado de la competencia termodinámica entre la{' '}
            <strong>energía cinética de agitación térmica</strong> (Ek ≈ kB · T, que tiende a dispersar las moléculas)
            y la <strong>energía potencial de cohesión intermolecular</strong> (EFIM, que tiende a mantenerlas unidas).
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-amber-50 border border-amber-200 rounded p-2.5">
              <span className="font-semibold text-amber-900 block text-xs">
                Energía Térmica Dispersiva (RT):
              </span>
              <div className="font-mono text-lg font-bold text-amber-800 mt-1">
                {(8.314 * (temperatureC + 273.15) / 1000).toFixed(2)}{' '}
                <span className="text-xs font-normal">kJ/mol</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Proporcional a T ({temperatureC} °C = {temperatureC + 273.15} K). Aumenta la velocidad y desordena.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
              <span className="font-semibold text-blue-900 block text-xs">
                Energía Cohesiva FIM (ΔHvap):
              </span>
              <div className="font-mono text-lg font-bold text-blue-800 mt-1">
                {activeSubstance.enthalpyVap.toFixed(2)}{' '}
                <span className="text-xs font-normal">kJ/mol</span>
              </div>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Para {activeSubstance.formula}: Pozo de potencial intermolecular atractivo a vencer para ebullir.
              </p>
            </div>
          </div>

          {/* Comparación de magnitudes */}
          <div className="bg-slate-50 rounded p-2.5 border border-slate-200 text-slate-600 text-[11.5px] space-y-1">
            <div>
              <span className="font-medium text-slate-800">Condición fenomenológica:</span>{' '}
              {temperatureC > activeSubstance.boilingPointC ? (
                <span className="text-rose-700 font-semibold">
                  T &gt; Teb: La energía cinética térmica supera ampliamente el pozo atractivo de las FIM. Las moléculas se dispersan ocupando todo el volumen (GAS).
                </span>
              ) : temperatureC < activeSubstance.meltingPointC ? (
                <span className="text-indigo-700 font-semibold">
                  T &lt; Tf: La energía térmica es insuficiente para perturbar las atracciones FIM. Las moléculas quedan ancladas en posiciones fijas de la red cristalina (SÓLIDO).
                </span>
              ) : (
                <span className="text-sky-700 font-semibold">
                  Tf ≤ T ≤ Teb: La agitación térmica permite a las moléculas fluir y deslizarse unas sobre otras sin escapar del pozo cohesivo (LÍQUIDO).
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
