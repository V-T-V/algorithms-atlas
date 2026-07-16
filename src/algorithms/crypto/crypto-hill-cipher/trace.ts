// 希尔密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hillEncrypt, type HillHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'HELP',
  key: [3, 3, 2, 5] as readonly [number, number, number, number],
};

export function buildTrace(
  input: { text: string; key: readonly [number, number, number, number] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;

  rec
    .begin({
      zh: `希尔矩阵 [[${key[0]},${key[1]}],[${key[2]},${key[3]}]]`,
      en: `Hill matrix [[${key[0]},${key[1]}],[${key[2]},${key[3]}]]`,
    })
    .setAux([{ label: '密钥', value: key.join(','), role: 'pivot' }])
    .commit();

  const hooks: HillHooks = {
    onPair: (i, plain, cipher) => {
      rec
        .begin({
          zh: `对 (${plain[0]},${plain[1]}) → (${cipher[0]},${cipher[1]})`,
          en: `Pair (${plain[0]},${plain[1]}) → (${cipher[0]},${cipher[1]})`,
        })
        .setAux([
          { label: '明', value: `${plain[0]},${plain[1]}`, role: 'compare' },
          { label: '密', value: `${cipher[0]},${cipher[1]}`, role: 'final' },
        ])
        .commit();
    },
  };

  const result = hillEncrypt(text, key, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
