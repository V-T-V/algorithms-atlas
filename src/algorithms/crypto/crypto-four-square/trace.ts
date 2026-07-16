// 四方密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fourSquareEncrypt, type FourSquareHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'HELLO WORLD', kw1: 'EXAMPLE', kw2: 'KEYWORD' };

export function buildTrace(
  input: { text: string; kw1: string; kw2: string } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, kw1, kw2 } = input;

  rec
    .begin({ zh: `四方 kw1="${kw1}" kw2="${kw2}"`, en: `Four-Square kw1="${kw1}" kw2="${kw2}"` })
    .setAux([
      { label: 'kw1', value: kw1, role: 'pivot' },
      { label: 'kw2', value: kw2, role: 'pivot' },
    ])
    .commit();

  const hooks: FourSquareHooks = {
    onDigraph: (i, a, b, ca, cb) => {
      rec
        .begin({ zh: `对 (${a},${b}) → (${ca},${cb})`, en: `Pair (${a},${b}) → (${ca},${cb})` })
        .setAux([
          { label: '明', value: a + b, role: 'compare' },
          { label: '密', value: ca + cb, role: 'final' },
        ])
        .commit();
    },
  };

  const result = fourSquareEncrypt(text, kw1, kw2, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
