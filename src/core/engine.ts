// =============================================================================
// 引擎：装载算法、建播放器、按帧驱动渲染。
// 负责把「算法的 Frame[]」与「viz 渲染」与「播放器」三者连起来，
// 并管理 DOM 挂载/卸载与 scoped CSS 注入。
// =============================================================================

import type { Demo, Frame } from '../types.ts';
import { Playback } from './playback.ts';
import { renderFrame } from '../viz/index.ts';

export interface EngineHandle {
  destroy: () => void;
}

export interface EngineDeps {
  /** 算法演示的舞台容器（viz 与播放控件渲染于此）。 */
  stage: HTMLElement;
  /** 主题强调色 CSS 变量名（来自分类 theme）。 */
  themeVar: string;
  /** 算法源码文本（可选，用于源码同步高亮）。 */
  source?: string;
}

/** 装载一个算法演示并启动播放器。返回销毁句柄。 */
export function mountAlgorithm(demo: Demo, deps: EngineDeps): EngineHandle {
  const { stage, themeVar, source } = deps;
  injectScopedCss('atlas-demo', demoCss(themeVar));

  const frames: Frame[] = demo.buildTrace(demo.meta.defaultInput);

  // 舞台布局：viz 区 + 控件区 + 解说区
  const wrap = el('div', 'demo');
  const viewport = el('div', 'demo__viewport');
  const note = el('div', 'demo__note');
  const controls = el('div', 'demo__controls');

  // 源码区（可折叠，与播放器联动高亮）
  let codeHost: HTMLElement | null = null;
  if (source) {
    codeHost = el('div', 'demo__code-host');
    const codeToggle = document.createElement('button');
    codeToggle.type = 'button';
    codeToggle.className = 'demo__code-toggle';
    codeToggle.textContent = '📄 源码';
    const codeContent = el('div', 'demo__code-content');
    codeContent.style.display = 'none';
    codeToggle.addEventListener('click', () => {
      const visible = codeContent.style.display !== 'none';
      codeContent.style.display = visible ? 'none' : 'block';
      codeToggle.textContent = visible ? '📄 源码' : '📄 隐藏源码';
    });
    renderSourceCode(codeContent, source, []);
    codeHost.append(codeToggle, codeContent);
  }

  wrap.append(viewport, note, controls);
  if (codeHost) wrap.append(codeHost);
  stage.replaceChildren(wrap);

  const playback = new Playback({ baseDelayMs: 460 });
  playback.onRender((i) => {
    const f = frames[i];
    renderFrame(viewport, f);
    note.textContent = f?.note ? `${f.note.zh}\n${f.note.en}` : '';
    // 源码同步高亮
    if (codeHost && source) {
      const codeContent = codeHost.querySelector('.demo__code-content') as HTMLElement;
      if (codeContent && codeContent.style.display !== 'none') {
        renderSourceCode(codeContent, source, f?.highlightLines ?? []);
      }
    }
  });
  buildControls(controls, playback);
  playback.load(frames);

  return {
    destroy() {
      playback.dispose();
      stage.replaceChildren();
    },
  };
}

// —— 控件条（播放/暂停/单步/重置/速度/进度）——
function buildControls(host: HTMLElement, pb: Playback): void {
  const btns = el('div', 'demo__btns');
  const reset = btn('⏮', '重置', () => pb.reset());
  const back = btn('◀', '上一帧', () => pb.stepBack());
  const play = btn('▶', '播放/暂停', () => pb.toggle());
  const fwd = btn('▶', '下一帧', () => pb.stepForward());
  btns.append(reset, back, play, fwd);

  const speed = document.createElement('select');
  speed.className = 'demo__speed';
  for (const s of [0.25, 0.5, 1, 1.5, 2, 4]) {
    const o = document.createElement('option');
    o.value = String(s);
    o.textContent = `${s}x`;
    if (s === 1) o.selected = true;
    speed.append(o);
  }
  speed.addEventListener('change', () => pb.setSpeed(Number(speed.value)));

  const progress = document.createElement('input');
  progress.type = 'range';
  progress.className = 'demo__progress';
  progress.min = '0';
  progress.max = String(Math.max(0, pb.total - 1));
  progress.value = '0';
  progress.addEventListener('input', () => pb.seek(Number(progress.value)));

  const counter = el('span', 'demo__counter', '0 / 0');

  host.append(btns, speed, progress, counter);

  const unsubTick = pb.onTickEvent((i, total) => {
    progress.max = String(Math.max(0, total - 1));
    progress.value = String(i);
    counter.textContent = `${i + 1} / ${total}`;
  });
  const unsubPlay = pb.onPlayStateEvent((p) => {
    play.textContent = p ? '⏸' : '▶';
  });

  // 把取消订阅挂到 host 上，销毁时由 stage.replaceChildren 触发不了；
  // 这里用 Playback 自身的 dispose 清理回调集合即可。
  void unsubTick;
  void unsubPlay;
}

