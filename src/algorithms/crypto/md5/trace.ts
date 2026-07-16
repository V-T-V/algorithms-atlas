// MD5哈希 · 录制帧序列：64 步压缩的累加器变化（按轮聚合）。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { md5, type Md5Hooks } from './impl.ts';

export const DEFAULT_INPUT = [72, 101, 108, 108, 111, 87, 111, 114, 108, 100]; // "HelloWorld"

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join('');

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const acc = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

  rec
    .begin({ zh: `初始 IV（4 个 32 位字）`, en: `Initial IV (4x32-bit)` })
    .setBars(acc.map((v) => ({ value: v >>> 0, role: 'pivot' as BarRole })))
    .setAux([{ label: '输入字节', value: hex(input), role: 'default' as BarRole }])
    .commit();

  let lastRound = -1;
  const hooks: Md5Hooks = {
    onStep: (i, _a, _b, _c, _d) => {
      const round = Math.floor(i / 16);
      if (round !== lastRound) {
        lastRound = round;
        const names = ['F', 'G', 'H', 'I'];
        rec
          .begin({
            zh: `第 ${round + 1} 轮（函数 ${names[round]}）`,
            en: `Round ${round + 1} (func ${names[round]})`,
          })
          .setBars(acc.map((v) => ({ value: v >>> 0, role: 'compare' as BarRole })))
          .commit();
      }
    },
  };

  const { digest } = md5(input, hooks);

  rec
    .begin({ zh: `完成：摘要 = ${hex(digest)}`, en: `Done: digest = ${hex(digest)}` })
    .setBars(digest.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'MD5', value: hex(digest), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
