import { InteractionLine, SubstanceData } from '../types/substance';

export interface MoleculeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // radians
  omega: number; // angular velocity (rad/s)
  mass: number;
  radius: number;
}

export interface SimulationState {
  substance: SubstanceData;
  temperatureC: number;
  molecules: MoleculeParticle[];
  interactions: InteractionLine[];
  containerWidth: number;
  containerHeight: number;
  
  // Real-time scientific metrics
  averageKineticEnergy: number; // scaled eV/mol equivalent
  averagePotentialEnergy: number;
  totalEnergy: number;
  activeHbondsCount: number;
  activeDipoleCount: number;
  activeLondonCount: number;
  cohesiveFraction: number; // fraction of molecules participating in clusters (0 to 1)
  simulatedTimePs: number; // picoseconds
}

/**
 * Inicializa las moléculas en una cuadrícula relajada para evitar superposiciones duras
 */
export function initializeMolecules(
  substance: SubstanceData,
  count: number,
  width: number,
  height: number,
  temperatureC: number
): MoleculeParticle[] {
  const molecules: MoleculeParticle[] = [];
  const tempK = Math.max(20, temperatureC + 273.15);
  
  // Velocidad térmica promedio dependiente de T y masa molar: v_th ~ sqrt(k_B * T / M)
  const baseSpeed = Math.sqrt(tempK / substance.molarMass) * 0.45;
  
  const cols = Math.ceil(Math.sqrt(count * (width / height)));
  const rows = Math.ceil(count / cols);
  const cellW = (width - 60) / cols;
  const cellH = (height - 60) / rows;
  
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (id >= count) break;
      const x = 30 + c * cellW + cellW * 0.5 + (Math.random() - 0.5) * 8;
      const y = 30 + r * cellH + cellH * 0.5 + (Math.random() - 0.5) * 8;
      const theta = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.7 + Math.random() * 0.6);
      const angle = Math.random() * Math.PI * 2;
      
      molecules.push({
        id: id++,
        x,
        y,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        angle: theta,
        omega: (Math.random() - 0.5) * baseSpeed * 0.1,
        mass: substance.molarMass,
        radius: substance.ljSigma * 0.5,
      });
    }
  }

  return molecules;
}

/**
 * Paso de integración de Dinámica Molecular (Velocity-Verlet con termostato Berendsen)
 */
