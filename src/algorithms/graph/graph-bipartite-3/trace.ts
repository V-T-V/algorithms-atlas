// =============================================================================
// 二分图判定 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isBipartite, type BipGraphInput, type BipartiteHooks } from './impl.ts';

export const DEFAULT_INPUT: BipGraphInput = {
  nodes: ['1', '2', '3', '4'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '4' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.3 },
  '2': { x: 0.5, y: 0.2 },
  '3': { x: 0.8, y: 0.3 },
  '4': { x: 0.5, y: 0.7 },
};

export function buildTrace(input: BipGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const color = new Map<string, number>();
  for (const n of input.nodes) color.set(n, -1);

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: `${id}:${color.get(id) === -1 ? '-' : color.get(id)}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: 'default' as BarRole,
        })),
        input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
      )
      .commit();
  };

  render({ zh: 'BFS 染色开始', en: 'BFS coloring start' });

  const hooks: BipartiteHooks = {
    onColor: (u, c) => {
      color.set(u, c);
      render({ zh: `${u} 染色=${c}`, en: `${u} color=${c}` });
    },
    onConflict: (u, v) => {
      render({ zh: `冲突：${u} 与 ${v} 同色`, en: `Conflict ${u}-${v}` });
    },
  };

  const r = isBipartite(input, hooks);

  rec
    .begin({
      zh: r.bipartite ? '是二分图' : '不是二分图',
      en: r.bipartite ? 'Bipartite' : 'Not bipartite',
    })
    .setAux([{ label: '判定', value: String(r.bipartite), role: r.bipartite ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
