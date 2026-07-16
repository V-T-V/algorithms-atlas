import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ldsSearch, type LdsTree } from './impl.ts';
const T: LdsTree = {
  root: 0,
  goal: 4,
  order: (n) => (n === 0 ? [1, 2] : n === 1 ? [3, 4] : []),
  maxDepth: 3,
};
export const DEFAULT_INPUT = T;
export function buildTrace(input: LdsTree = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LDS disc=1', en: 'LDS disc=1' }).commit();
  const path = ldsSearch(input, 1, {
    onVisit: (n, d, disc) =>
      rec
        .begin({ zh: '访问 ' + n + ' 深' + d + ' 偏差' + disc, en: 'visit ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'compare' as BarRole },
          { label: 'disc', value: String(disc), role: 'pivot' as BarRole },
        ])
        .commit(),
    onFound: (n) =>
      rec
        .begin({ zh: '找到 ' + n, en: 'found ' + n })
        .setAux([{ label: 'goal', value: String(n), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '路径 ' + path.join('->'), en: 'path ' + path.join('->') })
    .setAux([{ label: 'path', value: path.join('->'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
