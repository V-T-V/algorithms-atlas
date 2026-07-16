// =============================================================================
// Borůvka · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boruvka, type BoruvkaHooks, type MstGraphInput } from './impl.ts';

export const DEFAULT_INPUT: MstGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.3 },
  B: { x: 0.4, y: 0.7 },
  C: { x: 0.65, y: 0.3 },
  D: { x: 0.85, y: 0.7 },
};

export function buildTrace(input: MstGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const treeEdges = new Set<string>();
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
          role: (treeEdges.has(key(e.from, e.to)) ? 'final' : 'default') as BarRole,
        })),
      )
      .setAux([{ label: 'MST 边数', value: String(treeEdges.size), role: 'frontier' }])
      .commit();
  };

  render({ zh: 'Borůvka 开始', en: 'Boruvka start' });

  const hooks: BoruvkaHooks = {
    onRound: (r, c) => {
      render({ zh: `第 ${r} 轮，剩余连通块=${c}`, en: `Round ${r}, components=${c}` });
    },
    onMerge: (a, b, w) => {
      treeEdges.add(key(a, b));
      render({ zh: `合并 ${a}-${b}(w=${w})`, en: `Merge ${a}-${b} (${w})` });
    },
  };

  const r = boruvka(input, hooks);

  rec
    .begin({ zh: `Borůvka 完成 总权=${r.totalWeight}`, en: `Boruvka done total=${r.totalWeight}` })
    .setAux([{ label: '总权', value: String(r.totalWeight), role: 'final' }])
    .commit();

  return rec.build();
}
