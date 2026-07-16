// ADFGVX 密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adfgvxEncrypt, buildAdfgvxFill, type AdfgvxHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  text: 'ATTACK',
  polybiusKey: '',
  transpositionKey: 'KEY',
};

export function buildTrace(
  input: { text: string; polybiusKey: string; transpositionKey: string } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { text, polybiusKey, transpositionKey } = input;
  const fill = buildAdfgvxFill(polybiusKey);

  rec
    .begin({ zh: `ADFGVX 密钥 "${transpositionKey}"`, en: `ADFGVX key "${transpositionKey}"` })
    .setAux([{ label: '方阵', value: fill, role: 'pivot' }])
    .commit();

  const hooks: AdfgvxHooks = {
    onFractionate: (i, original, code) => {
      rec
        .begin({ zh: `${original} → ${code}`, en: `${original} → ${code}` })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '分数化', value: code, role: 'final' },
        ])
        .commit();
    },
  };

  const result = adfgvxEncrypt(text, polybiusKey, transpositionKey, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
