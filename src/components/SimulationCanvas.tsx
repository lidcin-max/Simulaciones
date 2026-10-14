import React, { useRef, useEffect, useState } from 'react';
import { SubstanceData, InteractionLine } from '../types/substance';
import { MoleculeParticle, SimulationState } from '../physics/molecularDynamics';

interface SimulationCanvasProps {
  simulationState: SimulationState;
  substance: SubstanceData;
  showLondon: boolean;
  showDipole: boolean;
  showHbond: boolean;
  showDipoleVector: boolean;
  showPartialCharges: boolean;
  onHoverMolecule?: (molecule: MoleculeParticle | null) => void;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  simulationState,
  substance,
  showLondon,
  showDipole,
  showHbond,
  showDipoleVector,
  showPartialCharges,
  onHoverMolecule,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredMolId, setHoveredMolId] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuste de DPI para renderizado ultra nítido
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Fondo del contenedor de simulación (estilo cámara de observación microscópica de laboratorio)
    ctx.fillStyle = '#0F172A'; // Fondo oscuro de alto contraste para visibilidad atómica y de enlaces
    ctx.fillRect(0, 0, width, height);

    // Rejilla sutil de referencia espacial (angstroms virtuales)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 1. DIBUJAR LÍNEAS DE INTERACCIÓN INTERMOLECULAR (FIM)
    const { interactions, molecules } = simulationState;

    for (const inter of interactions) {
      const isHovered =
        hoveredMolId !== null &&
        (inter.molIndexA === hoveredMolId || inter.molIndexB === hoveredMolId);

      ctx.save();
      if (inter.type === 'hbond') {
        // Puente de hidrógeno: línea punteada rosa/magenta distintiva
        ctx.strokeStyle = isHovered ? '#F43F5E' : 'rgba(244, 63, 94, 0.85)';
        ctx.lineWidth = isHovered ? 2.5 : 1.8;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(inter.x1, inter.y1);
        ctx.lineTo(inter.x2, inter.y2);
        ctx.stroke();

        // Pequeño marcador en el punto medio
        const midX = (inter.x1 + inter.x2) * 0.5;
        const midY = (inter.y1 + inter.y2) * 0.5;
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.arc(midX, midY, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (inter.type === 'dipole') {
        // Interacción dipolo-dipolo: línea a trazos cian
        ctx.strokeStyle = isHovered ? '#38BDF8' : 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = isHovered ? 2.0 : 1.4;
        ctx.setLineDash([6, 5]);

        ctx.beginPath();
        ctx.moveTo(inter.x1, inter.y1);
        ctx.lineTo(inter.x2, inter.y2);
        ctx.stroke();
      } else if (inter.type === 'london') {
        // Dispersión de London: trazos ámbar tenues
        ctx.strokeStyle = isHovered ? '#FBBF24' : 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = isHovered ? 1.6 : 1.0;
        ctx.setLineDash([3, 4]);

        ctx.beginPath();
        ctx.moveTo(inter.x1, inter.y1);
        ctx.lineTo(inter.x2, inter.y2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. DIBUJAR MOLÉCULAS
    for (const mol of molecules) {
      const isHighlighted = mol.id === hoveredMolId;
      ctx.save();
      ctx.translate(mol.x, mol.y);
      ctx.rotate(mol.angle);

      // Si está destacada, halo suave alrededor de la molécula
      if (isHighlighted) {
        ctx.beginPath();
        ctx.arc(0, 0, mol.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2A. Enlaces intramoleculares covalentes (BARRAS SÓLIDAS para NO confundir con FIM)
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.setLineDash([]); // Enlace covalente SIEMPRE continuo sólido

      for (const bond of substance.bonds) {
        const a1 = substance.atoms[bond.fromAtomIndex];
        const a2 = substance.atoms[bond.toAtomIndex];
        if (a1 && a2) {
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y);
          ctx.lineTo(a2.x, a2.y);
          ctx.stroke();
        }
      }

      // 2B. Átomos (esferas CPK con volumen y bordes)
      for (const atom of substance.atoms) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = atom.color;
        ctx.fill();
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Reflejo especular tenue para dar aspecto tridimensional a los átomos
        ctx.beginPath();
        ctx.arc(atom.x - atom.radius * 0.2, atom.y - atom.radius * 0.2, atom.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        // Etiqueta de carga parcial (δ+ o δ-)
        if (showPartialCharges && atom.chargeLabel) {
          ctx.fillStyle = atom.chargeLabel === 'δ-' ? '#FCA5A5' : '#93C5FD';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(atom.chargeLabel, atom.x, atom.y);
        }
        ctx.restore();
      }

      // 2C. Vector de momento dipolar molecular (μ)
      if (showDipoleVector && substance.isPolar && substance.dipoleVector) {
        const vx = substance.dipoleVector.x;
        const vy = substance.dipoleVector.y;
        const mag = Math.hypot(vx, vy);

        if (mag > 0) {
          ctx.save();
          ctx.strokeStyle = '#FDE047'; // Amarillo brillante para vector de dipolo
          ctx.fillStyle = '#FDE047';
          ctx.lineWidth = 2.0;

          // Flecha de dipolo (convención física/química hacia el polo negativo)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(vx, vy);
          ctx.stroke();

          // Cruz en la cola del dipolo (convención estándar de química)
          const tailSize = 4;
          const perpX = (-vy / mag) * tailSize;
          const perpY = (vx / mag) * tailSize;
          ctx.beginPath();
          ctx.moveTo(-perpX, -perpY);
          ctx.lineTo(perpX, perpY);
          ctx.stroke();

          // Punta de flecha
          const headAngle = Math.atan2(vy, vx);
          const arrowLen = 6;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(
            vx - arrowLen * Math.cos(headAngle - Math.PI / 6),
            vy - arrowLen * Math.sin(headAngle - Math.PI / 6)
          );
          ctx.lineTo(
            vx - arrowLen * Math.cos(headAngle + Math.PI / 6),
            vy - arrowLen * Math.sin(headAngle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }, [
    simulationState,
    substance,
    showLondon,
    showDipole,
    showHbond,
    showDipoleVector,
    showPartialCharges,
    hoveredMolId,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closest: MoleculeParticle | null = null;
    let minD = 28;

    for (const m of simulationState.molecules) {
      const d = Math.hypot(m.x - mouseX, m.y - mouseY);
      if (d < minD) {
        minD = d;
        closest = m;
      }
    }

    setHoveredMolId(closest ? closest.id : null);
    if (onHoverMolecule) {
      onHoverMolecule(closest);
    }
  };

  const handleMouseLeave = () => {
    setHoveredMolId(null);
    if (onHoverMolecule) {
      onHoverMolecule(null);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Leyenda overlay interactiva en el canvas */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded border border-slate-700/60 pointer-events-none">
        <span className="font-semibold text-slate-200">FIM activas:</span>
        {showLondon && (
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-3 border-b-2 border-dashed border-amber-400 inline-block"></span>
            London ({simulationState.activeLondonCount})
          </span>
        )}
        {showDipole && substance.isPolar && (
          <span className="flex items-center gap-1 text-sky-300">
            <span className="w-3 border-b-2 border-dashed border-sky-400 inline-block"></span>
            Dipolo ({simulationState.activeDipoleCount})
          </span>
        )}
        {showHbond && substance.canHydrogenBond && (
          <span className="flex items-center gap-1 text-rose-300">
            <span className="w-3 border-b-2 border-dotted border-rose-500 inline-block"></span>
            Puente H ({simulationState.activeHbondsCount})
          </span>
        )}
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">
          T: <span className="text-slate-200 font-mono font-medium">{simulationState.temperatureC} °C</span>
        </span>
      </div>

      {/* Nota científica flotante en la esquina inferior */}
      <div className="absolute bottom-2 left-2.5 text-[11px] text-slate-400 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800 pointer-events-none">
        <span className="text-slate-300 font-medium">Enlaces covalentes:</span> barras sólidas grises
        {' · '}
        <span className="text-slate-300 font-medium">Interacciones FIM:</span> líneas punteadas coloreadas
      </div>
    </div>
  );
};