// —— 小工具 ——
function renderSourceCode(host: HTMLElement, source: string, highlightLines: number[]): void {
  host.replaceChildren();
  const hlSet = new Set(highlightLines);
  const lines = source.split('\n');
  const ol = document.createElement('div');
  ol.className = 'demo__code-list';
  for (let i = 0; i < lines.length; i++) {
    const n = i + 1;
    const row = document.createElement('div');
    row.className = 'demo__code-row' + (hlSet.has(n) ? ' is-hl' : '');
    const num = document.createElement('span');
    num.className = 'demo__code-num';
    num.textContent = String(n);
    const code = document.createElement('span');
    code.className = 'demo__code-src';
    code.textContent = lines[i] || ' ';
    row.append(num, code);
    ol.append(row);
  }
  host.append(ol);
}

function el(tag: string, cls: string, text?: string): HTMLElement {
  const e = document.createElement(tag);
  e.className = cls;
  if (text) e.textContent = text;
  return e;
}
function btn(label: string, title: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'demo__btn';
  b.textContent = label;
  b.title = title;
  b.addEventListener('click', onClick);
  return b;
}

// —— scoped CSS 注入（同 kids-games：唯一 id 守卫，惰性注入）——
function injectScopedCss(id: string, css: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.append(s);
}

function demoCss(themeVar: string): string {
  return `
.demo { display:flex; flex-direction:column; gap:var(--gap); }
.demo__viewport {
  min-height: 360px; padding: var(--gap); border-radius: var(--radius);
  background: var(--bg-elev); border:1px solid var(--border); box-shadow: var(--shadow-sm);
  display:flex; align-items:flex-end; justify-content:center; overflow:hidden;
}
.demo__note {
  font-family: var(--mono); font-size: 13px; color: var(--ink-dim);
  min-height: 2.4em; white-space: pre-line; padding: 0 var(--gap-sm);
  border-left: 3px solid var(${themeVar}); padding-left: 10px;
}
.demo__controls {
  display:flex; align-items:center; gap: var(--gap-sm); flex-wrap:wrap;
  padding: var(--gap-sm); border-radius: var(--radius);
  background: var(--bg-elev); border:1px solid var(--border);
}
.demo__btns { display:flex; gap: 4px; }
.demo__btn {
  min-width: 38px; height: 34px; padding: 0 8px; border-radius: var(--radius-sm);
  background: var(--bg-elev-2); color: var(--ink); border:1px solid var(--border);
  font-size: 14px;
}
.demo__btn:hover { background: var(${themeVar}); color:#0b0e12; }
.demo__speed {
  height: 34px; background: var(--bg-elev-2); color: var(--ink);
  border:1px solid var(--border); border-radius: var(--radius-sm); padding: 0 6px;
}
.demo__progress { flex:1; min-width: 160px; accent-color: var(${themeVar}); }
.demo__counter { font-family: var(--mono); font-size: 12px; color: var(--ink-faint); white-space:nowrap; }
.demo__code-host { border-radius: var(--radius); overflow: hidden; }
.demo__code-toggle {
  width:100%; padding: 8px; text-align:left; font-size:13px;
  background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--ink-dim); cursor: pointer; margin-bottom: 4px;
}
.demo__code-toggle:hover { color: var(--ink); }
.demo__code-content {
  max-height: 400px; overflow:auto; background: var(--bg); border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.demo__code-list { font-family: var(--mono); font-size: 12px; }
.demo__code-row { display:flex; gap:8px; padding: 0 8px; line-height:1.7; }
.demo__code-row.is-hl { background: var(--v-compare); color:#0b0e12; }
.demo__code-num { color: var(--ink-faint); min-width:24px; text-align:right; user-select:none; }
.demo__code-src { white-space:pre; }
.demo__code-row.is-hl .demo__code-num { color:#0b0e12; }
`;
}
