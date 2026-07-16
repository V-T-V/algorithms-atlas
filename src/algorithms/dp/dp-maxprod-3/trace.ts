import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProduct, type MaxProdHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, -2, 4, -1];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `${nums.length} 个数`, en: `${nums.length} numbers` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: MaxProdHooks = {
    onElement: (i, x, maxP, minP) => {
      rec
        .begin({
          zh: `第${i}个 ${x}：maxP=${maxP} minP=${minP}`,
          en: `#${i} ${x}: maxP=${maxP} minP=${minP}`,
        })
        .setBars(
          nums.map((v, j) => ({ value: v, role: (j === i ? 'compare' : 'default') as BarRole })),
        )
        .setAux([
          { label: 'maxP', value: String(maxP), role: 'frontier' },
          { label: 'minP', value: String(minP), role: 'warn' },
        ])
        .commit();
    },
  };
  const ans = maxProduct(nums, hooks);
  rec
    .begin({ zh: `最大乘积=${ans}`, en: `Max product=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
