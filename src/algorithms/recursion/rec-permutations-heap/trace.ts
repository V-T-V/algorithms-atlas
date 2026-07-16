import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapPermutations } from './impl.ts';

export const DEFAULT_NUMS = [1, 2, 3];

export function buildTrace(opts: { nums?: number[] } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 [${nums.join(',')}]`, en: `Init [${nums.join(',')}]` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([
      { label: '排列数', value: String(factorial(nums.length)), role: 'compare' as BarRole },
    ])
    .commit();

  let count = 0;
  heapPermutations(nums, {
    onPermutation: (perm) => {
      count++;
      rec
        .begin({ zh: `排列${count}: [${perm.join(',')}]`, en: `perm${count}: [${perm.join(',')}]` })
        .setBars(
          perm.map((v, idx) => ({
            value: v,
            role: (idx === perm.length - 1 ? 'final' : 'default') as BarRole,
            label: String(v),
          })),
        )
        .setAux([{ label: '排列', value: `[${perm.join(',')}]`, role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${count} 个排列`, en: `Done: ${count} permutations` })
    .setAux([{ label: '总数', value: String(count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
