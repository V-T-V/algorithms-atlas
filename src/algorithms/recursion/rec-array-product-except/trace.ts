import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { productExceptSelf } from './impl.ts';

export const DEFAULT_NUMS = [1, 2, 3, 4];

export function buildTrace(opts: { nums?: number[] } = {}): Frame[] {
  const nums = opts.nums ?? DEFAULT_NUMS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 [${nums.join(',')}]`, en: `Init [${nums.join(',')}]` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole, label: String(v) })))
    .setAux([{ label: '规则', value: '前缀×后缀积', role: 'compare' as BarRole }])
    .commit();

  const answer = productExceptSelf(nums, {
    onAnswer: (index, value) => {
      rec
        .begin({ zh: `answer[${index}]=${value}`, en: `answer[${index}]=${value}` })
        .setBars(
          nums.map((v, i) => ({
            value: v,
            role: (i === index ? 'final' : 'default') as BarRole,
            label: String(v),
          })),
        )
        .setAux([{ label: 'answer', value: String(value), role: 'compare' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：[${answer.join(',')}]`, en: `Done: [${answer.join(',')}]` })
    .setBars(answer.map((v) => ({ value: v, role: 'sorted' as BarRole, label: String(v) })))
    .setAux([{ label: '结果', value: `[${answer.join(',')}]`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
