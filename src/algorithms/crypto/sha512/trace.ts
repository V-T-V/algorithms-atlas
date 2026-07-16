// SHA-512哈希 · 录制帧序列：80 步压缩按轮聚合（BigInt 累加器）。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sha512, type Sha512Hooks } from './impl.ts';

export const DEFAULT_INPUT = [72, 101, 108, 108, 111, 87, 111, 114, 108, 100]; // "HelloWorld"

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join('');
const lo32 = (v: bigint): number => Number(v & 0xffffffffn) >>> 0;

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const h = [
    0x6a09e667n,
    0xbb67ae85n,
    0x3c6ef372n,
    0xa54ff53an,
    0x510e527fn,
    0x9b05688cn,
    0x1f83d9abn,
    0x5be0cd19n,
  ];

  rec
    .begin({
      zh: `初始 H（8 个 64 位字，取低 32 位展示）`,
      en: `Initial H (8x64-bit, low 32 shown)`,
    })
    .setBars(h.map((v) => ({ value: lo32(v), role: 'pivot' as BarRole })))
    .setAux([{ label: '输入字节', value: hex(input), role: 'default' as BarRole }])
    .commit();

  let lastRound = -1;
  const hooks: Sha512Hooks = {
    onStep: (t) => {
      const round = Math.floor(t / 20);
      if (round !== lastRound) {
        lastRound = round;
        rec
          .begin({
            zh: `第 ${round + 1} 轮（步骤 ${t}/80）`,
            en: `Round ${round + 1} (step ${t}/80)`,
          })
          .setBars(h.map((v) => ({ value: lo32(v), role: 'compare' as BarRole })))
          .commit();
      }
    },
  };

  const { digest } = sha512(input, hooks);

  rec
    .begin({ zh: `完成：摘要 = ${hex(digest)}`, en: `Done: digest = ${hex(digest)}` })
    .setBars(digest.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'SHA-512', value: hex(digest), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
