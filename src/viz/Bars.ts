// =============================================================================
// Bars —— 数组 → 动画柱状图（排序/堆/选择）
// 每帧重绘。柱高按值归一化，颜色按 role。
// =============================================================================

import type { BarState, Frame } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderBars(host: HTMLElement, bars: BarState[]): void {
  injectOnce();
  host.classList.add('viz-bars');
  host.replaceChildren();

  const max = Math.max(1, ...bars.map((b) => b.value));
  const row = document.createElement('div');
  row.className = 'viz-bars__row';
  for (const b of bars) {
    const col = document.createElement('div');
    col.className = 'viz-bars__col';
    const bar = document.createElement('div');
    bar.className = 'viz-bars__bar';
    bar.style.height = `${(b.value / max) * 100}%`;
    bar.style.background = roleColor(b.role);
    const lab = document.createElement('span');
    lab.className = 'viz-bars__val';
    lab.textContent = b.label ?? String(b.value);
    col.append(bar, lab);
    row.append(col);
  }
  host.append(row);
}

/** 帧是否含 bars。 */
export function hasBars(f: Frame | undefined): f is Frame & { bars: BarState[] } {
  return !!f && Array.isArray(f.bars) && f.bars.length > 0;
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-bars { width:100%; height:100%; display:flex; align-items:flex-end; }
.viz-bars__row {
  display:flex; align-items:flex-end; gap:4px; width:100%; height:100%;
}
.viz-bars__col {
  flex:1; min-width:6px; height:100%; display:flex; flex-direction:column;
  justify-content:flex-end; align-items:center; gap:4px;
}
.viz-bars__bar {
  width:100%; min-height:4px; border-radius:3px 3px 0 0;
  transition: height .18s ease, background .12s ease;
}
.viz-bars__val { font-family:var(--mono); font-size:11px; color:var(--ink-faint); }
`;
  document.head.append(s);
}
