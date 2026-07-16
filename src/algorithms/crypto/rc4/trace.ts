// RC4流密码 · 录制帧序列：KSA 打乱 S 盒 + PRGA 生成密钥流。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc4, type Rc4Hooks } from './impl.ts';

export interface Rc4Input {
  data: number[];
  key: number[];
}

export const DEFAULT_INPUT: Rc4Input = {
  data: [72, 101, 108, 108, 111], // "Hello"
  key: [1, 2, 3, 4, 5],
};

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join(' ');

/** 录制演示帧序列。 */
export function buildTrace(input: Rc4Input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { data, key } = input;

  rec
    .begin({ zh: `明文 + 密钥`, en: `Plaintext + key` })
    .setMap([
      { key: '明文', value: hex(data), role: 'default' as BarRole },
      { key: '密钥', value: hex(key), role: 'pivot' as BarRole },
    ])
    .commit();

  let ksaDone = false;
  let prgaStep = 0;
  const cipher: number[] = [];

  const hooks: Rc4Hooks = {
    onKsaStep: (i) => {
      if (i === 0) {
        rec.begin({ zh: 'KSA：初始化 S 盒（256 步）', en: 'KSA: init S-box (256 steps)' }).commit();
      }
    },
    onPrgaStep: (n, _i, _j, keyByte) => {
      if (!ksaDone) {
        ksaDone = true;
        rec.begin({ zh: 'KSA 完成，开始 PRGA', en: 'KSA done, start PRGA' }).commit();
      }
      cipher.push(data[n]! ^ keyByte);
      prgaStep = n;
      void prgaStep;
      rec
        .begin({
          zh: `第 ${n + 1} 字节：流密钥 ${keyByte}`,
          en: `Byte ${n + 1}: keystream ${keyByte}`,
        })
        .setBars(
          cipher.map((v, idx) => ({ value: v, role: (idx === n ? 'swap' : 'final') as BarRole })),
        )
        .commit();
    },
  };

  const { bytes } = rc4(data, key, hooks);

  rec
    .begin({ zh: `完成：密文 ${hex(bytes)}`, en: `Done: ciphertext ${hex(bytes)}` })
    .setBars(bytes.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([
      { key: '明文 / plaintext', value: hex(data), role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: hex(bytes), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
