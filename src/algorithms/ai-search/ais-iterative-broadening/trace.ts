import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iterativeBroadening, type IbTree } from './impl.ts';
const T: IbTree = {
  root: 0,
  goal: 5,
  maxBranch: 3,
  maxDepth: 4,
  children: (n) => [1, 2, 3].map((k) => n * 3 + k),
};
export const DEFAULT_INPUT = T;
export function buildTrace(input: IbTree = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '迭代加宽', en: 'Iterative Broadening' }).commit();
  const path = iterativeBroadening(input, {
    onVisit: (n, d, cap) =>
      rec
        .begin({ zh: '访问 ' + n + ' 深度' + d + ' 上限' + cap, en: 'visit ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'compare' as BarRole },
          { label: 'cap', value: String(cap), role: 'pivot' as BarRole },
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
