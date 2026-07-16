import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, rangeSumBST } from './impl.ts';
export const DEFAULT_INPUT = { keys: [10, 5, 15, 3, 7, 13, 18, 1, null, 6], lo: 6, hi: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec
    .begin({
      zh: '区间和 [' + input.lo + ',' + input.hi + ']',
      en: 'Range sum [' + input.lo + ',' + input.hi + ']',
    })
    .commit();
  const s = rangeSumBST(root, input.lo, input.hi, {
    onVisit: (v, inRange) =>
      rec
        .begin({ zh: v + (inRange ? ' 命中' : ''), en: v + (inRange ? ' in range' : '') })
        .setAux([{ label: 'inRange', value: String(inRange), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '和 = ' + s, en: 'sum = ' + s })
    .setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
