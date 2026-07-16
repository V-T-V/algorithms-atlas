import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketSortSqrt, type BucketSqrtHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  const collected: number[] = [];
  const hooks: BucketSqrtHooks = {
    onBucket: (i, arr) => {
      collected.push(...arr);
      const roles: Record<number, BarRole> = {};
      rec
        .begin({
          zh: `桶 ${i} 排序完成：[${arr.join(',')}]`,
          en: `Bucket ${i}: [${arr.join(',')}]`,
        })
        .setBars(rec.barsFrom(collected, roles))
        .commit();
    },
  };
  const result = bucketSortSqrt(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
