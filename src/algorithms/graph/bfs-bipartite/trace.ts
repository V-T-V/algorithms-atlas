// =============================================================================
// 二分图判定·BFS 染色 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfsBipartite, type GraphInput, type BipartiteHooks } from './impl.ts';

// 偶长环 0-1-2-3-0（二分）+ 偶长环 4-5-6-7-4
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '0' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
    { from: '6', to: '7' },
    { from: '7', to: '4' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.15, y: 0.3 },
  '1': { x: 0.3, y: 0.6 },
  '2': { x: 0.15, y: 0.9 },
  '3': { x: 0.0, y: 0.6 },
  '4': { x: 0.65, y: 0.3 },
  '5': { x: 0.8, y: 0.6 },
  '6': { x: 0.65, y: 0.9 },
  '7': { x: 0.5, y: 0.6 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const color = new Map<string, number>();
  for (const n of nodeIds) color.set(n, -1);
  const queue: string[] = [];
  let conflict: { from: string; to: string } | null = null;

  const colorName = (c: number): string => (c === 0 ? '红' : c === 1 ? '蓝' : '·');

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      const c = color.get(id) ?? -1;
      let role: BarRole = 'default';
      if (c === 0) role = 'frontier';
      else if (c === 1) role = 'pivot';
      if (conflict && (id === conflict.from || id === conflict.to)) role = 'warn';
      return {
        id,
        label: `${id}\n${colorName(c)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (color.get(e.from) !== -1 && color.get(e.to) !== -1) role = 'final';
      if (
        conflict &&
        ((conflict.from === e.from && conflict.to === e.to) ||
          (conflict.from === e.to && conflict.to === e.from))
      )
        role = 'warn';
      return { from: e.from, to: e.to, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        {
          label: '颜色',
          value: nodeIds.map((n) => `${n}:${colorName(color.get(n) ?? -1)}`).join('  '),
        },
        { label: '队列', value: queue.length ? queue.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  render({ zh: '初始无向图（两个偶环）', en: 'Initial undirected graph (two even cycles)' });

  const hooks: BipartiteHooks = {
    onVisit: (v, c) => {
      color.set(v, c);
      queue.push(v);
      render({ zh: `${v} 染${colorName(c)}，入队`, en: `${v} colored ${colorName(c)}, enqueue` });
    },
    onConflict: (u, v) => {
      conflict = { from: u, to: v };
      render({ zh: `${u} 与 ${v} 同色 → 奇环`, en: `${u} and ${v} same color -> odd cycle` });
    },
    onResult: (ok) => {
      conflict = null;
      render(
        ok
          ? { zh: '判定：是二分图', en: 'Result: bipartite' }
          : { zh: '判定：非二分图', en: 'Result: not bipartite' },
      );
    },
  };

  bfsBipartite(input, hooks);

  const ok = !conflict;
  rec
    .begin(
      ok
        ? { zh: '完成：二分图', en: 'Done: bipartite' }
        : { zh: '完成：非二分图', en: 'Done: not bipartite' },
    )
    .setGraph(
      nodeIds.map((id) => {
        const c = color.get(id) ?? -1;
        return {
          id,
          label: `${id}\n${colorName(c)}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (c === 0 ? 'frontier' : c === 1 ? 'pivot' : 'default') as BarRole,
        };
      }),
      input.edges.map((e) => ({ from: e.from, to: e.to, role: 'final' as BarRole })),
    )
    .setAux([{ label: '结论', value: ok ? '二分图' : '非二分图', role: ok ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
