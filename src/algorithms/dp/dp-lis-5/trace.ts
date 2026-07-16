import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lengthOfLIS, type LisHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 9, 2, 5, 3, 7, 101, 18];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tails: number[] = [];
  rec
    .begin({ zh: `数组长度 ${nums.length}`, en: `Array length ${nums.length}` })
    .setAux([{ label: 'tails', value: '∅', role: 'frontier' }])
    .commit();
  const hooks: LisHooks = {
    onTail: (idx, value) => {
      if (idx === tails.length) tails.push(value);
      else tails[idx] = value;
      rec
        .begin({ zh: `更新 tails[${idx}]=${value}`, en: `tails[${idx}]=${value}` })
        .setBars(
          tails.map((v, i) => ({ value: v, role: (i === idx ? 'swap' : 'default') as BarRole })),
        )
        .setAux([{ label: 'tails', value: tails.join(','), role: 'frontier' }])
        .commit();
    },
  };
  const ans = lengthOfLIS(nums, hooks);
  rec
    .begin({ zh: `LIS 长度=${ans}`, en: `LIS length=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
