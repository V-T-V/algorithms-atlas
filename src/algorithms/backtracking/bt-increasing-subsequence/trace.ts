// 递增子序列 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btIncreasingSubsequence, type BtIncreasingSubsequenceHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 6, 7, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let count = 0;

  rec
    .begin({
      zh: `找 [${input.join(', ')}] 的所有递增子序列`,
      en: `Increasing subsequences of [${input.join(', ')}]`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: BtIncreasingSubsequenceHooks = {
    onResult: (seq) => {
      count++;
      rec
        .begin({ zh: `子序列：[${seq.join(', ')}]`, en: `Subsequence: [${seq.join(', ')}]` })
        .setBars(seq.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: 'seq', value: seq.join(', '), role: 'final' },
          { label: 'count', value: String(count), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = btIncreasingSubsequence(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个`, en: `Done: ${result.length}` })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
