import React from 'react';

interface BatchQrCodeProps {
  batchCode: string;
  foodName?: string;
  weightKg?: number;
  nodeId?: string;
  size?: number;
}

export function BatchQrCode({
  batchCode,
  foodName,
  weightKg,
  nodeId = 'NODE 01',
  size = 140,
}: BatchQrCodeProps) {
  // Deterministic pattern generator based on batchCode
  const seed = batchCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gridSize = 21; // Standard QR Version 1 grid size

  // Generate matrix cells
  const isFinderPattern = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) return true;
    // Top-right
    if (r < 7 && c >= gridSize - 7) return true;
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) return true;
    return false;
  };

  const getFinderCell = (r: number, c: number) => {
    // Top-left finder
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right finder
    if (r < 7 && c >= gridSize - 7) {
      const cc = c - (gridSize - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    // Bottom-left finder
    if (r >= gridSize - 7 && c < 7) {
      const rr = r - (gridSize - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return false;
  };

  const cells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isFinderPattern(r, c)) {
        cells.push({ r, c, active: getFinderCell(r, c) });
      } else {
        // Pseudo-random pseudo-hashing for authentic QR appearance
        const pseudo = ((r * 17 + c * 31 + seed * 7) % 100) > 48;
        cells.push({ r, c, active: pseudo });
      }
    }
  }

  return (
    <div className="inline-block p-3.5 bg-white border border-[#ddd9cf] rounded-xs font-mono select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#ddd9cf] text-[9px] text-[#6f706a] uppercase">
        <span>SECURITY MATRIX</span>
        <span className="text-[#536b4f] font-bold">DIGITAL PASSPORT</span>
      </div>

      <div className="py-2.5 flex justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${gridSize} ${gridSize}`}
          className="shape-rendering-crispEdges"
        >
          <rect width={gridSize} height={gridSize} fill="#ffffff" />
          {cells.map(
            ({ r, c, active }) =>
              active && <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1c1d1b" />
          )}
        </svg>
      </div>

      <div className="pt-2 border-t border-[#ddd9cf] text-center space-y-0.5">
        <div className="font-bold text-xs text-[#1c1d1b] tracking-wider">{batchCode}</div>
        {foodName && <div className="text-[10px] text-[#6f706a] uppercase truncate">{foodName}</div>}
        {weightKg !== undefined && (
          <div className="text-[9px] text-[#536b4f] font-medium">
            NET {weightKg.toFixed(1)} KG &bull; {nodeId}
          </div>
        )}
      </div>
    </div>
  );
}
