// 删除k个数字后的最小值 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { removeKDigits, type RemoveKDigitsHooks } from './impl.ts';

export interface RkdInput {
  num: string;
  k: number;
}

export const DEFAULT_INPUT: RkdInput = { num: '1432219', k: 3 };

function toCodes(s: string): number[] {
  return Array.from(s).map((c) => Number(c));
}

/** 录制演示帧序列。 */
export function buildTrace(input: RkdInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { num, k } = input;

  rec
    .begin({ zh: `数字串「${num}」，删除 ${k} 位`, en: `Number "${num}", remove ${k}` })
    .setArray(
      toCodes(num),
      toCodes(num).map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: RemoveKDigitsHooks = {
    onPop: () => {
      void 0;
    },
  };
  const { value } = removeKDigits(num, k, hooks);

  rec
    .begin({ zh: `完成：最小值 = ${value}`, en: `Done: min = ${value}` })
    .setArray(
      toCodes(value),
      toCodes(value).map(() => 'final' as BarRole),
      [],
    )
    .setMap([{ key: '结果', value, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
