import React from 'react';
import { SubstanceData } from '../types/substance';
import { Atom, Scale, Zap, Info, Compass } from 'lucide-react';

interface SymbolicDataViewProps {
  substance: SubstanceData;
}

export const SymbolicDataView: React.FC<SymbolicDataViewProps> = ({ substance }) => {
  const { relativeForces } = substance;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      {/* Encabezado del Nivel Simbólico */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            Nivel Simbólico & Estructural
          </h3>
          <p className="text-xs text-slate-500">
            Fórmula, descriptores moleculares cuantitativos y desglose de fuerzas
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-base font-bold text-slate-900">
            {substance.formula}
          </span>
          <span className="block text-[11px] text-slate-500">
            {substance.iupacName}
          </span>
        </div>
      </div>

      {/* Matriz de descriptores moleculares cuantitativos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-50 rounded p-2 border border-slate-200/70">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            Masa Molar (M)
          </div>
          <div className="font-mono font-semibold text-slate-800 text-sm mt-0.5">
            {substance.molarMass}{' '}
            <span className="text-[10px] font-normal text-slate-500">g/mol</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded p-2 border border-slate-200/70">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-slate-400" />
            Momento Dipolar (μ)
          </div>
          <div className="font-mono font-semibold text-slate-800 text-sm mt-0.5">
            {substance.dipoleMoment.toFixed(2)}{' '}
            <span className="text-[10px] font-normal text-slate-500">Debye (D)</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {substance.isPolar ? 'Molécula polar' : 'No polar (μ = 0)'}
          </div>
        </div>

        <div className="bg-slate-50 rounded p-2 border border-slate-200/70">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Atom className="w-3 h-3 text-slate-400" />
            Polarizabilidad (α)
          </div>
          <div className="font-mono font-semibold text-slate-800 text-sm mt-0.5">
            {substance.polarizability}{' '}
            <span className="text-[10px] font-normal text-slate-500">×10⁻²⁴ cm³</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {substance.numElectrons} electrones totales
          </div>
        </div>

        <div className="bg-slate-50 rounded p-2 border border-slate-200/70">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            Geometría
          </div>
          <div className="font-semibold text-slate-800 text-[11px] mt-0.5 truncate" title={substance.geometryName}>
            {substance.geometryName}
          </div>
          {substance.bondAngleDegrees && (
            <div className="text-[10px] text-slate-400">
              Ángulo enlace: {substance.bondAngleDegrees}°
            </div>
          )}
        </div>
      </div>

      {/* Desglose cuantitativo de contribuciones de Fuerzas Intermoleculares */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">
            Contribución Relativa a la Cohesión Intermolecular (Líquido):
          </span>
          <span className="font-mono text-slate-600 text-[11px]">
            Energía total ≈ {substance.totalIntermolecularEnergyKJ} kJ/mol
          </span>
        </div>

        {/* Barra segmentada de fuerzas */}
        <div className="h-4 w-full bg-slate-100 rounded overflow-hidden flex border border-slate-200">
          {relativeForces.london > 0 && (
            <div
              className="bg-amber-400 transition-all duration-300"
              style={{ width: `${relativeForces.london}%` }}
              title={`Fuerzas de London: ${relativeForces.london}%`}
            ></div>
          )}
          {relativeForces.dipoleDipole > 0 && (
            <div
              className="bg-sky-500 transition-all duration-300"
              style={{ width: `${relativeForces.dipoleDipole}%` }}
              title={`Interacción Dipolo-Dipolo: ${relativeForces.dipoleDipole}%`}
            ></div>
          )}
          {relativeForces.hydrogenBond > 0 && (
            <div
              className="bg-rose-500 transition-all duration-300"
              style={{ width: `${relativeForces.hydrogenBond}%` }}
              title={`Puentes de Hidrógeno: ${relativeForces.hydrogenBond}%`}
            ></div>
          )}
        </div>

        {/* Leyenda de porcentajes de FIM */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0"></span>
            <div>
              <span className="text-slate-600 block text-[11px]">London</span>
              <span className="font-mono font-bold text-slate-900">
                {relativeForces.london}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0"></span>
            <div>
              <span className="text-slate-600 block text-[11px]">Dipolo-Dipolo</span>
              <span className="font-mono font-bold text-slate-900">
                {relativeForces.dipoleDipole}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0"></span>
            <div>
              <span className="text-slate-600 block text-[11px]">Puente H</span>
              <span className="font-mono font-bold text-slate-900">
                {relativeForces.hydrogenBond}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota didáctica universitaria contextual */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-md p-3 text-xs space-y-1.5 text-slate-700">
        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          Clave conceptual de Química General:
        </div>
        <p className="text-slate-600 leading-relaxed text-[11.5px]">
          {substance.didacticExplanation.keyFact}
        </p>
        <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
          <strong className="text-slate-700">Obstáculo didáctico frecuente:</strong>{' '}
          {substance.didacticExplanation.commonMisconception}
        </div>
      </div>
    </div>
  );
};
