// AES玩具版 · 录制帧序列：2×2 状态矩阵展示轮变换。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aes, type AesHooks } from './impl.ts';

export interface AesInput {
  bytes: number[];
  roundKey: number[];
}

export const DEFAULT_INPUT: AesInput = {
  bytes: [0x32, 0x88, 0x31, 0xe0],
  roundKey: [0x2b, 0x7e, 0x15, 0x16],
};

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join(' ');

/** 录制演示帧序列。 */
export function buildTrace(input: AesInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { bytes, roundKey } = input;
  let state = [...bytes];

  const grid = (note: { zh: string; en: string }, roles: Record<string, BarRole> = {}): void => {
    rec
      .begin(note)
      .setGrid(
        rec.gridFrom(
          [
            [state[0], state[2]],
            [state[1], state[3]],
          ],
          roles,
        ),
      )
      .setAux([{ label: '轮密钥', value: hex(roundKey), role: 'pivot' as BarRole }])
      .commit();
  };

  grid({ zh: `初始状态（2×2 列主序）`, en: `Initial state (2x2 col-major)` });

  const hooks: AesHooks = {
    onSubBytes: (s) => {
      state = [...s];
      grid({ zh: 'SubBytes：S-Box 字节代换', en: 'SubBytes: S-Box substitution' });
    },
    onShiftRows: (s) => {
      state = [...s];
      grid(
        { zh: 'ShiftRows：第 1 行左移 1', en: 'ShiftRows: row 1 rotates left by 1' },
        { '1,1': 'swap', '1,0': 'swap' },
      );
    },
    onMixColumns: (s) => {
      state = [...s];
      grid({ zh: 'MixColumns：GF(2^8) 列混合', en: 'MixColumns: GF(2^8) column mix' });
    },
    onAddRoundKey: (s) => {
      state = [...s];
      grid({ zh: 'AddRoundKey：异或轮密钥', en: 'AddRoundKey: XOR with round key' });
    },
  };

  aes(bytes, roundKey, hooks);

  // 终态
  rec
    .begin({ zh: `完成：密文 ${hex(state)}`, en: `Done: ciphertext ${hex(state)}` })
    .setMap([
      { key: '明文 / plaintext', value: hex(bytes), role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: hex(state), role: 'final' as BarRole },
      { key: '轮密钥 / round key', value: hex(roundKey), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
