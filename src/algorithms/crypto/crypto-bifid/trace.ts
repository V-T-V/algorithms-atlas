// Bifid 双方阵密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bifidEncrypt, buildBifidSquare, type BifidHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'BIFID', keyword: '' };

export function buildTrace(input: { text: string; keyword: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, keyword } = input;
  const cells = buildBifidSquare(keyword);

  rec
    .begin({ zh: `Bifid keyword="${keyword}"`, en: `Bifid keyword="${keyword}"` })
    .setAux([{ label: '方阵', value: cells.join(''), role: 'pivot' }])
    .commit();

  const hooks: BifidHooks = {
    onSplit: (rows, cols) => {
      rec
        .begin({ zh: '坐标分行', en: 'Split coordinates' })
        .setAux([
          { label: '行', value: rows.join(''), role: 'compare' },
          { label: '列', value: cols.join(''), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = bifidEncrypt(text, keyword, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
