// 扩展 RC4 流密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc4EncryptText, type Rc4Hooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'Hello', key: 'Key' };

export function buildTrace(input: { text: string; key: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;

  rec
    .begin({ zh: `RC4 key="${key}"`, en: `RC4 key="${key}"` })
    .setAux([{ label: '明文', value: text, role: 'pivot' }])
    .commit();

  let step = 0;
  const hooks: Rc4Hooks = {
    onByte: (i, plainByte, cipherByte) => {
      rec
        .begin({
          zh: `字节${i}: ${plainByte} ⊕ k = ${cipherByte}`,
          en: `byte ${i}: ${plainByte} ⊕ k = ${cipherByte}`,
        })
        .setAux([
          { label: '明', value: String(plainByte), role: 'compare' },
          { label: '密', value: String(cipherByte), role: 'final' },
        ])
        .commit();
      step++;
    },
  };

  const result = rc4EncryptText(text, key, hooks);

  rec
    .begin({ zh: `完成 ${step} 字节`, en: `Done ${step} bytes` })
    .setAux([{ label: '密文(十进制)', value: Array.from(result).join(','), role: 'final' }])
    .commit();

  return rec.build();
}
