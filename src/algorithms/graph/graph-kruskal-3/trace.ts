// =============================================================================
// Kruskal · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskal, type KruskalGraphInput, type KruskalHooks } from './impl.ts';

export const DEFAULT_INPUT: KruskalGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 4 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 7 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.15, y: 0.5 },
  B: { x: 0.4, y: 0.2 },
  C: { x: 0.4, y: 0.8 },
  D: { x: 0.7, y: 0.3 },
  E: { x: 0.9, y: 0.7 },
};

export function buildTrace(input: KruskalGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const accepted = new Set<string>();
  let examining: { from: string; to: string } | null = null;

  const key = (a: string, b: string): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: 'default' as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          weight: e.weight,
          role: (examining && examining.from === e.from && examining.to === e.to
            ? 'compare'
            : accepted.has(key(e.from, e.to))
              ? 'final'
              : 'default') as BarRole,
        })),
      )
      .setAux([{ label: '已加入', value: String(accepted.size), role: 'frontier' }])
      .commit();
  };

  render({ zh: '边排序后逐条考虑', en: 'Edges sorted, considering each' });

  const hooks: KruskalHooks = {
    onConsider: (from, to, w, accept) => {
      examining = { from, to };
      render({
        zh: `${from}-${to}(w=${w}): ${accept ? '加入' : '成环跳过'}`,
        en: `${from}-${to}(${w}): ${accept ? 'accept' : 'skip'}`,
      });
      if (accept) accepted.add(key(from, to));
      examining = null;
    },
  };

  const r = kruskal(input, hooks);

  rec
    .begin({ zh: `Kruskal 完成 总权=${r.totalWeight}`, en: `Kruskal done total=${r.totalWeight}` })
    .setAux([{ label: 'MST 权重', value: String(r.totalWeight), role: 'final' }])
    .commit();

  return rec.build();
}
