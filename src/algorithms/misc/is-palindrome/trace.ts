// =============================================================================
// 回文判定 · 录制帧序列
// 用 setArray 展示字符：left/right 指针，匹配='final'，不匹配='warn'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPalindrome, type IsPalindromeHooks } from './impl.ts';

export const DEFAULT_INPUT = 'racecar';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  // 角色：已确认匹配='final'，不匹配='warn'，比较中='compare'
  const roles: BarRole[] = new Array(n).fill('default');
  // 用 codePoint 数值展示字符（setArray 要求 number[]），同时记录 label
  const values = Array.from(s).map((ch) => ch.codePointAt(0)!);
  const labels = Array.from(s);
  let leftPtr = -1;
  let rightPtr = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    if (leftPtr >= 0) pointers.push({ index: leftPtr, label: 'L' });
    if (rightPtr >= 0 && rightPtr !== leftPtr) pointers.push({ index: rightPtr, label: 'R' });
    rec
      .begin(note)
      .setArray([...values], [...roles], pointers)
      .setAux([
        { label: '字符串', value: `"${labels.join('')}"`, role: 'compare' as BarRole },
        { label: '长度', value: String(n), role: 'default' as BarRole },
      ])
      .commit();
  };

  snapshot({
    zh: `判定 "${labels.join('')}" 是否回文`,
    en: `Check whether "${labels.join('')}" is a palindrome`,
  });

  const hooks: IsPalindromeHooks = {
    onCompare: (l, r) => {
      leftPtr = l;
      rightPtr = r;
      roles[l] = 'compare';
      roles[r] = 'compare';
      snapshot({
        zh: `比较 s[${l}]='${labels[l]}' 与 s[${r}]='${labels[r]}'`,
        en: `Compare s[${l}]='${labels[l]}' vs s[${r}]='${labels[r]}'`,
      });
    },
    onMatch: (l, r) => {
      roles[l] = 'final';
      roles[r] = 'final';
      snapshot({
        zh: `匹配：'${labels[l]}' === '${labels[r]}'`,
        en: `Match: '${labels[l]}' === '${labels[r]}'`,
      });
    },
    onMismatch: (l, r) => {
      roles[l] = 'warn';
      roles[r] = 'warn';
      snapshot({
        zh: `不匹配：'${labels[l]}' !== '${labels[r]}' → 不是回文`,
        en: `Mismatch: '${labels[l]}' !== '${labels[r]}' → not a palindrome`,
      });
    },
    onResult: (ok) => {
      leftPtr = -1;
      rightPtr = -1;
      if (ok) {
        for (let i = 0; i < n; i++) roles[i] = 'final';
      }
      snapshot(
        ok
          ? { zh: `是回文 ✓`, en: `Is a palindrome` }
          : { zh: `不是回文 ✗`, en: `Not a palindrome` },
      );
    },
  };

  isPalindrome(s, hooks, { normalize: false });

  // 终态
  const ok = isPalindrome(s);
  rec
    .begin({
      zh: ok ? `结论：是回文` : `结论：不是回文`,
      en: ok ? `Conclusion: palindrome` : `Conclusion: not a palindrome`,
    })
    .setArray([...values], ok ? roles.map(() => 'final' as BarRole) : roles, [])
    .setAux([
      {
        label: '结果',
        value: ok ? '回文 / palindrome' : '非回文 / not palindrome',
        role: (ok ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
