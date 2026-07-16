import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eventualSafeNodes } from './impl.ts';
export const DEFAULT_INPUT = [[1, 2], [2, 3], [5], [0], [5], [], []];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最终安全节点', en: 'Eventual safe nodes' }).commit();
  const ns = eventualSafeNodes(input, {
    onSafe: (v) =>
      rec
        .begin({ zh: '安全 ' + v, en: 'safe ' + v })
        .setAux([{ label: 'safe', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '安全：' + ns.join(','), en: 'safe: ' + ns.join(',') })
    .setBars(ns.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
