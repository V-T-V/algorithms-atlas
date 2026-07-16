import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { radixSortLsdHex, type RadixHexHooks } from './impl.ts';

export const DEFAULT_INPUT = [170, 45, 75, 90, 802, 24, 2, 66];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const hooks: RadixHexHooks = {
    onPass: (digit, arr) => {
      rec
        .begin({ zh: `第 ${digit} 个 hex 位排序完成`, en: `Pass ${digit} (hex digit) done` })
        .setBars(rec.barsFrom(arr))
        .commit();
    },
  };
  const result = radixSortLsdHex(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
