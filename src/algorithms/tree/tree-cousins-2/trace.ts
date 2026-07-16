import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, areCousins } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, null, null, 5], x: 4, y: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec
    .begin({
      zh: '兄弟判断 ' + input.x + ' 与 ' + input.y,
      en: 'Cousins? ' + input.x + ' & ' + input.y,
    })
    .commit();
  const r = areCousins(root, input.x, input.y, {
    onFind: (v, d) =>
      rec
        .begin({ zh: '找到 ' + v + ' 深度 ' + d, en: 'found ' + v + ' depth ' + d })
        .setAux([{ label: 'depth', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '兄弟？' + r, en: 'cousins? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
