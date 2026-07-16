// =============================================================================
// 回文分割最少切割 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCutPalindrome, type PalindromicCutHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aab';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input
      .split('')
      .map((_, i) => (i === cur ? 'compare' : i <= cur && dp[i]! >= 0 ? 'frontier' : 'default'));
    rec
      .begin(note)
      .setArray(
        input.split('').map((c) => c.charCodeAt(0)),
        roles,
        [{ index: cur < 0 ? 0 : cur, label: 'i' }],
      )
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `s="${input}"`, en: `s="${input}"` });

  const hooks: PalindromicCutHooks = {
    onCut: (i, cuts) => {
      dp[i] = cuts;
      cur = i;
      snap({ zh: `dp[${i}] = ${cuts}`, en: `dp[${i}] = ${cuts}` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最少切割 = ${t}`, en: `Min cuts = ${t}` });
    },
  };

  minCutPalindrome(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(
      input.split('').map((c) => ({ value: c.charCodeAt(0), role: 'final' as BarRole, label: c })),
    )
    .setAux([{ label: '切割数 / cuts', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
