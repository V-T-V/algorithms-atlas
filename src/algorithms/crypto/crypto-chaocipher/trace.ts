// 混沌密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chaocipherEncrypt, type ChaocipherHooks } from './impl.ts';

export const DEFAULT_INPUT = 'HELLO';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `混沌密码 "${input}"`, en: `Chaocipher on "${input}"` })
    .setAux([{ label: '说明', value: '双字母表同步扰动', role: 'pivot' }])
    .commit();

  const hooks: ChaocipherHooks = {
    onChar: (i, plain, cipher) => {
      rec
        .begin({ zh: `${plain} → ${cipher}`, en: `${plain} → ${cipher}` })
        .setAux([
          { label: '明', value: plain, role: 'compare' },
          { label: '密', value: cipher, role: 'final' },
        ])
        .commit();
    },
  };

  const result = chaocipherEncrypt(input, undefined, undefined, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
