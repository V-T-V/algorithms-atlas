// =============================================================================
// 最大乘积子数组 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProductSubarray, type MaxProdHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, -2, 4];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let cur = -1;
  let best = nums[0] ?? 0;

  const snap = (note: { zh: string; en: string }, curMax?: number, curMin?: number): void => {
    const roles: BarRole[] = nums.map((_, i) => (i === cur ? 'pivot' : 'default'));
    rec
      .begin(note)
      .setArray([...nums], roles, [{ index: cur < 0 ? 0 : cur, label: 'i' }])
      .setAux([
        { label: 'curMax', value: curMax === undefined ? '-' : `${curMax}`, role: 'compare' },
        { label: 'curMin', value: curMin === undefined ? '-' : `${curMin}`, role: 'swap' },
        { label: 'best', value: `${best}`, role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `nums=[${nums.join(',')}]`, en: `nums=[${nums.join(',')}]` });

  const hooks: MaxProdHooks = {
    onStep: (i, cm, mn, b) => {
      cur = i;
      best = b;
      snap(
        {
          zh: `i=${i}: curMax=${cm} curMin=${mn} best=${b}`,
          en: `i=${i}: curMax=${cm} curMin=${mn} best=${b}`,
        },
        cm,
        mn,
      );
    },
    onDone: (b) => {
      best = b;
      cur = -1;
      snap({ zh: `最大乘积=${b}`, en: `max product=${b}` });
    },
  };

  maxProductSubarray(nums, hooks);

  rec
    .begin({ zh: `完成：${best}`, en: `Done: ${best}` })
    .setBars(nums.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '最大乘积', value: String(best), role: 'final' }])
    .commit();

  return rec.build();
}
