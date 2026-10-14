import React from 'react';
import { SubstanceData } from '../types/substance';
import { calculateVaporPressure, getAggregationState } from '../data/substances';
import { Thermometer, Gauge, Wind, AlertCircle } from 'lucide-react';

interface MacroscopicStateViewProps {
  substance: SubstanceData;
  temperatureC: number;
}

export const MacroscopicStateView: React.FC<MacroscopicStateViewProps> = ({
  substance,
  temperatureC,
}) => {
  const { state, stateLabel, relativeTempToBoiling } = getAggregationState(substance, temperatureC);
  const vaporPressureMmHg = calculateVaporPressure(substance, temperatureC);
  const vaporPressureAtm = vaporPressureMmHg / 760;

  // Clasificación cualitativa de volatilidad a la temperatura actual
  let volatilityLabel = 'Muy baja';
  let volatilityColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (vaporPressureMmHg > 760) {
    volatilityLabel = 'Ebullición activa / Fase gas';
    volatilityColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (vaporPressureMmHg > 400) {
    volatilityLabel = 'Muy alta volatilidad';
    volatilityColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (vaporPressureMmHg > 100) {
    volatilityLabel = 'Volatilidad moderada/alta';
    volatilityColor = 'text-amber-600 bg-amber-50/70 border-amber-200';
  } else if (vaporPressureMmHg > 20) {
    volatilityLabel = 'Volatilidad moderada';
    volatilityColor = 'text-sky-700 bg-sky-50 border-sky-200';
  } else {
    volatilityLabel = 'Volatilidad baja / condensa';
    volatilityColor = 'text-slate-700 bg-slate-50 border-slate-200';
  }

  // Progreso en escala termométrica respecto a Tf y Teb
  // Rango visible de referencia: [min(Tf - 30, -200), max(Teb + 40, 120)]
  const rangeMin = Math.min(-200, substance.meltingPointC - 20);
  const rangeMax = Math.max(120, substance.boilingPointC + 30);
  const totalSpan = rangeMax - rangeMin;

  const tfPercent = Math.max(0, Math.min(100, ((substance.meltingPointC - rangeMin) / totalSpan) * 100));
  const tebPercent = Math.max(0, Math.min(100, ((substance.boilingPointC - rangeMin) / totalSpan) * 100));
  const currentTempPercent = Math.max(0, Math.min(100, ((temperatureC - rangeMin) / totalSpan) * 100));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      {/* Encabezado del Nivel Macroscópico */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            Nivel Macroscópico (Fenomenológico)
          </h3>
          <p className="text-xs text-slate-500">
            Estado de agregación y equilibrio líquido-vapor a 1 atm
          </p>
        </div>
        <div className={`px-2.5 py-1 text-xs font-semibold rounded border ${volatilityColor}`}>
          {stateLabel.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Esquema visual del recipiente macroscópico con émbolo */}
        <div className="relative bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-col items-center justify-center min-h-[160px]">
          {/* Manómetro superior */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 mb-2 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-slate-500" />
            <span>Pman = 1.00 atm</span>
          </div>

          {/* Vaso de precipitados / cilindro cerrado con émbolo */}
          <div className="relative w-36 h-28 border-2 border-slate-400 border-t-0 rounded-b-lg bg-white overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Graduaciones del vaso */}
            <div className="absolute left-1 top-2 w-2 border-t border-slate-300"></div>
            <div className="absolute left-1 top-7 w-3 border-t border-slate-300"></div>
            <div className="absolute left-1 top-12 w-2 border-t border-slate-300"></div>
            <div className="absolute left-1 top-17 w-3 border-t border-slate-300"></div>

            {/* Espacio vapor / headspace */}
            <div className="flex-1 w-full relative flex items-center justify-center">
              {/* Densidad de vapor visual según Pvap */}
              {vaporPressureAtm > 0.05 && (
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    backgroundColor: state === 'gas' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.08)',
                    opacity: Math.min(1, Math.max(0.15, vaporPressureAtm * 0.7)),
                  }}
                >
                  {/* Partículas de vapor difusas */}
                  <div className="w-full h-full flex items-center justify-around opacity-40">
                    <span className="text-[10px] text-slate-400">···</span>
                    <span className="text-[10px] text-slate-400">···</span>
                  </div>
                </div>
              )}
              {state === 'gas' && (
                <span className="text-[11px] font-medium text-sky-800 z-10 bg-white/70 px-1 rounded">
                  Fase Vapor Completa
                </span>
              )}
            </div>

            {/* Fase condensada (Sólido o Líquido) */}
            {state === 'solid' && (
              <div className="h-16 w-full bg-slate-200/90 border-t-2 border-slate-400 flex items-center justify-center pattern-diagonal">
                <span className="text-[11px] font-semibold text-slate-700 bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
                  Red Cristalina (Sólido)
                </span>
              </div>
            )}

            {state === 'liquid' && (
              <div className="h-16 w-full bg-blue-100/80 border-t-2 border-sky-400 flex flex-col items-center justify-center relative">
                {/* Menisco cóncavo / ondulación */}
                <div className="absolute -top-1 w-full h-1.5 bg-sky-200/50 rounded-b-full"></div>
                <span className="text-[11px] font-semibold text-blue-900 bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
                  Líquido Condensado
                </span>
                {vaporPressureAtm >= 0.95 && (
                  <span className="text-[9px] text-rose-600 font-bold animate-pulse">
                    ¡Ebullición!
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Recipiente a Pext = 1 atm
          </div>
        </div>

        {/* Panel de Presión de Vapor y Volatilidad */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                Presión de Vapor (Pvap):
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {vaporPressureMmHg < 1
                  ? vaporPressureMmHg.toFixed(3)
                  : vaporPressureMmHg.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-500">mmHg</span>
              </span>
            </div>

            {/* Barra de presión respecto a 1 atm (760 mmHg) */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 relative">
              <div
                className={`h-full transition-all duration-300 ${
                  vaporPressureAtm >= 1
                    ? 'bg-rose-500'
                    : vaporPressureAtm > 0.5
                    ? 'bg-amber-500'
                    : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, (vaporPressureMmHg / 760) * 100)}%` }}
              ></div>
              {/* Marca fija de 1 atm */}
              <div
                className="absolute top-0 bottom-0 right-0 w-0.5 bg-slate-700"
                title="Pext = 1 atm (760 mmHg)"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
              <span>0 mmHg</span>
              <span>
                {vaporPressureAtm.toFixed(3)} atm
              </span>
              <span className="font-semibold text-slate-600">760 mmHg (1 atm)</span>
            </div>
          </div>

          {/* Estado de volatilidad y condición de ebullición */}
          <div className="bg-slate-50 rounded p-2.5 border border-slate-200/80 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Criterio de ebullición:</span>
              <span className="font-semibold text-slate-700">
                Pvap(T) = Pext (760 mmHg)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Teb normal (1 atm):</span>
              <span className="font-mono font-bold text-slate-900">
                {substance.boilingPointC} °C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tfusión normal:</span>
              <span className="font-mono text-slate-700">
                {substance.meltingPointC} °C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regla termométrica comparativa */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span className="flex items-center gap-1 font-medium">
            <Thermometer className="w-3.5 h-3.5 text-slate-500" />
            Posición Térmica Actual:
          </span>
          <span className="font-mono text-slate-900 font-semibold">
            {temperatureC > 0 ? `+${temperatureC}` : temperatureC} °C
            {relativeTempToBoiling < 0 ? (
              <span className="text-slate-500 font-normal ml-1">
                ({Math.abs(relativeTempToBoiling).toFixed(1)} °C por debajo de Teb)
              </span>
            ) : relativeTempToBoiling === 0 ? (
              <span className="text-rose-600 font-bold ml-1">
                (En el punto de ebullición)
              </span>
            ) : (
              <span className="text-amber-600 font-medium ml-1">
                ({relativeTempToBoiling.toFixed(1)} °C por encima de Teb)
              </span>
            )}
          </span>
        </div>

        {/* Barra de fases térmicas */}
        <div className="relative h-4 bg-slate-100 rounded-md border border-slate-200 overflow-hidden">
          {/* Zona sólida */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-indigo-100/70 border-r border-indigo-300"
            style={{ width: `${tfPercent}%` }}
            title={`Fase Sólida (< ${substance.meltingPointC} °C)`}
          ></div>
          {/* Zona líquida */}
          <div
            className="absolute top-0 bottom-0 bg-blue-100/70 border-r border-sky-400"
            style={{ left: `${tfPercent}%`, width: `${Math.max(0, tebPercent - tfPercent)}%` }}
            title={`Fase Líquida (${substance.meltingPointC} °C a ${substance.boilingPointC} °C)`}
          ></div>
          {/* Zona gas */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-rose-50/80"
            style={{ left: `${tebPercent}%` }}
            title={`Fase Gas / Vapor (> ${substance.boilingPointC} °C)`}
          ></div>

          {/* Marcador actual de temperatura */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-slate-900 shadow-md z-10 -ml-0.5"
            style={{ left: `${currentTempPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>{rangeMin} °C</span>
          <span className="text-indigo-700">Tf = {substance.meltingPointC} °C</span>
          <span className="text-rose-700">Teb = {substance.boilingPointC} °C</span>
          <span>+{rangeMax} °C</span>
        </div>
      </div>
    </div>
  );
};
