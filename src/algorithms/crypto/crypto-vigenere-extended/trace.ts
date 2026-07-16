// 扩展维吉尼亚密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vigenereExtendedEncrypt, type VigenereExtHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'ATTACK1200', key: 'KEY' };

export function buildTrace(input: { text: string; key: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;

  rec
    .begin({ zh: `扩展维吉尼亚 key="${key}"`, en: `Extended Vigenère key="${key}"` })
    .setAux([{ label: '字符集', value: 'A-Z0-9 (36)', role: 'pivot' }])
    .commit();

  const hooks: VigenereExtHooks = {
    onChar: (i, plainCh, keyCh, cipherCh) => {
      rec
        .begin({
          zh: `${plainCh} + ${keyCh} → ${cipherCh}`,
          en: `${plainCh} + ${keyCh} → ${cipherCh}`,
        })
        .setAux([
          { label: '明', value: plainCh, role: 'compare' },
          { label: '密钥', value: keyCh, role: 'pivot' },
          { label: '密', value: cipherCh, role: 'final' },
        ])
        .commit();
    },
  };

  const result = vigenereExtendedEncrypt(text, key, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
