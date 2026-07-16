// 扩展仿射密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { affineEncrypt, type AffineExtHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'Affine HI', a: 5, b: 8 };

export function buildTrace(input: { text: string; a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, a, b } = input;

  rec
    .begin({ zh: `仿射 a=${a} b=${b}`, en: `Affine a=${a} b=${b}` })
    .setAux([{ label: 'E(x)', value: `${a}x+${b} mod 26`, role: 'pivot' }])
    .commit();

  const hooks: AffineExtHooks = {
    onChar: (i, original, mapped) => {
      rec
        .begin({
          zh: `位置 ${i}: ${original} → ${mapped}`,
          en: `Pos ${i}: ${original} → ${mapped}`,
        })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '新', value: mapped, role: 'final' },
        ])
        .commit();
    },
  };

  const result = affineEncrypt(text, a, b, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
