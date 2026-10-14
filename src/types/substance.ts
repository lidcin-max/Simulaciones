export type SubstanceId = 'CH4' | 'HCl' | 'NH3' | 'H2O' | 'C2H6' | 'C4H10';

export type AggregationState = 'solid' | 'liquid' | 'gas';

export interface AtomCoord {
  element: 'H' | 'C' | 'N' | 'O' | 'Cl';
  x: number; // offset in angstrom-like units
  y: number;
  radius: number; // van der waals radius visual scale
  color: string;
  chargeLabel?: 'δ+' | 'δ-';
}

export interface IntramolecularBond {
  fromAtomIndex: number;
  toAtomIndex: number;
  order: 1 | 2;
}

export interface SubstanceData {
  id: SubstanceId;
  name: string;
  formula: string;
  iupacName: string;
  molarMass: number; // g/mol
  dipoleMoment: number; // Debye (D)
  polarizability: number; // x 10^-24 cm^3
  numElectrons: number;
  
  // Thermodynamic macroscopic constants (NIST / CRC Handbook)
  meltingPointC: number; // °C
  boilingPointC: number; // °C
  enthalpyVap: number; // kJ/mol
  
  // Antoine equation parameters: log10(P/mmHg) = A - (B / (T_C + C))
  // Valid around boiling point range
  antoine: {
    A: number;
    B: number;
    C: number;
    tMinC: number;
    tMaxC: number;
  };
  
  // Intermolecular force percentage contributions at liquid state
  relativeForces: {
    london: number; // %
    dipoleDipole: number; // %
    hydrogenBond: number; // %
  };
  
  // Approximate total cohesive intermolecular energy (kJ/mol)
  totalIntermolecularEnergyKJ: number;

  // Scientific molecular geometry
  geometryName: string;
  bondAngleDegrees?: number;
  isPolar: boolean;
  canHydrogenBond: boolean;

  // Submicroscopic visualization model
  atoms: AtomCoord[];
  bonds: IntramolecularBond[];
  dipoleVector?: { x: number; y: number }; // Direction and relative magnitude
  
  // Model parameters for 2D molecular dynamics
  ljSigma: number; // Effective collision diameter (nm/units)
  ljEpsilon: number; // Depth of London dispersion well (normalized energy units)
  dipoleStrength: number; // Dipole-dipole interaction magnitude
  hBondStrength: number; // Hydrogen bonding well depth
  donorAtomIndices: number[]; // e.g. H connected to O/N
  acceptorAtomIndices: number[]; // e.g. O or N with lone pair

  // Didactic insight explanation for general chemistry
  didacticExplanation: {
    keyFact: string;
    whyBoilingPoint: string;
    commonMisconception: string;
  };
}

export interface InteractionLine {
  id: string;
  molIndexA: number;
  molIndexB: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'london' | 'dipole' | 'hbond';
  strength: number; // 0 to 1
  energyKJ: number;
}
