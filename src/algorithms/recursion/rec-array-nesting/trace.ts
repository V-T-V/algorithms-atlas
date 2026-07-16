import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arrayNesting } from './impl.ts';

export const DEFAULT_NUMS = [5, 4, 0, 3, 1, 6, 2];

export function buildTrace(opts: { nums?: number[] } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 [${nums.join(',')}]`, en: `Init [${nums.join(',')}]` })
    .setBars(nums.map((v, i) => ({ value: v, role: 'default' as BarRole, label: `${i}→${v}` })))
    .setAux([{ label: '规则', value: 'nums[i] 跳转找环', role: 'compare' as BarRole }])
    .commit();

  let globalMax = 0;
  arrayNesting(nums, {
    onVisit: (index, depth) => {
      rec
        .begin({ zh: `访问 ${index} depth=${depth}`, en: `visit ${index} depth=${depth}` })
        .setBars(
          nums.map((v, i) => ({
            value: v,
            role: (i === index ? 'pivot' : 'default') as BarRole,
            label: `${i}→${v}`,
          })),
        )
        .setAux([{ label: 'depth', value: String(depth), role: 'compare' as BarRole }])
        .commit();
    },
    onCycle: (start, length) => {
      if (length > globalMax) globalMax = length;
      rec
        .begin({ zh: `环起点 ${start} 长度=${length}`, en: `cycle start ${start} len=${length}` })
        .setBars(
          nums.map((v, i) => ({
            value: v,
            role: (i === start ? 'final' : 'default') as BarRole,
            label: `${i}→${v}`,
          })),
        )
        .setAux([{ label: '环长', value: String(length), role: 'final' as BarRole }])
        .commit();
    },
  });

  const result = arrayNesting(nums);
  rec
    .begin({ zh: `完成：最长环=${result}`, en: `Done: longest cycle=${result}` })
    .setAux([{ label: '最长', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
