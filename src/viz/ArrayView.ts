// =============================================================================
// ArrayView —— 带指针的一维数组（搜索/双指针/哈希）
// =============================================================================

import type { BarRole, Frame } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderArrayView(host: HTMLElement, data: NonNullable<Frame['array']>): void {
  injectOnce();
  host.classList.add('viz-arr');
  host.replaceChildren();

  const grid = document.createElement('div');
  grid.className = 'viz-arr__grid';
  const values = data.values;
  const roles = data.roles ?? [];
  for (let i = 0; i < values.length; i++) {
    const cell = document.createElement('div');
    cell.className = 'viz-arr__cell';
    const role: BarRole = roles[i] ?? 'default';
    if (role !== 'default') cell.style.borderColor = roleColor(role);
    cell.textContent = String(values[i]);
    grid.append(cell);
  }

  // 指针层：每个指针占一列
  const ptrLayer = document.createElement('div');
  ptrLayer.className = 'viz-arr__ptrs';
  const cols = values.length;
  for (const p of data.pointers) {
    if (p.index < 0 || p.index >= cols) continue;
    const span = document.createElement('div');
    span.className = 'viz-arr__ptr';
    span.textContent = p.label;
    span.style.gridColumnStart = String(p.index + 1);
    ptrLayer.append(span);
  }
  host.append(grid, ptrLayer);
}

export function hasArray(
  f: Frame | undefined,
): f is Frame & { array: NonNullable<Frame['array']> } {
  return !!f && !!f.array && f.array.values.length > 0;
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-arr { width:100%; display:flex; flex-direction:column; justify-content:center; gap:6px; }
.viz-arr__grid {
  display:grid; gap:6px;
  grid-template-columns: repeat(var(--cols, 12), 1fr);
}
.viz-arr__cell {
  min-height:48px; display:flex; align-items:center; justify-content:center;
  border:2px solid var(--border); border-radius:var(--radius-sm);
  font-family:var(--mono); background:var(--bg-elev-2); color:var(--ink);
  transition: border-color .12s ease, background .12s ease;
}
.viz-arr__ptrs { display:grid; gap:6px; grid-template-columns: repeat(var(--cols, 12), 1fr); }
.viz-arr__ptr {
  font-family:var(--mono); font-size:11px; color:var(--c-cyan);
  text-align:center; grid-row:1;
}
`;
  document.head.append(s);
}
