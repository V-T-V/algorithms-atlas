// DES玩具版 · 录制帧序列：8 位比特串经 P-box / 密钥混合 / S-Box。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { des, type DesHooks } from './impl.ts';

export interface DesInput {
  bits: number[];
  key: number[];
}

export const DEFAULT_INPUT: DesInput = {
  bits: [1, 0, 0, 1, 1, 0, 1, 0],
  key: [1, 0, 1, 0, 0, 1, 1, 0],
};

/** 录制演示帧序列。 */
export function buildTrace(input: DesInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { bits, key } = input;
  let state = [...bits];

  const snap = (note: { zh: string; en: string }, roles: Record<string, BarRole> = {}): void => {
    rec
      .begin(note)
      .setGrid(rec.gridFrom([state.slice(0, 4), state.slice(4, 8)], roles))
      .setAux([{ label: '密钥', value: key.join(''), role: 'pivot' as BarRole }])
      .commit();
  };

  snap({ zh: `初始 8 位明文`, en: `Initial 8-bit plaintext` });

  const hooks: DesHooks = {
    onPermute: (s) => {
      state = [...s];
      snap({ zh: 'P-box 置换', en: 'P-box permutation' });
    },
    onKeyMix: (s) => {
      state = [...s];
      snap({ zh: '与密钥异或', en: 'XOR with key' });
    },
    onSbox: (s) => {
      state = [...s];
      snap({ zh: 'S-Box 代换', en: 'S-Box substitution' });
    },
  };

  des(bits, key, hooks);

  rec
    .begin({ zh: `完成：密文 ${state.join('')}`, en: `Done: ciphertext ${state.join('')}` })
    .setMap([
      { key: '明文 / plaintext', value: bits.join(''), role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: state.join(''), role: 'final' as BarRole },
      { key: '密钥 / key', value: key.join(''), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
