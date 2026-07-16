// =============================================================================
// 滚动哈希 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rollingHash } from './impl.ts';

export const DEFAULT_INPUT = { s: 'abcabcabc', k: 3 };

export function buildTrace(input: { s: string; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, k } = input;
  let idx = 0;
  const hashes = rollingHash(s, k, {
    onRoll: (i, h) => {
      rec
        .begin({
          zh: `窗口 [${i},${i + k - 1}] 哈希 = ${h}`,
          en: `Window [${i},${i + k - 1}] hash = ${h}`,
        })
        .setBars(
          s.split('').map((ch, j) => ({
            value: ch.charCodeAt(0),
            role: j >= i && j < i + k ? 'compare' : 'default',
          })),
        )
        .setAux([{ label: 'hash', value: String(h), role: 'pivot' }])
        .commit();
      idx++;
    },
  });
  void idx;

  rec
    .begin({ zh: `共 ${hashes.length} 个窗口哈希`, en: `${hashes.length} window hashes` })
    .setBars(hashes.map((h) => ({ value: Number(h % 100000n), role: 'final' })))
    .setAux([{ label: 'count', value: String(hashes.length), role: 'final' }])
    .commit();

  return rec.build();
}
