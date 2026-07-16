// =============================================================================
// 字符串哈希 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StringHash3 } from './impl.ts';

export const DEFAULT_INPUT = 'abcabcabc';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const h = new StringHash3(input);

  // 比较前缀 [0,2] 与 [3,5] 与 [6,8]
  const comparisons: Array<[number, number]> = [
    [0, 2],
    [3, 5],
    [6, 8],
  ];
  for (const [l, r] of comparisons) {
    const hash = h.hash(l, r);
    rec
      .begin({
        zh: `子串 '${input.slice(l, r + 1)}' 的哈希 = ${hash}`,
        en: `Hash of '${input.slice(l, r + 1)}' = ${hash}`,
      })
      .setBars(
        input.split('').map((ch, i) => ({
          value: ch.charCodeAt(0),
          role: i >= l && i <= r ? 'compare' : 'default',
        })),
      )
      .setAux([{ label: `hash[${l}..${r}]`, value: String(hash), role: 'pivot' }])
      .commit();
  }

  const same = h.hash(0, 2) === h.hash(3, 5) && h.hash(3, 5) === h.hash(6, 8);
  rec
    .begin({
      zh: `三段哈希${same ? '相同' : '不同'}`,
      en: `Hashes are ${same ? 'equal' : 'different'}`,
    })
    .setBars(input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'equal', value: String(same), role: 'final' }])
    .commit();

  return rec.build();
}
