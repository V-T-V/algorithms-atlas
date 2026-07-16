// =============================================================================
// 乘积最大子数组 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProduct, type MaxProdHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, -2, 4, -1];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let ci = -1;
  let curMax = 0;
  let curMin = 0;
  let best = nums[0] ?? 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        nums.map((v, i) => ({ value: v, role: (i === ci ? 'compare' : 'default') as BarRole })),
      )
      .setAux([
        { label: 'curMax', value: String(curMax), role: 'frontier' },
        { label: 'curMin', value: String(curMin), role: 'warn' },
        { label: 'best', value: String(best), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `nums=[${nums.join(',')}]`, en: `nums=[${nums.join(',')}]` });

  const hooks: MaxProdHooks = {
    onStep: (i, _x, mx, mn, b) => {
      ci = i;
      curMax = mx;
      curMin = mn;
      best = b;
      snap({
        zh: `i=${i} max=${mx} min=${mn} best=${b}`,
        en: `i=${i} max=${mx} min=${mn} best=${b}`,
      });
    },
  };

  const ans = maxProduct(nums, hooks);

  rec
    .begin({ zh: `最大乘积=${ans}`, en: `Max product=${ans}` })
    .setBars(nums.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
