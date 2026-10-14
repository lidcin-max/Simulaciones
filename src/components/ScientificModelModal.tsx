import React from 'react';
import { SUBSTANCES } from '../data/substances';
import { X, BookOpen, AlertTriangle, CheckCircle2, FileText, Database } from 'lucide-react';

interface ScientificModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificModelModal: React.FC<ScientificModelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Modelo Científico: Fundamentos, Ecuaciones, Parámetros y Limitaciones
              </h2>
              <p className="text-xs text-slate-500">
                Documentación metodológica y física para estudiantes y docentes universitarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* 1. Marco epistemológico y niveles de representación */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-indigo-600 font-mono">1.</span> Marco Epistemológico: El Triángulo de Johnstone
            </h3>
            <p className="text-xs text-slate-600">
              La didáctica de la química establece que el aprendizaje significativo requiere la articulación explícita
              entre tres niveles de representación:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside bg-slate-50 p-3 rounded border border-slate-200">
              <li>
                <strong className="text-slate-900">Nivel Macroscópico:</strong> Fenómenos directamente observables:
                estado de agregación (sólido, líquido, gas), temperatura de ebullición normal, volatilidad relativa y
                presión de vapor medida en un manómetro a 1 atm.
              </li>
              <li>
                <strong className="text-slate-900">Nivel Submicroscópico:</strong> Entidades corpusculares (átomos y moléculas)
                con geometría espacial, distribución de carga electrónica, movimiento térmico y fuerzas intermoleculares
                atractivas y repulsivas en tiempo real.
              </li>
              <li>
                <strong className="text-slate-900">Nivel Simbólico:</strong> Fórmulas químicas, geometría molecular, momentos
                dipolares (μ en Debye), polarizabilidad electrónica (α), balances energéticos y curvas termodinámicas.
              </li>
            </ul>
          </section>

          {/* 2. Distinción rigurosa de Fuerzas Intermoleculares */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-indigo-600 font-mono">2.</span> Distinción Científica de las Interacciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-amber-50/60 border border-amber-200 rounded p-3">
                <span className="font-bold text-amber-900 block mb-1">Fuerzas de Dispersión de London</span>
                <p className="text-amber-800 leading-relaxed text-[11.5px]">
                  Presentes en <strong>todas</strong> las moléculas sin excepción. Surgen de fluctuaciones cuánticas instantáneas
                  en la densidad electrónica que inducen dipolos transitorios en moléculas vecinas. Su intensidad depende directamente
                  de la <strong>polarizabilidad electrónica (α)</strong>, el número total de electrones y el área superficial molecular.
                </p>
              </div>

              <div className="bg-sky-50/60 border border-sky-200 rounded p-3">
                <span className="font-bold text-sky-900 block mb-1">Interacciones Dipolo-Dipolo (Keesom)</span>
                <p className="text-sky-800 leading-relaxed text-[11.5px]">
                  Exclusivas de moléculas con <strong>momento dipolar permanente neto (μ &gt; 0)</strong> no nulo, como HCl, NH₃ y H₂O.
                  Atracción electrostática entre densidades de carga parcial positiva (δ⁺) y negativa (δ⁻). Requiere orientación angular
                  favorable frente a la agitación térmica desorientadora.
                </p>
              </div>

              <div className="bg-rose-50/60 border border-rose-200 rounded p-3">
                <span className="font-bold text-rose-900 block mb-1">Puente de Hidrógeno</span>
                <p className="text-rose-800 leading-relaxed text-[11.5px]">
                  Caso particular extremadamente intenso y <strong>direccional</strong> de interacción intermolecular. Ocurre cuando
                  un átomo de H enlazado a un átomo muy electronegativo y de radio atómico pequeño (F, O, N) interactúa con un par
                  electrónico solitario de otro átomo vecino. Presenta carácter electrostático dominante con transferencia de carga parcial.
                </p>
              </div>
            </div>

            <div className="bg-slate-100 p-2.5 rounded text-xs text-slate-700 border border-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Regla de oro:</strong> Ninguna sustancia posee un único tipo de fuerza. Incluso en sustancias polares
                como el HCl, las fuerzas de dispersión de London aportan ~81% de la cohesión total.
              </span>
            </div>
          </section>

          {/* 3. Ecuaciones del modelo computacional */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-indigo-600 font-mono">3.</span> Ecuaciones del Modelo de Dinámica Submicroscópica
            </h3>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  A. Potencial de Lennard-Jones (12-6) para Dispersión y Repulsión de Pauli:
                </span>
                <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 my-1">
                  V_LJ(r) = 4 · ε · [ (σ / r)¹² - (σ / r)⁶ ]
                </code>
                <p className="text-slate-600 mt-1">
                  Donde <code className="font-mono">σ</code> representa el diámetro de colisión de van der Waals de la molécula,
                  y <code className="font-mono">ε</code> es la profundidad del pozo de potencial, proporcional a la polarizabilidad electrónica α.
                  El término <code className="font-mono">r⁻⁶</code> modela la atracción atractiva de London, mientras que <code className="font-mono">r⁻¹²</code>
                  modela la repulsión de Pauli por superposición de capas electrónicas cerradas.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  B. Interacción Dipolo-Dipolo Orientacional (Keesom):
                </span>
                <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 my-1">
                  V_dd(r, θ₁, θ₂) = - (μ₁ · μ₂ / [4πε₀ · r³]) · [ 2 cos θ₁ cos θ₂ - sin θ₁ sin θ₂ ]
                </code>
                <p className="text-slate-600 mt-1">
                  Genera una fuerza central atractiva/repulsiva y un torque <code className="font-mono">τ = μ × E</code> que alinea
                  las orientaciones dipolares contra el desorden térmico.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  C. Potencial de Puente de Hidrógeno Direccional:
                </span>
                <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 my-1">
                  V_HB(r, θ) = - V₀ · exp( - (r - r_opt)² / [2 σ_HB²] ) · cos²(θ_D-H···A)
                </code>
                <p className="text-slate-600 mt-1">
                  Pozo de potencial profundo centrado en la distancia óptima de enlace de hidrógeno (<code className="font-mono">r_opt ≈ 2.7 Å</code>),
                  con estricta dependencia angular colineal para reproducir la geometría coordinada del agua y el amoníaco.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  D. Termostato de Velocidad de Berendsen:
                </span>
                <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 my-1">
                  λ = √[ 1 + (Δt / τ) · (T_deseada / T_actual - 1) ]
                </code>
                <p className="text-slate-600 mt-1">
                  Acopla el ensamble molecular al baño térmico fijado por el usuario mediante escalamiento de velocidades lineales y angulares,
                  garantizando que la energía cinética media cumpla el teorema de equipartición: <code className="font-mono">⟨Ek⟩ = ½ M ⟨v²⟩ = k_B · T</code>.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Tabla de parámetros experimentales */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-indigo-600 font-mono">4.</span> Parámetros Fisicoquímicos Tabulados (NIST / CRC Handbook)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Sustancia</th>
                    <th className="p-2">M (g/mol)</th>
                    <th className="p-2">e⁻</th>
                    <th className="p-2">μ (D)</th>
                    <th className="p-2">α (10⁻²⁴ cm³)</th>
                    <th className="p-2">Tf (°C)</th>
                    <th className="p-2">Teb (°C)</th>
                    <th className="p-2">ΔHvap (kJ/mol)</th>
                    <th className="p-2">London %</th>
                    <th className="p-2">Dipolo %</th>
                    <th className="p-2">Puente H %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {Object.values(SUBSTANCES).map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2 font-sans font-bold text-slate-900">{s.name} ({s.formula})</td>
                      <td className="p-2">{s.molarMass}</td>
                      <td className="p-2">{s.numElectrons}</td>
                      <td className="p-2">{s.dipoleMoment.toFixed(2)}</td>
                      <td className="p-2">{s.polarizability}</td>
                      <td className="p-2">{s.meltingPointC}</td>
                      <td className="p-2 font-semibold text-slate-900">{s.boilingPointC}</td>
                      <td className="p-2">{s.enthalpyVap}</td>
                      <td className="p-2 text-amber-700">{s.relativeForces.london}%</td>
                      <td className="p-2 text-sky-700">{s.relativeForces.dipoleDipole}%</td>
                      <td className="p-2 text-rose-700">{s.relativeForces.hydrogenBond}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Supuestos, simplificaciones y limitaciones */}
          <section className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              5. Supuestos, Simplificaciones y Limitaciones Didácticas
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>
                <strong>Dimensionalidad Bidimensional (2D):</strong> Las moléculas se representan en un plano bidimensional
                para evitar la oclusión visual que sufriría el estudiante en un modelo 3D denso de partículas. Las densidades
                de empaquetamiento y grados de libertad rotacionales son 2D efectivos.
              </li>
              <li>
                <strong>Cuerpos Rígidos (Rigid-Body):</strong> Las geometrías moleculares respetan los ángulos de enlace
                reales (104.5° para H₂O, 107° para NH₃, tetraedro/zigzag en alcanos), pero se tratan como cuerpos rígidos;
                no se modelan modos vibracionales intramoleculares de alta frecuencia (IR/Raman).
              </li>
              <li>
                <strong>Escala Temporal Pedagógica:</strong> En la realidad molecular, los choques y fluctuaciones transcurren
                en la escala de femtosegundos (10⁻¹⁵ s) a picosegundos (10⁻¹² s). La simulación visual desacelera la evolución
                a milisegundos perceptibles para permitir la observación analítica.
              </li>
              <li>
                <strong>Tamaño del Ensamble Estadístico (N):</strong> El número de moléculas simuladas (10 a 60) representa
                un <em>microvolumen de observación</em>, no una cantidad macroscópica de sustancia en moles (6.022 × 10²³ moléculas).
                Las propiedades macroscópicas (Teb, Pvap) se calculan analíticamente a partir de las ecuaciones de estado y
                parámetros termodinámicos experimentales validados.
              </li>
            </ul>
          </section>
        </div>

        {/* Pie del modal */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Entendido / Volver al Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
