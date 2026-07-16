// Playfair密码 · 录制帧序列：5×5 矩阵 + 字母对代换。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { playfair, type PlayfairHooks } from './impl.ts';

export interface PlayfairInput {
  text: string;
  key: string;
}

export const DEFAULT_INPUT: PlayfairInput = { text: 'HIDETHEGOLD', key: 'PLAYFAIR' };

/** 录制演示帧序列。 */
export function buildTrace(input: PlayfairInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;
  const out: string[] = [];

  rec
    .begin({ zh: `明文「${text}」，密钥「${key}」`, en: `Plaintext "${text}", key "${key}"` })
    .setMap([
      { key: '明文', value: text, role: 'default' as BarRole },
      { key: '密钥', value: key, role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: PlayfairHooks = {
    onPair: (i, inPair, outPair) => {
      out.push(...outPair);
      rec
        .begin({
          zh: `第 ${i + 1} 对：${inPair} → ${outPair}`,
          en: `Pair ${i + 1}: ${inPair} -> ${outPair}`,
        })
        .setAux([
          { label: '输入对', value: inPair, role: 'compare' as BarRole },
          { label: '输出对', value: outPair, role: 'swap' as BarRole },
        ])
        .commit();
    },
  };

  const { text: cipher } = playfair(text, key, hooks);

  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文 / plaintext', value: text, role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: cipher, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
