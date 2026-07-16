// =============================================================================
// CodeTrace —— 源码 + 当前高亮行
// 调用方通过 Vite 的 ?raw 把 impl.ts 源码以字符串导入，传给本组件。
// frame.highlightLines 决定高亮哪些行。
// =============================================================================

import type { Frame } from '../types.ts';

export interface CodeTraceOptions {
  /** 源码文本（多行）。 */
  source: string;
  /** 当前帧。 */
  frame: Frame | undefined;
}

export function renderCodeTrace(host: HTMLElement, opts: CodeTraceOptions): void {
  injectOnce();
  host.classList.add('viz-code');
  host.replaceChildren();

  const lines = opts.source.split('\n');
  const hl = new Set(opts.frame?.highlightLines ?? []);
  const ol = document.createElement('div');
  ol.className = 'viz-code__list';
  lines.forEach((line, i) => {
    const n = i + 1;
    const row = document.createElement('div');
    row.className = 'viz-code__row' + (hl.has(n) ? ' is-hl' : '');
    const num = document.createElement('span');
    num.className = 'viz-code__num';
    num.textContent = String(n);
    const code = document.createElement('span');
    code.className = 'viz-code__src';
    code.textContent = line || ' ';
    row.append(num, code);
    ol.append(row);
  });
  host.append(ol);
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-code { width:100%; max-height:100%; overflow:auto; background:var(--bg); border-radius:var(--radius-sm); }
.viz-code__list { font-family:var(--mono); font-size:12px; }
.viz-code__row { display:flex; gap:8px; padding:0 8px; line-height:1.7; }
.viz-code__row.is-hl { background:var(--v-compare); color:#0b0e12; }
.viz-code__num { color:var(--ink-faint); min-width:24px; text-align:right; user-select:none; }
.viz-code__src { white-space:pre; }
.viz-code__row.is-hl .viz-code__num { color:#0b0e12; }
`;
  document.head.append(s);
}
