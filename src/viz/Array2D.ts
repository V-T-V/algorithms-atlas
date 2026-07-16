// =============================================================================
// Array2D —— 二维网格（DP 表/棋盘/迷宫）
// =============================================================================

import type { Cell, Frame } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderArray2D(host: HTMLElement, grid: Cell[][]): void {
  injectOnce();
  host.classList.add('viz-grid');
  host.replaceChildren();

  const rows = grid.length;
  const cols = rows > 0 ? (grid[0]?.length ?? 0) : 0;
  const wrap = document.createElement('div');
  wrap.className = 'viz-grid__inner';
  wrap.style.setProperty('--rows', String(rows));
  wrap.style.setProperty('--cols', String(cols));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r]?.[c];
      const div = document.createElement('div');
      div.className = 'viz-grid__cell';
      if (cell) {
        if (cell.role !== 'default') {
          div.style.background = roleColor(cell.role);
          div.style.color = '#0b0e12';
        }
        div.textContent = cell.v === undefined ? '' : String(cell.v);
      }
      wrap.append(div);
    }
  }
  host.append(wrap);
}

export function hasGrid(f: Frame | undefined): f is Frame & { array2d: Cell[][] } {
  return !!f && Array.isArray(f.array2d) && f.array2d.length > 0;
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-grid { width:100%; height:100%; display:flex; align-items:center; justify-content:center; overflow:auto; }
.viz-grid__inner {
  display:grid; gap:3px;
  grid-template-columns: repeat(var(--cols), minmax(26px, 1fr));
  grid-auto-rows: minmax(28px, auto);
}
.viz-grid__cell {
  min-width:26px; min-height:28px; padding:2px;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--mono); font-size:12px;
  background:var(--bg-elev-2); border-radius:4px; color:var(--ink);
  transition: background .12s ease, color .12s ease;
}
`;
  document.head.append(s);
}
