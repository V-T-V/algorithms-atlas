import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cloneGraph, type GNode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: GNode = { val: '1', neighbors: [] },
    n2: GNode = { val: '2', neighbors: [] },
    n3: GNode = { val: '3', neighbors: [] };
  n1.neighbors = [n2, n3];
  n2.neighbors = [n1];
  n3.neighbors = [n1];
  rec.begin({ zh: '克隆图', en: 'Clone graph' }).commit();
  const c = cloneGraph(n1, {
    onClone: (v) =>
      rec
        .begin({ zh: '克隆 ' + v, en: 'clone ' + v })
        .setAux([{ label: 'clone', value: v, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '克隆根 = ' + (c?.val ?? null), en: 'clone root = ' + (c?.val ?? null) })
    .setAux([{ label: 'root', value: String(c?.val), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
