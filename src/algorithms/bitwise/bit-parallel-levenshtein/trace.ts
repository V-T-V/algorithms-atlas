// =============================================================================
// 位并行 Levenshtein · 录制帧序列
// setArray 展示文本字符码 + 指针；setAux 展示当前 score 与 Pv/Mv。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitParallelLevenshtein, type MyersHooks } from './impl.ts';

export const DEFAULT_INPUT = { pattern: 'saturday', text: 'sunday' };

function toBin(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}

export function buildTrace(input: { pattern: string; text: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { pattern, text } = input;
  const textCodes = Array.from(text).map((c) => c.charCodeAt(0));
  let cursor = -1;
  const scores: number[] = [];

  const snapshot = (
    note: { zh: string; en: string },
    score?: number,
    pv?: number,
    mv?: number,
  ): void => {
    const roles: BarRole[] = textCodes.map((_, i) =>
      i < 0 ? 'final' : i === cursor ? 'pivot' : 'default',
    );
    const pointers = cursor >= 0 ? [{ index: cursor, label: 'j' }] : [];
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'score', value: String(score ?? '-'), role: 'final' as BarRole },
    ];
    if (pv !== undefined) aux.push({ label: 'Pv', value: toBin(pv), role: 'frontier' as BarRole });
    if (mv !== undefined) aux.push({ label: 'Mv', value: toBin(mv), role: 'compare' as BarRole });
    aux.push({ label: '历史 score', value: scores.join(','), role: 'sorted' as BarRole });
    rec
      .begin(note)
      .setArray([...textCodes], roles, pointers)
      .setAux(aux)
      .commit();
  };

  rec
    .begin({
      zh: `模式「${pattern}」 vs 文本「${text}」`,
      en: `Pattern "${pattern}" vs text "${text}"`,
    })
    .setAux([
      { label: '说明', value: 'Myers 位并行', role: 'pivot' as BarRole },
      { label: '初始 score', value: String(pattern.length), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: MyersHooks = {
    onPeq: (_ch, _peq) => {
      // 仅出第一帧描述预处理
    },
    onChar: (j, _ch, score) => {
      cursor = j;
      scores.push(score);
      snapshot({
        zh: `文本[${j}]='${text[j]}'：score = ${score}`,
        en: `text[${j}]='${text[j]}': score = ${score}`,
      });
      cursor = j + 1;
    },
  };
  void hooks.onPeq;

  const result = bitParallelLevenshtein(pattern, text, hooks);

  rec
    .begin({ zh: `完成：编辑距离 = ${result}`, en: `Done: edit distance = ${result}` })
    .setMap([
      { key: '模式 / pattern', value: pattern, role: 'default' as BarRole },
      { key: '文本 / text', value: text, role: 'default' as BarRole },
      { key: 'Levenshtein', value: String(result), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
