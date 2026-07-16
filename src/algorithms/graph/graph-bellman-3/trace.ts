// =============================================================================
// Bellman-Ford · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellmanFord, type BellmanHooks } from './impl.ts';
import type { WeightedGraphInput } from '../graph-dijkstra-3/impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: -3 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'D', to: 'B', weight: 1 },
  ],
  directed: true,
};

export const DEFAULT_START = 'A';

export function buildTrace(
  input: WeightedGraphInput = DEFAULT_INPUT,
  start = DEFAULT_START,
): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Infinity);
  dist.set(start, 0);

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux(
        input.nodes.map((id) => ({
          label: `dist[${id}]`,
          value: Number.isFinite(dist.get(id) ?? Infinity) ? String(dist.get(id)) : '∞',
          role: 'frontier' as BarRole,
        })),
      )
      .commit();
  };

  render({ zh: `初始 dist[${start}]=0`, en: `Init dist[${start}]=0` });

  const hooks: BellmanHooks = {
    onRound: (round, updated) => {
      render({
        zh: `第 ${round} 轮完成，有更新=${updated}`,
        en: `Round ${round} done, updated=${updated}`,
      });
    },
    onRelax: (from, to, _w, _old, nd) => {
      dist.set(to, nd);
      render({ zh: `松弛 ${from}→${to} → ${nd}`, en: `Relax ${from}->${to} = ${nd}` });
    },
  };

  const r = bellmanFord(input, start, hooks);

  rec
    .begin({
      zh: `Bellman-Ford 完成 负环=${r.hasNegativeCycle}`,
      en: `Done negCycle=${r.hasNegativeCycle}`,
    })
    .setAux([
      {
        label: '负权环',
        value: String(r.hasNegativeCycle),
        role: r.hasNegativeCycle ? 'warn' : 'final',
      },
    ])
    .commit();

  return rec.build();
}
