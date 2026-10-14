import { SubstanceData, SubstanceId } from '../types/substance';

/**
 * Constantes fisicoquímicas y parámetros de modelización para las 6 sustancias
 * Fuentes:
 * - NIST Chemistry WebBook (SRD 69)
 * - CRC Handbook of Chemistry and Physics (104th Edition)
 * - Atkins, P. & de Paula, J. Physical Chemistry
 */
export const SUBSTANCES: Record<SubstanceId, SubstanceData> = {
  CH4: {
    id: 'CH4',
    name: 'Metano',
    formula: 'CH₄',
    iupacName: 'Metano',
    molarMass: 16.04,
    dipoleMoment: 0.0,
    polarizability: 2.60,
    numElectrons: 10,
    meltingPointC: -182.5,
    boilingPointC: -161.5,
    enthalpyVap: 8.18,
    antoine: {
      A: 6.69561,
      B: 405.42,
      C: 267.777,
      tMinC: -182,
      tMaxC: -150,
    },
    relativeForces: {
      london: 100,
      dipoleDipole: 0,
      hydrogenBond: 0,
    },
    totalIntermolecularEnergyKJ: 8.2,
    geometryName: 'Tetraédrica (Td)',
    bondAngleDegrees: 109.5,
    isPolar: false,
    canHydrogenBond: false,
    atoms: [
      { element: 'C', x: 0, y: 0, radius: 14, color: '#334155' },
      { element: 'H', x: 0, y: -18, radius: 8, color: '#CBD5E1' },
      { element: 'H', x: 17, y: 8, radius: 8, color: '#CBD5E1' },
      { element: 'H', x: -17, y: 8, radius: 8, color: '#CBD5E1' },
      { element: 'H', x: 0, y: 15, radius: 8, color: '#94A3B8' }, // proyección 3D en 2D
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 2, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 3, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 4, order: 1 },
    ],
    ljSigma: 26,
    ljEpsilon: 1.0,
    dipoleStrength: 0,
    hBondStrength: 0,
    donorAtomIndices: [],
    acceptorAtomIndices: [],
    didacticExplanation: {
      keyFact: 'Molécula no polar simétrica con solo 10 electrones. Únicamente experimenta fuerzas de dispersión de London muy débiles.',
      whyBoilingPoint: 'Su temperatura de ebullición (-161.5 °C) es la más baja de los hidrocarburos considerados, ya que se requiere muy poca energía térmica para vencer sus débiles atracciones dispersivas transitorias.',
      commonMisconception: 'Creer que al tener 4 enlaces C-H polares la molécula es polar. La simetría tetraédrica provoca la anulación vectorial exacta de los momentos de enlace (μ = 0 D).',
    },
  },

  HCl: {
    id: 'HCl',
    name: 'Cloruro de hidrógeno',
    formula: 'HCl',
    iupacName: 'Clorano / Cloruro de hidrógeno',
    molarMass: 36.46,
    dipoleMoment: 1.08,
    polarizability: 2.63,
    numElectrons: 18,
    meltingPointC: -114.2,
    boilingPointC: -85.1,
    enthalpyVap: 16.15,
    antoine: {
      A: 6.95388,
      B: 742.66,
      C: 257.0,
      tMinC: -130,
      tMaxC: -70,
    },
    relativeForces: {
      london: 81,
      dipoleDipole: 19,
      hydrogenBond: 0,
    },
    totalIntermolecularEnergyKJ: 16.8,
    geometryName: 'Lineal',
    isPolar: true,
    canHydrogenBond: false,
    atoms: [
      { element: 'Cl', x: 8, y: 0, radius: 16, color: '#10B981', chargeLabel: 'δ-' },
      { element: 'H', x: -16, y: 0, radius: 8, color: '#CBD5E1', chargeLabel: 'δ+' },
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
    ],
    dipoleVector: { x: 22, y: 0 },
    ljSigma: 27,
    ljEpsilon: 1.6,
    dipoleStrength: 1.2,
    hBondStrength: 0,
    donorAtomIndices: [],
    acceptorAtomIndices: [],
    didacticExplanation: {
      keyFact: 'Presenta dipolo permanente (μ = 1.08 D) debido a la electronegatividad del cloro, pero NO forma puentes de hidrógeno.',
      whyBoilingPoint: 'Ebulle a -85.1 °C. Aunque tiene dipolo permanente, las fuerzas de dispersión de London representan ~81% de su energía cohesiva total debido a sus 18 electrones.',
      commonMisconception: 'Asumir que el HCl forma puentes de hidrógeno por tener halógeno unido a H. El Cl es demasiado grande y su nube electrónica es difusa, impidiendo la alta densidad de carga necesaria para el enlace de H (que solo ocurre con F, O y N).',
    },
  },

  NH3: {
    id: 'NH3',
    name: 'Amoníaco',
    formula: 'NH₃',
    iupacName: 'Azano / Amoníaco',
    molarMass: 17.03,
    dipoleMoment: 1.47,
    polarizability: 2.22,
    numElectrons: 10,
    meltingPointC: -77.7,
    boilingPointC: -33.3,
    enthalpyVap: 23.33,
    antoine: {
      A: 7.3605,
      B: 992.55,
      C: 230.38,
      tMinC: -80,
      tMaxC: -20,
    },
    relativeForces: {
      london: 45,
      dipoleDipole: 15,
      hydrogenBond: 40,
    },
    totalIntermolecularEnergyKJ: 24.5,
    geometryName: 'Piramidal trigonal (C3v)',
    bondAngleDegrees: 107.0,
    isPolar: true,
    canHydrogenBond: true,
    atoms: [
      { element: 'N', x: 0, y: -5, radius: 14, color: '#2563EB', chargeLabel: 'δ-' },
      { element: 'H', x: -14, y: 12, radius: 8, color: '#CBD5E1', chargeLabel: 'δ+' },
      { element: 'H', x: 14, y: 12, radius: 8, color: '#CBD5E1', chargeLabel: 'δ+' },
      { element: 'H', x: 0, y: 16, radius: 8, color: '#94A3B8', chargeLabel: 'δ+' },
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 2, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 3, order: 1 },
    ],
    dipoleVector: { x: 0, y: -24 },
    ljSigma: 25,
    ljEpsilon: 1.3,
    dipoleStrength: 1.6,
    hBondStrength: 2.8,
    donorAtomIndices: [1, 2, 3],
    acceptorAtomIndices: [0],
    didacticExplanation: {
      keyFact: 'Capaz de formar puentes de hidrógeno (N-H···:N) y posee momento dipolar neto de 1.47 D por su geometría piramidal con un par libre.',
      whyBoilingPoint: 'Su Teb (-33.3 °C) es notablemente superior al metano (-161.5 °C) con masa similar (17 vs 16 g/mol), evidenciando el salto energético producido por los puentes de hidrógeno.',
      commonMisconception: 'Creer que el NH₃ forma tantos puentes de hidrógeno como el agua. Al tener 3 átomos de H pero solo 1 par libre en el N, el amoníaco está "limitado por aceptores", promediando solo ~2 puentes de H por molécula.',
    },
  },

  H2O: {
    id: 'H2O',
    name: 'Agua',
    formula: 'H₂O',
    iupacName: 'Oxidano / Agua',
    molarMass: 18.02,
    dipoleMoment: 1.85,
    polarizability: 1.45,
    numElectrons: 10,
    meltingPointC: 0.0,
    boilingPointC: 100.0,
    enthalpyVap: 40.66,
    antoine: {
      A: 8.07131,
      B: 1730.63,
      C: 233.426,
      tMinC: 1,
      tMaxC: 100,
    },
    relativeForces: {
      london: 18,
      dipoleDipole: 9,
      hydrogenBond: 73,
    },
    totalIntermolecularEnergyKJ: 41.5,
    geometryName: 'Angular (C2v)',
    bondAngleDegrees: 104.5,
    isPolar: true,
    canHydrogenBond: true,
    atoms: [
      { element: 'O', x: 0, y: -5, radius: 15, color: '#DC2626', chargeLabel: 'δ-' },
      { element: 'H', x: -15, y: 10, radius: 8, color: '#F1F5F9', chargeLabel: 'δ+' },
      { element: 'H', x: 15, y: 10, radius: 8, color: '#F1F5F9', chargeLabel: 'δ+' },
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 2, order: 1 },
    ],
    dipoleVector: { x: 0, y: -26 },
    ljSigma: 24,
    ljEpsilon: 1.1,
    dipoleStrength: 2.0,
    hBondStrength: 4.8,
    donorAtomIndices: [1, 2],
    acceptorAtomIndices: [0],
    didacticExplanation: {
      keyFact: 'Presenta una estequiometría perfecta para enlaces de hidrógeno: 2 hidrógenos ácidos (donores) y 2 pares libres en el oxígeno (aceptores).',
      whyBoilingPoint: 'Posee una temperatura de ebullición excepcionalmente alta (100 °C) para una molécula de solo 18 g/mol debido a una red tridimensional cooperativa con hasta 4 puentes de H por molécula.',
      commonMisconception: 'Creer que el puente de hidrógeno es un enlace covalente intramolecular. Es una interacción electrostática/parcialmente covalente intermolecular atractiva entre moléculas vecinas.',
    },
  },

  C2H6: {
    id: 'C2H6',
    name: 'Etano',
    formula: 'C₂H₆',
    iupacName: 'Etano',
    molarMass: 30.07,
    dipoleMoment: 0.0,
    polarizability: 4.47,
    numElectrons: 18,
    meltingPointC: -182.8,
    boilingPointC: -88.6,
    enthalpyVap: 14.69,
    antoine: {
      A: 6.80266,
      B: 656.4,
      C: 256.0,
      tMinC: -180,
      tMaxC: -70,
    },
    relativeForces: {
      london: 100,
      dipoleDipole: 0,
      hydrogenBond: 0,
    },
    totalIntermolecularEnergyKJ: 15.0,
    geometryName: 'Lineal simétrica en centros C-C (D3d/D3h)',
    bondAngleDegrees: 109.5,
    isPolar: false,
    canHydrogenBond: false,
    atoms: [
      { element: 'C', x: -10, y: 0, radius: 13, color: '#334155' },
      { element: 'C', x: 10, y: 0, radius: 13, color: '#334155' },
      { element: 'H', x: -22, y: -10, radius: 7, color: '#CBD5E1' },
      { element: 'H', x: -22, y: 10, radius: 7, color: '#CBD5E1' },
      { element: 'H', x: -10, y: -16, radius: 7, color: '#94A3B8' },
      { element: 'H', x: 22, y: -10, radius: 7, color: '#CBD5E1' },
      { element: 'H', x: 22, y: 10, radius: 7, color: '#CBD5E1' },
      { element: 'H', x: 10, y: 16, radius: 7, color: '#94A3B8' },
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 2, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 3, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 4, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 5, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 6, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 7, order: 1 },
    ],
    ljSigma: 32,
    ljEpsilon: 1.8,
    dipoleStrength: 0,
    hBondStrength: 0,
    donorAtomIndices: [],
    acceptorAtomIndices: [],
    didacticExplanation: {
      keyFact: 'Homólogo superior al metano: duplica el número de carbonos y electrones (18 vs 10 e⁻), incrementando notablemente la polarizabilidad electrónica.',
      whyBoilingPoint: 'Su Teb es -88.6 °C, casi 73 °C más alta que la del metano (-161.5 °C). Como ambas son no polares, este aumento drástico se debe exclusivamente al fortalecimiento de las fuerzas de London.',
      commonMisconception: 'Pensar que las moléculas no polares siempre son gases con puntos de ebullición bajísimos. A medida que la masa y el volumen crecen, las fuerzas de London pueden superar a fuerzas dipolares de moléculas más chicas.',
    },
  },

  C4H10: {
    id: 'C4H10',
    name: 'Butano',
    formula: 'C₄H₁₀',
    iupacName: 'Butano',
    molarMass: 58.12,
    dipoleMoment: 0.0,
    polarizability: 8.20,
    numElectrons: 34,
    meltingPointC: -138.4,
    boilingPointC: -0.5,
    enthalpyVap: 22.44,
    antoine: {
      A: 6.80896,
      B: 935.86,
      C: 238.73,
      tMinC: -70,
      tMaxC: 20,
    },
    relativeForces: {
      london: 100,
      dipoleDipole: 0,
      hydrogenBond: 0,
    },
    totalIntermolecularEnergyKJ: 23.0,
    geometryName: 'Cadena abierta en zigzag (conformaciones anti/gauche)',
    bondAngleDegrees: 109.5,
    isPolar: false,
    canHydrogenBond: false,
    atoms: [
      { element: 'C', x: -27, y: 7, radius: 12, color: '#334155' },
      { element: 'C', x: -9, y: -7, radius: 12, color: '#334155' },
      { element: 'C', x: 9, y: 7, radius: 12, color: '#334155' },
      { element: 'C', x: 27, y: -7, radius: 12, color: '#334155' },
      { element: 'H', x: -36, y: 14, radius: 6, color: '#CBD5E1' },
      { element: 'H', x: -27, y: -3, radius: 6, color: '#94A3B8' },
      { element: 'H', x: -27, y: 17, radius: 6, color: '#CBD5E1' },
      { element: 'H', x: -9, y: -17, radius: 6, color: '#CBD5E1' },
      { element: 'H', x: -9, y: 3, radius: 6, color: '#94A3B8' },
      { element: 'H', x: 9, y: 17, radius: 6, color: '#CBD5E1' },
      { element: 'H', x: 9, y: -3, radius: 6, color: '#94A3B8' },
      { element: 'H', x: 36, y: -14, radius: 6, color: '#CBD5E1' },
      { element: 'H', x: 27, y: 3, radius: 6, color: '#94A3B8' },
      { element: 'H', x: 27, y: -17, radius: 6, color: '#CBD5E1' },
    ],
    bonds: [
      { fromAtomIndex: 0, toAtomIndex: 1, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 2, order: 1 },
      { fromAtomIndex: 2, toAtomIndex: 3, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 4, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 5, order: 1 },
      { fromAtomIndex: 0, toAtomIndex: 6, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 7, order: 1 },
      { fromAtomIndex: 1, toAtomIndex: 8, order: 1 },
      { fromAtomIndex: 2, toAtomIndex: 9, order: 1 },
      { fromAtomIndex: 2, toAtomIndex: 10, order: 1 },
      { fromAtomIndex: 3, toAtomIndex: 11, order: 1 },
      { fromAtomIndex: 3, toAtomIndex: 12, order: 1 },
      { fromAtomIndex: 3, toAtomIndex: 13, order: 1 },
    ],
    ljSigma: 42,
    ljEpsilon: 2.6,
    dipoleStrength: 0,
    hBondStrength: 0,
    donorAtomIndices: [],
    acceptorAtomIndices: [],
    didacticExplanation: {
      keyFact: 'Cadena hidrocarbonada con gran superficie de contacto y alta polarizabilidad (8.2 × 10⁻²⁴ cm³ con 34 e⁻).',
      whyBoilingPoint: 'Ebulle a -0.5 °C (casi a temperatura ambiente de congelación del agua). Sus intensas fuerzas de dispersión de London superan incluso el punto de ebullición del HCl (-85 °C) y del NH₃ (-33 °C), mostrando que la acumulación de interacciones de London en moléculas grandes puede sobrepasar a fuerzas dipolares de moléculas menores.',
      commonMisconception: 'Creer que "el puente de hidrógeno o dipolo siempre es más fuerte que London". En sustancias reales, una molécula no polar con suficiente masa y superficie (como el butano vs HCl o NH₃) puede tener mayor cohesión total que una polar pequeña.',
    },
  },
};

