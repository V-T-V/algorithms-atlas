import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canPartitionKSubsets } from './impl.ts';
export const DEFAULT_INPUT = { nums: [4, 3, 2, 3, 5, 2, 1], k: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '划分 ' + input.k + ' 等和子集', en: 'Partition k=' + input.k }).commit();
  const ok = canPartitionKSubsets(input.nums, input.k, {
    onPlace: (idx, bucket) =>
      rec
        .begin({
          zh: input.nums[idx] + ' 入桶 ' + bucket,
          en: input.nums[idx] + ' bucket ' + bucket,
        })
        .setAux([{ label: 'bucket', value: String(bucket), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可划分？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
