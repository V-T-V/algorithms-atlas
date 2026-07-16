// SHA-1哈希 · 录制帧序列：80 步压缩按轮聚合。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sha1, type Sha1Hooks } from './impl.ts';

export const DEFAULT_INPUT = [72, 101, 108, 108, 111, 87, 111, 114, 108, 100]; // "HelloWorld"

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join('');

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  rec
    .begin({ zh: `初始 H（5 个 32 位字）`, en: `Initial H (5x32-bit)` })
    .setBars(h.map((v) => ({ value: v >>> 0, role: 'pivot' as BarRole })))
    .setAux([{ label: '输入字节', value: hex(input), role: 'default' as BarRole }])
    .commit();

  let lastRound = -1;
  const hooks: Sha1Hooks = {
    onStep: (t) => {
      const round = Math.floor(t / 20);
      if (round !== lastRound) {
        lastRound = round;
        rec
          .begin({
            zh: `第 ${round + 1} 轮（步骤 ${t}/80）`,
            en: `Round ${round + 1} (step ${t}/80)`,
          })
          .setBars(h.map((v) => ({ value: v >>> 0, role: 'compare' as BarRole })))
          .commit();
      }
    },
  };

  const { digest } = sha1(input, hooks);

  rec
    .begin({ zh: `完成：摘要 = ${hex(digest)}`, en: `Done: digest = ${hex(digest)}` })
    .setBars(digest.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'SHA-1', value: hex(digest), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
