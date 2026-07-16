// 栅栏转置密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grilleEncrypt, type GrilleHooks } from './impl.ts';

export const DEFAULT_INPUT = 'THEQUICKBROWNFOX';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `栅栏转置 "${input}"`, en: `Turning grille on "${input}"` })
    .setAux([{ label: '网格', value: '4×4', role: 'pivot' }])
    .commit();

  const hooks: GrilleHooks = {
    onFill: (rotation, grid) => {
      rec
        .begin({ zh: `旋转 ${rotation * 90}° 后`, en: `After ${rotation * 90}° rotation` })
        .setAux([
          { label: '网格', value: grid.map((row) => row.join('')).join('|'), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = grilleEncrypt(input, undefined, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
