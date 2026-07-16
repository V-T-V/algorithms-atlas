import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateSubsetsRecursive } from './impl.ts';

export const DEFAULT_NUMS = [1, 2, 3];

export function buildTrace(opts: { nums?: number[] } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 [${nums.join(',')}]`, en: `Init [${nums.join(',')}]` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([{ label: '方法', value: '扩展法', role: 'compare' as BarRole }])
    .commit();

  let count = 0;
  generateSubsetsRecursive(nums, {
    onSubset: (subset) => {
      count++;
      rec
        .begin({
          zh: `子集${count}: {${subset.join(',')}}`,
          en: `subset${count}: {${subset.join(',')}}`,
        })
        .setBars(
          nums.map((v) => ({
            value: v,
            role: (subset.includes(v) ? 'final' : 'default') as BarRole,
            label: String(v),
          })),
        )
        .setAux([{ label: '子集', value: `{${subset.join(',')}}`, role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：${count} 个子集`, en: `Done: ${count} subsets` })
    .setAux([{ label: '总数', value: String(count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
