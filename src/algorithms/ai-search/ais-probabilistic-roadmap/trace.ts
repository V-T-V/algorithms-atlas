import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { probabilisticRoadmap, type PrmProblem } from './impl.ts';
const P: PrmProblem = {
  dim: [10, 10],
  sample: () => [Math.random() * 10, Math.random() * 10],
  free: () => true,
  start: [0, 0],
  goal: [9, 9],
  k: 3,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: PrmProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PRM 采样', en: 'PRM' }).commit();
  const path = probabilisticRoadmap(input, 10, {
    onSample: (id) =>
      rec
        .begin({ zh: '采样 ' + id, en: 'sample ' + id })
        .setAux([{ label: 'id', value: String(id), role: 'compare' as BarRole }])
        .commit(),
    onEdge: (a, b) =>
      rec
        .begin({ zh: '边 ' + a + '-' + b, en: 'edge' })
        .setAux([{ label: 'edge', value: a + '-' + b, role: 'pivot' as BarRole }])
        .commit(),
    onPath: (p) =>
      rec
        .begin({ zh: '路径 ' + p.join('->'), en: 'path' })
        .setAux([{ label: 'path', value: p.join('->'), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径长 ' + path.length, en: 'len ' + path.length })
    .setAux([{ label: 'len', value: String(path.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
