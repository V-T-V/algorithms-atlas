// 单调递增数字 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monotoneIncreasing, type MonotoneIncreasingHooks } from './impl.ts';

export interface MiInput {
  n: number;
}

export const DEFAULT_INPUT: MiInput = { n: 332 };

/** 录制演示帧序列。 */
export function buildTrace(input: MiInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;
  const digits = String(n).split('').map(Number);

  rec
    .begin({ zh: `输入 n = ${n}`, en: `Input n = ${n}` })
    .setArray(
      digits,
      digits.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: MonotoneIncreasingHooks = {
    onMark: (mark) => {
      rec
        .begin({ zh: `从位置 ${mark} 起置 9`, en: `Set 9 from position ${mark}` })
        .setArray(
          digits,
          digits.map((_, i) => (i >= mark ? 'swap' : 'default') as BarRole),
          [{ index: mark, label: 'm' }],
        )
        .commit();
    },
  };
  const { value } = monotoneIncreasing(n, hooks);

  rec
    .begin({ zh: `完成：${value}`, en: `Done: ${value}` })
    .setArray(
      String(value).split('').map(Number),
      digits.map(() => 'final' as BarRole),
      [],
    )
    .setMap([{ key: '结果', value: String(value), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
