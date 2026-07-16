// =============================================================================
// 割点 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findCutVertices, type BridgeGraphInput, type CutHooks } from './impl.ts';

export const DEFAULT_INPUT: BridgeGraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.3 },
  '2': { x: 0.2, y: 0.7 },
  '3': { x: 0.5, y: 0.5 },
  '4': { x: 0.75, y: 0.5 },
  '5': { x: 0.9, y: 0.3 },
};

export function buildTrace(input: BridgeGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cuts = new Set<string>();

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (cuts.has(id) ? 'swap' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
      )
      .commit();
  };

  render({ zh: '开始找割点', en: 'Find cut vertices' });

  const hooks: CutHooks = {
    onCut: (u) => {
      cuts.add(u);
      render({ zh: `割点：${u}`, en: `Cut vertex: ${u}` });
    },
  };

  const r = findCutVertices(input, hooks);

  rec
    .begin({ zh: `共 ${r.length} 个割点`, en: `${r.length} cut vertices` })
    .setAux([{ label: '割点', value: r.join(',') || '无', role: 'final' }])
    .commit();

  return rec.build();
}
