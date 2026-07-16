// 扩展波利比奥斯方阵 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polybiusEncrypt, buildPolybiusSquare, type PolybiusExtHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'HELP', keyword: '' };

export function buildTrace(input: { text: string; keyword: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, keyword } = input;
  const cells = buildPolybiusSquare(keyword);

  rec
    .begin({
      zh: `波利比奥斯方阵 keyword="${keyword}"`,
      en: `Polybius square keyword="${keyword}"`,
    })
    .setAux([{ label: '方阵', value: cells.join(''), role: 'pivot' }])
    .commit();

  const hooks: PolybiusExtHooks = {
    onChar: (i, original, code) => {
      rec
        .begin({ zh: `位置 ${i}: ${original} → ${code}`, en: `Pos ${i}: ${original} → ${code}` })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '坐标', value: code, role: 'final' },
        ])
        .commit();
    },
  };

  const result = polybiusEncrypt(text, keyword, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
