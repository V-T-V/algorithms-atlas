import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findBridges, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '求桥', en: 'Find bridges' }).commit();
  const bs = findBridges(input, {
    onBridge: (a, b) =>
      rec
        .begin({ zh: '桥 ' + a + '-' + b, en: 'bridge ' + a + '-' + b })
        .setAux([{ label: 'bridge', value: a + '-' + b, role: 'swap' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + bs.length + ' 座桥', en: bs.length + ' bridges' })
    .setAux([{ label: 'count', value: String(bs.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