export const SUBSTANCE_LIST = Object.values(SUBSTANCES);

/**
 * Calcula la presión de vapor (mmHg) para una sustancia dada a una temperatura en °C
 * Usando la ecuación de Antoine o extrapolación termodinámica de Clausius-Clapeyron
 */
export function calculateVaporPressure(substance: SubstanceData, tempC: number): number {
  const tempK = tempC + 273.15;
  const tbK = substance.boilingPointC + 273.15;
  const R = 8.31446; // J/(mol K)

  // Si está dentro o cerca del rango experimental de Antoine:
  const { A, B, C } = substance.antoine;
  const antoineP = Math.pow(10, A - B / (tempC + C));

  if (!isNaN(antoineP) && isFinite(antoineP) && antoineP > 0 && tempC >= substance.antoine.tMinC - 40 && tempC <= substance.antoine.tMaxC + 50) {
    return Math.max(0.01, Math.min(7600, antoineP));
  }

  // Extrapolación de Clausius-Clapeyron: ln(P/P0) = -(ΔHvap / R) * (1/T - 1/Tb)
  // con P0 = 760 mmHg a Tb
  const deltaH_J = substance.enthalpyVap * 1000;
  const exponent = -(deltaH_J / R) * (1 / tempK - 1 / tbK);
  const p = 760 * Math.exp(Math.max(-20, Math.min(5, exponent)));
  return Math.max(0.001, Math.min(10000, p));
}

/**
 * Determina el estado de agregación macroscópico a la temperatura dada a 1 atm
 */
export function getAggregationState(substance: SubstanceData, tempC: number): {
  state: 'solid' | 'liquid' | 'gas';
  stateLabel: string;
  relativeTempToBoiling: number; // T - Teb
} {
  if (tempC < substance.meltingPointC) {
    return {
      state: 'solid',
      stateLabel: 'Sólido',
      relativeTempToBoiling: tempC - substance.boilingPointC,
    };
  }
  if (tempC <= substance.boilingPointC) {
    return {
      state: 'liquid',
      stateLabel: 'Líquido',
      relativeTempToBoiling: tempC - substance.boilingPointC,
    };
  }
  return {
    state: 'gas',
    stateLabel: 'Gas / Vapor',
    relativeTempToBoiling: tempC - substance.boilingPointC,
  };
}
