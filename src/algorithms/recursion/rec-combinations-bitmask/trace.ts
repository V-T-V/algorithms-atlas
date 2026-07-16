import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationsBitmask } from './impl.ts';

export const DEFAULT_NUMS = [1, 2, 3, 4];
export const DEFAULT_K = 2;

export function buildTrace(opts: { nums?: number[]; k?: number } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const k = opts.k ?? DEFAULT_K;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 C(${nums.length},${k})`, en: `Init C(${nums.length},${k})` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([
      { label: '组合数', value: String(binomial(nums.length, k)), role: 'compare' as BarRole },
    ])
    .commit();

  let count = 0;
  combinationsBitmask(nums, k, {
    onCombination: (comb) => {
      count++;
      rec
        .begin({ zh: `组合${count}: {${comb.join(',')}}`, en: `comb${count}: {${comb.join(',')}}` })
        .setBars(
          nums.map((v) => ({
            value: v,
            role: (comb.includes(v) ? 'final' : 'default') as BarRole,
            label: String(v),
          })),
        )
        .setAux([{ label: '组合', value: `{${comb.join(',')}}`, role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${count} 个组合`, en: `Done: ${count} combinations` })
    .setAux([{ label: '总数', value: String(count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}

function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}