export function stepSimulation(
  state: SimulationState,
  dt: number,
  toggles: {
    showLondon: boolean;
    showDipole: boolean;
    showHbond: boolean;
  }
): SimulationState {
  const { substance, temperatureC, containerWidth, containerHeight } = state;
  const molecules = state.molecules.map(m => ({ ...m }));
  const N = molecules.length;
  if (N === 0) return state;

  const tempK = Math.max(20, temperatureC + 273.15);
  const tbK = substance.boilingPointC + 273.15;
  const tmK = substance.meltingPointC + 273.15;

  // Fuerzas acumuladas por molécula
  const fx = new Float64Array(N);
  const fy = new Float64Array(N);
  const torques = new Float64Array(N);

  const interactions: InteractionLine[] = [];
  let londonCount = 0;
  let dipoleCount = 0;
  let hbondCount = 0;
  let totalPotentialEnergy = 0;
  let totalKineticEnergy = 0;

  // Constantes efectivas del modelo
  const sigma = substance.ljSigma;
  const epsilon = substance.ljEpsilon * 14.0; // Escalamiento para la simulación
  const rCut = sigma * 2.8;
  const rCutSq = rCut * rCut;

  // Interacciones por pares (i < j)
  for (let i = 0; i < N; i++) {
    const mi = molecules[i];

    for (let j = i + 1; j < N; j++) {
      const mj = molecules[j];
      const dx = mj.x - mi.x;
      const dy = mj.y - mi.y;
      const distSq = dx * dx + dy * dy;

      if (distSq > rCutSq || distSq < 1e-4) continue;

      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;

      // 1. Potencial de Lennard-Jones (dispersión de London + repulsión de Pauli)
      const sOverR = sigma / dist;
      const sOverR6 = Math.pow(sOverR, 6);
      const sOverR12 = sOverR6 * sOverR6;

      // Fuerza LJ = 24 * epsilon * (2*(sigma/r)^12 - (sigma/r)^6) / r
      // Positiva = repulsiva, Negativa = atractiva
      const fLJ = (24 * epsilon * (2 * sOverR12 - sOverR6)) / dist;
      const uLJ = 4 * epsilon * (sOverR12 - sOverR6);
      totalPotentialEnergy += uLJ;

      let pairFx = -fLJ * nx;
      let pairFy = -fLJ * ny;

      // Registrar línea de interacción London si es atractiva y relevante
      if (toggles.showLondon && dist < sigma * 2.0 && sOverR6 > 0.05) {
        londonCount++;
        interactions.push({
          id: `l_${i}_${j}`,
          molIndexA: i,
          molIndexB: j,
          x1: mi.x,
          y1: mi.y,
          x2: mj.x,
          y2: mj.y,
          type: 'london',
          strength: Math.min(1, sOverR6 * 1.5),
          energyKJ: substance.totalIntermolecularEnergyKJ * (substance.relativeForces.london / 100),
        });
      }

      // 2. Interacción Dipolo-Dipolo (para moléculas polares como HCl, NH3, H2O)
      if (substance.isPolar && substance.dipoleStrength > 0) {
        // Dirección de dipolo de cada molécula en el plano
        const dipAngleI = mi.angle + (substance.id === 'HCl' ? 0 : -Math.PI / 2);
        const dipAngleJ = mj.angle + (substance.id === 'HCl' ? 0 : -Math.PI / 2);
        const dipIx = Math.cos(dipAngleI);
        const dipIy = Math.sin(dipAngleI);
        const dipJx = Math.cos(dipAngleJ);
        const dipJy = Math.sin(dipAngleJ);

        // Producto escalar dipolo-dipolo y dipolo-radio
        const dotDip = dipIx * dipJx + dipIy * dipJy;
        const dotR_I = dipIx * nx + dipIy * ny;
        const dotR_J = dipJx * nx + dipJy * ny;

        // V_dd ~ (mu_i * mu_j / r^3) * (dotDip - 3 * dotR_I * dotR_J)
        const dipFactor = (substance.dipoleStrength * 18.0) / Math.max(10, Math.pow(dist / sigma, 3));
        const orientFactor = dotDip - 3 * dotR_I * dotR_J;
        const uDip = dipFactor * orientFactor;
        totalPotentialEnergy += uDip;

        // Fuerza dipolo orientacional
        const fDip = -3 * dipFactor * orientFactor / dist;
        pairFx += -fDip * nx;
        pairFy += -fDip * ny;

        // Torque sobre las orientaciones dipolares para alinearlas
        const torqueI = dipFactor * (dipIx * dipJy - dipIy * dipJx - 3 * dotR_J * (dipIx * ny - dipIy * nx));
        const torqueJ = dipFactor * (dipJx * dipIy - dipJy * dipIx - 3 * dotR_I * (dipJx * ny - dipJy * nx));
        torques[i] += torqueI * 0.05;
        torques[j] += torqueJ * 0.05;

        // Línea de interacción dipolo atractiva
        if (toggles.showDipole && orientFactor < -0.15 && dist < sigma * 2.2) {
          dipoleCount++;
          interactions.push({
            id: `d_${i}_${j}`,
            molIndexA: i,
            molIndexB: j,
            x1: mi.x,
            y1: mi.y,
            x2: mj.x,
            y2: mj.y,
            type: 'dipole',
            strength: Math.min(1, Math.abs(orientFactor) * 0.7),
            energyKJ: substance.totalIntermolecularEnergyKJ * (substance.relativeForces.dipoleDipole / 100),
          });
        }
      }

      // 3. Puente de Hidrógeno (para H2O y NH3)
      if (substance.canHydrogenBond && substance.hBondStrength > 0) {
        // En H2O o NH3: interacción direccional fuerte entre átomo aceptor (O o N con par libre)
        // y donor de H vecino
        const hBondDist = dist;
        const hBondDistOpt = sigma * 0.95;
        
        if (hBondDist < sigma * 1.5) {
          const deltaD = (hBondDist - hBondDistOpt) / (sigma * 0.3);
          const distFactor = Math.exp(-0.5 * deltaD * deltaD);

          // Dependencia angular: favorece orientación frontal entre donor y aceptor
          const relAngle = Math.abs(Math.sin((mi.angle - mj.angle) * 0.5));
          const angleFactor = Math.max(0, Math.cos(mi.angle - mj.angle));
          
          if (distFactor > 0.25) {
            const uHB = -substance.hBondStrength * 32.0 * distFactor * (0.4 + 0.6 * angleFactor);
            totalPotentialEnergy += uHB;

            // Fuerte fuerza atractiva de enlace de hidrógeno
            const fHB = -uHB * 0.08;
            pairFx += -fHB * nx;
            pairFy += -fHB * ny;

            // Torque de orientación hacia el puente de hidrógeno
            torques[i] += (mi.angle - mj.angle) * -0.06;
            torques[j] += (mj.angle - mi.angle) * -0.06;

            if (toggles.showHbond) {
              hbondCount++;
              interactions.push({
                id: `hb_${i}_${j}`,
                molIndexA: i,
                molIndexB: j,
                x1: mi.x,
                y1: mi.y,
                x2: mj.x,
                y2: mj.y,
                type: 'hbond',
                strength: Math.min(1, distFactor * (0.5 + 0.5 * angleFactor)),
                energyKJ: substance.totalIntermolecularEnergyKJ * (substance.relativeForces.hydrogenBond / 100),
              });
            }
          }
        }
      }

      // Aplicar tercera ley de Newton
      fx[i] += pairFx;
      fy[i] += pairFy;
      fx[j] -= pairFx;
      fy[j] -= pairFy;
    }
  }

  // Termostato Berendsen para acoplar la temperatura deseada
  // Calculamos la energía cinética actual:
  let currentEk = 0;
  for (let i = 0; i < N; i++) {
    const vSq = molecules[i].vx * molecules[i].vx + molecules[i].vy * molecules[i].vy;
    currentEk += 0.5 * molecules[i].mass * vSq;
  }
  const currentTempK = Math.max(1, (currentEk / N) * 12.0); // Factor de conversión a K

  // Factor de escala de velocidad del termostato: lambda = sqrt(1 + (dt/tau) * (T_target / T_current - 1))
  const tau = 0.15; // Tiempo de acoplamiento térmico
  const targetK = tempK;
  let lambda = 1.0;
  if (currentTempK > 0) {
    const ratio = targetK / currentTempK;
    lambda = Math.sqrt(Math.max(0.2, Math.min(3.0, 1 + (dt / tau) * (ratio - 1))));
  }

  // Actualizar posiciones y velocidades (Velocity-Verlet / Euler-Cromer)
  const padding = 20;
  let cohesiveCount = 0;

  for (let i = 0; i < N; i++) {
    const m = molecules[i];

    // Actualizar velocidades lineales con fuerza y termostato
    const ax = fx[i] / m.mass;
    const ay = fy[i] / m.mass;

    m.vx = (m.vx + ax * dt) * lambda;
    m.vy = (m.vy + ay * dt) * lambda;

    // Actualizar velocidad angular
    const alphaRot = torques[i] / (m.mass * 2.0);
    m.omega = (m.omega + alphaRot * dt) * 0.92; // amortiguamiento rotacional natural
    m.angle += m.omega * dt;

    // Actualizar posiciones
    m.x += m.vx * dt * 25.0;
    m.y += m.vy * dt * 25.0;

    // Rebotes contra las paredes del contenedor
    const r = m.radius;
    if (m.x < padding + r) {
      m.x = padding + r;
      m.vx = -m.vx * 0.85;
    } else if (m.x > containerWidth - padding - r) {
      m.x = containerWidth - padding - r;
      m.vx = -m.vx * 0.85;
    }

    if (m.y < padding + r) {
      m.y = padding + r;
      m.vy = -m.vy * 0.85;
    } else if (m.y > containerHeight - padding - r) {
      m.y = containerHeight - padding - r;
      m.vy = -m.vy * 0.85;
    }

    // Calcular energía cinética
    const vSq = m.vx * m.vx + m.vy * m.vy;
    totalKineticEnergy += 0.5 * m.mass * vSq;
  }

  // Medir qué fracción de moléculas están en "fase condensada" (cohesión)
  const participatingMols = new Set<number>();
  for (const inter of interactions) {
    participatingMols.add(inter.molIndexA);
    participatingMols.add(inter.molIndexB);
  }
  const cohesiveFraction = N > 0 ? participatingMols.size / N : 0;

  return {
    ...state,
    molecules,
    interactions,
    averageKineticEnergy: totalKineticEnergy / N,
    averagePotentialEnergy: totalPotentialEnergy / N,
    totalEnergy: (totalKineticEnergy + totalPotentialEnergy) / N,
    activeHbondsCount: hbondCount,
    activeDipoleCount: dipoleCount,
    activeLondonCount: londonCount,
    cohesiveFraction,
    simulatedTimePs: state.simulatedTimePs + dt * 10,
  };
}
