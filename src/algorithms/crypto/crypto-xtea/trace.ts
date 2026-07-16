// XTEA · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xteaEncryptBlock, type XteaHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  block: { v0: 0x12345678, v1: 0x9abcdef0 },
  key: [0x11111111, 0x22222222, 0x33333333, 0x44444444] as readonly [
    number,
    number,
    number,
    number,
  ],
  rounds: 32,
};

export function buildTrace(
  input: {
    block: { v0: number; v1: number };
    key: readonly [number, number, number, number];
    rounds?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { block, key, rounds = 32 } = input;

  rec
    .begin({
      zh: `XTEA 加密 v0=${block.v0.toString(16)} v1=${block.v1.toString(16)}`,
      en: `XTEA encrypt v0=${block.v0.toString(16)} v1=${block.v1.toString(16)}`,
    })
    .setAux([{ label: '轮数', value: String(rounds), role: 'pivot' }])
    .commit();

  const hooks: XteaHooks = {
    onRound: (round, v0, v1, sum) => {
      if (round < 3 || round >= rounds - 1) {
        rec
          .begin({ zh: `第 ${round} 轮`, en: `Round ${round}` })
          .setAux([
            { label: 'v0', value: '0x' + v0.toString(16), role: 'compare' },
            { label: 'v1', value: '0x' + v1.toString(16), role: 'compare' },
            { label: 'sum', value: '0x' + sum.toString(16), role: 'pivot' },
          ])
          .commit();
      }
    },
  };

  const result = xteaEncryptBlock(block, key, rounds, hooks);

  rec
    .begin({
      zh: `密文 v0=${result.v0.toString(16)} v1=${result.v1.toString(16)}`,
      en: `Cipher v0=${result.v0.toString(16)} v1=${result.v1.toString(16)}`,
    })
    .setAux([
      { label: 'v0', value: '0x' + result.v0.toString(16), role: 'final' },
      { label: 'v1', value: '0x' + result.v1.toString(16), role: 'final' },
    ])
    .commit();

  return rec.build();
}
