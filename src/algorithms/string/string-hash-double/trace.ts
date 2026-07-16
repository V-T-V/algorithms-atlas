// =============================================================================
// 双哈希 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DoubleHasher } from './impl.ts';

export const DEFAULT_INPUT: { s: string; queries: Array<[number, number]> } = {
  s: 'abcabc',
  queries: [
    [0, 3],
    [3, 6],
  ],
};

export function buildTrace(
  input: { s: string; queries?: Array<[number, number]> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;
  const queries = input.queries ?? DEFAULT_INPUT.queries;

  rec
    .begin({ zh: `为 "${s}" 构造双哈希前缀表`, en: `Build double-hash prefix table for "${s}"` })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  // 用一个普通的 hasher 做预处理；为录制我们重新走一遍求前缀
  const hasher = new DoubleHasher(s);
  // 重新计算前缀以录制每步
  const n = s.length;
  let pref1 = 0;
  let pref2 = 0;
  const b1 = 131;
  const b2 = 137;
  const m1 = 1000000007;
  const m2 = 1000000009;
  for (let i = 0; i < n; i++) {
    pref1 = (pref1 * b1 + s.charCodeAt(i)) % m1;
    pref2 = (pref2 * b2 + s.charCodeAt(i)) % m2;
    const roles: BarRole[] = new Array(n).fill('default');
    roles[i] = 'compare';
    rec
      .begin({
        zh: `位置 ${i}（'${s[i]}'）：pref1=${pref1}, pref2=${pref2}`,
        en: `Position ${i} ('${s[i]}'): pref1=${pref1}, pref2=${pref2}`,
      })
      .setArray(
        Array.from(s, (c) => c.charCodeAt(0)),
        roles,
        [{ index: i, label: 'i' }],
      )
      .commit();
  }

  for (const [l, r] of queries) {
    const h = hasher.hash(l, r);
    rec
      .begin({
        zh: `子串 [${l}, ${r}) = "${s.slice(l, r)}"：h1=${h.h1}, h2=${h.h2}`,
        en: `Substring [${l}, ${r}) = "${s.slice(l, r)}": h1=${h.h1}, h2=${h.h2}`,
      })
      .setAux([
        { label: '[l,r)', value: `[${l},${r})`, role: 'final' },
        { label: 'h1', value: String(h.h1), role: 'default' },
        { label: 'h2', value: String(h.h2), role: 'default' },
      ])
      .commit();
  }

  return rec.build();
}
