// =============================================================================
// Steps / Aux / Map —— 辅助文字视图
//   - renderAux：递归栈 / 队列 / 一行行说明（aux）
//   - renderMap：键值表（哈希表 / 并查集）
// =============================================================================

import type { Frame } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderAux(host: HTMLElement, entries: NonNullable<Frame['aux']>): void {
  injectOnce();
  host.classList.add('viz-aux');
  host.replaceChildren();
  const ul = document.createElement('ul');
  ul.className = 'viz-aux__list';
  for (const e of entries) {
    const li = document.createElement('li');
    li.className = 'viz-aux__item';
    if (e.role) li.style.borderLeftColor = roleColor(e.role);
    const k = document.createElement('span');
    k.className = 'viz-aux__key';
    k.textContent = e.label;
    const v = document.createElement('span');
    v.className = 'viz-aux__val';
    v.textContent = e.value;
    li.append(k, v);
    ul.append(li);
  }
  host.append(ul);
}

export function hasAux(f: Frame | undefined): f is Frame & { aux: NonNullable<Frame['aux']> } {
  return !!f && Array.isArray(f.aux) && f.aux.length > 0;
}

export function renderMap(host: HTMLElement, entries: NonNullable<Frame['map']>): void {
  injectOnce();
  host.classList.add('viz-map');
  host.replaceChildren();
  const grid = document.createElement('div');
  grid.className = 'viz-map__grid';
  for (const e of entries) {
    const cell = document.createElement('div');
    cell.className = 'viz-map__cell';
    if (e.role) {
      cell.style.borderColor = roleColor(e.role);
    }
    const k = document.createElement('div');
    k.className = 'viz-map__k';
    k.textContent = e.key;
    const v = document.createElement('div');
    v.className = 'viz-map__v';
    v.textContent = e.value;
    cell.append(k, v);
    grid.append(cell);
  }
  host.append(grid);
}

export function hasMap(f: Frame | undefined): f is Frame & { map: NonNullable<Frame['map']> } {
  return !!f && Array.isArray(f.map) && f.map.length > 0;
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-aux { width:100%; max-height:100%; overflow:auto; }
.viz-aux__list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px; }
.viz-aux__item {
  display:flex; gap:8px; padding:4px 8px; border-left:3px solid var(--border);
  background:var(--bg-elev-2); border-radius:4px; font-family:var(--mono); font-size:12px;
}
.viz-aux__key { color:var(--ink-faint); }
.viz-aux__val { color:var(--ink); }

.viz-map { width:100%; }
.viz-map__grid { display:flex; flex-wrap:wrap; gap:6px; }
.viz-map__cell {
  min-width:54px; border:2px solid var(--border); border-radius:var(--radius-sm);
  background:var(--bg-elev-2); overflow:hidden;
}
.viz-map__k { font-size:10px; color:var(--ink-faint); padding:1px 6px; text-align:center; }
.viz-map__v { font-family:var(--mono); padding:2px 6px; text-align:center; color:var(--ink); }
`;
  document.head.append(s);
}
