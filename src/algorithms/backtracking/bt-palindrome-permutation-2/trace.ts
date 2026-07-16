// 回文排列 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btPalindromePermutation2, type BtPalindromePermutation2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabb';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let count = 0;

  rec
    .begin({ zh: `生成「${input}」的所有回文排列`, en: `Palindromic permutations of "${input}"` })
    .setAux([{ label: 'input', value: input, role: 'pivot' }])
    .commit();

  const hooks: BtPalindromePermutation2Hooks = {
    onBuild: (full) => {
      count++;
      rec
        .begin({ zh: `回文：${full}`, en: `Palindrome: ${full}` })
        .setBars(
          Array.from(full).map((c) => ({ value: c.charCodeAt(0), role: 'final' as BarRole })),
        )
        .setAux([
          { label: 'result', value: full, role: 'final' },
          { label: 'count', value: String(count), role: 'final' },
        ])
        .commit();
    },
  };

  const result = btPalindromePermutation2(input, hooks);

  rec
    .begin({ zh: `完成：${result.length} 个回文排列`, en: `Done: ${result.length} palindromes` })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
