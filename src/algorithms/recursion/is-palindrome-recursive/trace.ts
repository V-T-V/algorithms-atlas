// 递归回文判定 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPalindromeRecursive, type IsPalindromeRecursiveHooks } from './impl.ts';

export const DEFAULT_INPUT = 'racecar';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const values = Array.from(s).map((ch) => ch.codePointAt(0)!);
  const labels = Array.from(s);
  const roles: BarRole[] = new Array(n).fill('default');
  let loPtr = -1;
  let hiPtr = -1;

  const render = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    if (loPtr >= 0) pointers.push({ index: loPtr, label: 'L' });
    if (hiPtr >= 0 && hiPtr !== loPtr) pointers.push({ index: hiPtr, label: 'H' });
    rec
      .begin(note)
      .setArray([...values], [...roles], pointers)
      .setAux([
        { label: '字符串', value: `"${labels.join('')}"`, role: 'compare' as BarRole },
        { label: '长度', value: String(n), role: 'default' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `递归判定 "${labels.join('')}" 是否回文`,
    en: `Recursively check if "${labels.join('')}" is a palindrome`,
  });

  const hooks: IsPalindromeRecursiveHooks = {
    onCompare: (l, h) => {
      loPtr = l;
      hiPtr = h;
      roles[l] = 'compare';
      roles[h] = 'compare';
      render({
        zh: `比较 s[${l}]='${labels[l]}' 与 s[${h}]='${labels[h]}'`,
        en: `Compare s[${l}]='${labels[l]}' vs s[${h}]='${labels[h]}'`,
      });
    },
    onMatch: (l, h) => {
      roles[l] = 'final';
      roles[h] = 'final';
      render({
        zh: `匹配：'${labels[l]}' === '${labels[h]}'，递归中段`,
        en: `Match: '${labels[l]}' === '${labels[h]}', recurse on middle`,
      });
    },
    onMismatch: (l, h) => {
      roles[l] = 'warn';
      roles[h] = 'warn';
      render({ zh: `不匹配 → 非回文`, en: `Mismatch → not a palindrome` });
    },
    onResult: () => {
      loPtr = -1;
      hiPtr = -1;
    },
  };

  const ok = isPalindromeRecursive(s, hooks);

  const finalRoles: BarRole[] = ok ? roles.map(() => 'final' as BarRole) : roles;
  rec
    .begin({ zh: ok ? `是回文 ✓` : `不是回文 ✗`, en: ok ? `Is a palindrome` : `Not a palindrome` })
    .setArray([...values], finalRoles, [])
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
