// 关键字密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { keywordEncrypt, buildKeywordTable, type KeywordHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'HELLO ZEBRA', keyword: 'ZEBRA' };

export function buildTrace(input: { text: string; keyword: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, keyword } = input;
  const table = buildKeywordTable(keyword);

  rec
    .begin({ zh: `关键字 "${keyword}"`, en: `Keyword "${keyword}"` })
    .setAux([{ label: '替换表', value: table.join(''), role: 'pivot' }])
    .commit();

  const hooks: KeywordHooks = {
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

  const result = keywordEncrypt(text, keyword, hooks);

  rec
    .begin({ zh: `密文：${result}`, en: `Cipher: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
