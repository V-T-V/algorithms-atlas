// =============================================================================
// 三色 DFS · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfsColor, type Color, type DfsColorHooks, type GraphInput3Dfs } from './impl.ts';

export const DEFAULT_INPUT: GraphInput3Dfs = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'B' },
  ],
  directed: true,
};

export const DEFAULT_START = 'A';

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.35, y: 0.15 },
  C: { x: 0.35, y: 0.85 },
  D: { x: 0.6, y: 0.5 },
  E: { x: 0.85, y: 0.5 },
};

const colorRole = (c: Color | undefined): BarRole =>
  c === 'GRAY' ? 'compare' : c === 'BLACK' ? 'final' : 'default';

export function buildTrace(input: GraphInput3Dfs = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const color = new Map<string, Color>();
  for (const n of input.nodes) color.set(n, 'WHITE');
  const stack: string[] = [];
  let exam: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: `${id}:${color.get(id)!.slice(0, 1)}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: colorRole(color.get(id)),
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          directed: true,
          role: exam && exam.from === e.from && exam.to === e.to ? 'compare' : 'default',
        })),
      )
      .setAux([
        {
          label: 'Recursion stack',
          value: stack.length ? stack.join(' → ') : '∅',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({ zh: `从 ${start} 开始三色 DFS`, en: `3-color DFS from ${start}` });

  const hooks: DfsColorHooks = {
    onEnter: (u) => {
      color.set(u, 'GRAY');
      stack.push(u);
      render({ zh: `进入 ${u}（灰）`, en: `Enter ${u} (gray)` });
    },
    onEdge: (from, to, c) => {
      exam = { from, to };
      render({ zh: `${from}→${to} 颜色=${c}`, en: `${from}->${to} color=${c}` });
      exam = null;
    },
    onBackEdge: (from, to) => {
      render({ zh: `回边 ${from}→${to}（发现环）`, en: `Back edge ${from}->${to} (cycle)` });
    },
    onExit: (u) => {
      color.set(u, 'BLACK');
      const idx = stack.indexOf(u);
      if (idx >= 0) stack.splice(idx, 1);
      render({ zh: `退出 ${u}（黑）`, en: `Exit ${u} (black)` });
    },
  };

  const r = dfsColor(input, start, hooks);

  rec
    .begin({
      zh: `DFS 完成 访问=${r.order.join('→')} 有环=${r.hasCycle}`,
      en: `DFS done order=${r.order.join('->')} cycle=${r.hasCycle}`,
    })
    .setAux([{ label: '有环', value: String(r.hasCycle), role: r.hasCycle ? 'warn' : 'final' }])
    .commit();

  return rec.build();
}
