// 最少回文分割 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  btPalindromePartitionMin,
  btPalindromePartitionMinList,
  type BtPalindromePartitionMinHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 'aab';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(input).map((c) => c.charCodeAt(0));

  rec
    .begin({ zh: `字符串「${input}」`, en: `String "${input}"` })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: '目标', value: '求最少回文切割次数', role: 'pivot' }])
    .commit();

  const hooks: BtPalindromePartitionMinHooks = {
    onTryCut: (start, end, pal) => {
      const roles: BarRole[] = codes.map((_, i) =>
        i >= start && i <= end ? (pal ? 'compare' : 'warn') : 'default',
      );
      rec
        .begin({
          zh: `尝试 [${start},${end}] = "${input.slice(start, end + 1)}" → ${pal ? '回文' : '非回文'}`,
          en: `Try [${start},${end}]="${input.slice(start, end + 1)}" → ${pal ? 'palindrome' : 'not palindrome'}`,
        })
        .setArray([...codes], roles, [{ index: start, label: 's' }])
        .commit();
    },
    onMemo: (start, cuts) => {
      rec
        .begin({
          zh: `记忆起点 ${start}：最少切 ${cuts === Infinity ? '∞' : cuts} 次`,
          en: `Memo start ${start}: min ${cuts === Infinity ? '∞' : cuts} cuts`,
        })
        .setAux([
          { label: `memo[${start}]`, value: cuts === Infinity ? '∞' : String(cuts), role: 'final' },
        ])
        .commit();
    },
  };

  const cuts = btPalindromePartitionMin(input, hooks);
  const parts = btPalindromePartitionMinList(input);

  rec
    .begin({
      zh: `完成：最少切 ${cuts} 次，分块 [${parts.map((p) => `"${p}"`).join(', ')}]`,
      en: `Done: ${cuts} cuts, parts [${parts.map((p) => `"${p}"`).join(', ')}]`,
    })
    .setAux([
      { label: '最少切割', value: String(cuts), role: 'final' },
      { label: '分块', value: parts.join(' | '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
