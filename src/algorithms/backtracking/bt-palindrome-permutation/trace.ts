// 回文排列判定 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btPalindromePermutation, type BtPalindromePermutationHooks } from './impl.ts';

export const DEFAULT_INPUT = 'carerac';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `判断「${input}」能否重排为回文`, en: `Can "${input}" form a palindrome?` })
    .setAux([{ label: 'input', value: input, role: 'pivot' }])
    .commit();

  const hooks: BtPalindromePermutationHooks = {
    onCount: (counts) => {
      rec
        .begin({ zh: '统计字符频数', en: 'Count character frequencies' })
        .setAux(
          Object.entries(counts).map(([k, v]) => ({
            label: `'${k}'`,
            value: String(v),
            role: v % 2 === 1 ? 'warn' : 'final',
          })),
        )
        .commit();
    },
    onOddCount: (odd) => {
      rec
        .begin({
          zh: `奇数次字符共 ${odd} 个`,
          en: `${odd} characters have odd counts`,
        })
        .setAux([{ label: 'odd count', value: String(odd), role: odd <= 1 ? 'final' : 'warn' }])
        .commit();
    },
  };

  const can = btPalindromePermutation(input, hooks);

  rec
    .begin({
      zh: `结论：${can ? '可' : '不可'}重排为回文`,
      en: `Result: ${can ? 'can' : 'cannot'} form palindrome`,
    })
    .setAux([{ label: '结论', value: can ? 'YES' : 'NO', role: can ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
