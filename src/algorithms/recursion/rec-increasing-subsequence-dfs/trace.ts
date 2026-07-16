import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lengthOfLIS, findLIS } from './impl.ts';

export const DEFAULT_NUMS = [10, 9, 2, 5, 3, 7, 101, 18];

export function buildTrace(opts: { nums?: number[] } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 [${nums.join(',')}]`, en: `Init [${nums.join(',')}]` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([{ label: '方法', value: 'DFS+记忆化', role: 'compare' as BarRole }])
    .commit();

  lengthOfLIS(nums, {
    onCompute: (index, length) => {
      rec
        .begin({
          zh: `lis(${index})=${length} (以${nums[index]}结尾)`,
          en: `lis(${index})=${length} (ends at ${nums[index]})`,
        })
        .setBars(
          nums.map((v, i) => ({
            value: v,
            role: (i === index ? 'final' : 'default') as BarRole,
            label: String(v),
          })),
        )
        .setAux([{ label: 'lis', value: String(length), role: 'compare' as BarRole }])
        .commit();
    },
  });

  const len = lengthOfLIS(nums);
  const seq = findLIS(nums);
  rec
    .begin({
      zh: `完成：长度=${len} 序列=[${seq.join(',')}]`,
      en: `Done: length=${len} seq=[${seq.join(',')}]`,
    })
    .setBars(
      nums.map((v) => ({
        value: v,
        role: (seq.includes(v) ? 'sorted' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      { label: '长度', value: String(len), role: 'final' as BarRole },
      { label: '序列', value: `[${seq.join(',')}]`, role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
