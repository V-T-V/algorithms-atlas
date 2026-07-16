import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { idaStarSearch, type IdaGraph } from './impl.ts';
const G: IdaGraph = {
  start: 0,
  goal: 4,
  neighbors: (n) =>
    [
      { to: 1, cost: 1 },
      { to: 2, cost: 4 },
    ]
      .concat(n === 1 ? [{ to: 3, cost: 2 }] : [])
      .concat(n === 3 ? [{ to: 4, cost: 3 }] : []) as any,
  h: (n) => [4, 3, 2, 1, 0][n] ?? 0,
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: IdaGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'IDA* 起点 0 终点 4', en: 'IDA* 0->4' }).commit();
  const path = idaStarSearch(input, {
    onThreshold: (t) =>
      rec
        .begin({ zh: '阈值=' + t, en: 'threshold=' + t })
        .setAux([{ label: '阈值', value: String(t), role: 'pivot' as BarRole }])
        .commit(),
    onVisit: (n, gc, f) =>
      rec
        .begin({ zh: '访问 ' + n, en: 'visit ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'compare' as BarRole },
          { label: 'f', value: String(f), role: 'default' as BarRole },
        ])
        .commit(),
    onFound: (n) =>
      rec
        .begin({ zh: '到达目标 ' + n, en: 'goal ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
