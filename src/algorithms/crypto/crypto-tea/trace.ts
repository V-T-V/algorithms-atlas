// TEA 微型加密算法 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { teaEncryptBlock, type TeaHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  block: { v0: 0x12345678, v1: 0x9abcdef0 },
  key: [0xa341316c, 0xc8013ea4, 0xb2f5e182, 0x11e6c534] as readonly [
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
      zh: `TEA 加密 v0=${block.v0.toString(16)} v1=${block.v1.toString(16)}`,
      en: `TEA encrypt v0=${block.v0.toString(16)} v1=${block.v1.toString(16)}`,
    })
    .setAux([{ label: '轮数', value: String(rounds), role: 'pivot' }])
    .commit();

  const hooks: TeaHooks = {
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

  const result = teaEncryptBlock(block, key, rounds, hooks);

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
