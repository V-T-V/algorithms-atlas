// =============================================================================
// 桥 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findBridges, type BridgeGraphInput, type BridgeHooks } from './impl.ts';

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
  const bridges = new Set<string>();
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
          role: (bridges.has(key(e.from, e.to)) ? 'swap' : 'default') as BarRole,
        })),
      )
      .commit();
  };

  render({ zh: '开始找桥', en: 'Find bridges' });

  const hooks: BridgeHooks = {
    onBridge: (u, v) => {
      bridges.add(key(u, v));
      render({ zh: `桥：${u}-${v}`, en: `Bridge: ${u}-${v}` });
    },
  };

  const r = findBridges(input, hooks);

  rec
    .begin({ zh: `共 ${r.length} 座桥`, en: `${r.length} bridges` })
    .setAux([{ label: '桥数', value: String(r.length), role: 'final' }])
    .commit();

  return rec.build();
}
