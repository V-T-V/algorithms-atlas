// 跨越式棋盘密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { straddlingEncrypt, type StraddlingHooks } from './impl.ts';

export const DEFAULT_INPUT = 'ATTACKATDAWN';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `跨越式棋盘 "${input}"`, en: `Straddling checkerboard on "${input}"` })
    .setAux([{ label: '常用字母', value: 'ESTONIAR', role: 'pivot' }])
    .commit();

  const hooks: StraddlingHooks = {
    onChar: (i, original, code) => {
      rec
        .begin({ zh: `${original} → ${code}`, en: `${original} → ${code}` })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '码', value: code, role: 'final' },
        ])
        .commit();
    },
  };

  const result = straddlingEncrypt(input, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
