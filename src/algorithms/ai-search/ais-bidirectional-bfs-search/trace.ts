import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bidirectionalBfs, type BiBfsGraph } from './impl.ts';
const G: BiBfsGraph = {
  start: 0,
  goal: 5,
  adj: (n) =>
    n === 0 ? [1, 2] : n === 1 ? [3, 4] : n === 2 ? [4] : n === 3 ? [5] : n === 4 ? [5] : [],
};
export const DEFAULT_INPUT = G;
export function buildTrace(input: BiBfsGraph = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '双向 BFS', en: 'Bidirectional BFS' }).commit();
  const path = bidirectionalBfs(input, {
    onExpand: (s, n) =>
      rec
        .begin({ zh: (s === 'f' ? '前' : '后') + '展开 ' + n, en: s + ' expand ' + n })
        .setAux([
          { label: 'side', value: s, role: 'pivot' as BarRole },
          { label: 'node', value: String(n), role: 'compare' as BarRole },
        ])
        .commit(),
    onMeet: (n) =>
      rec
        .begin({ zh: '相遇 ' + n, en: 'meet ' + n })
        .setAux([{ label: 'meet', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
