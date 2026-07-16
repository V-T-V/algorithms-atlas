// =============================================================================
// Boyer-Moore 坏字符规则 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boyerMooreBadChar, type BmHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'HERE IS A SIMPLE EXAMPLE',
  pat: 'EXAMPLE',
};

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;

  rec
    .begin({
      zh: `Boyer-Moore 在 "${text}" 中找 "${pat}"`,
      en: `Boyer-Moore find "${pat}" in "${text}"`,
    })
    .setAux([
      { label: 'text', value: text, role: 'frontier' },
      { label: 'pat', value: pat, role: 'compare' },
    ])
    .commit();

  const hooks: BmHooks = {
    onAlign: (s) => {
      const roles: BarRole[] = new Array(text.length).fill('default');
      for (let k = 0; k < pat.length && s + k < text.length; k++) roles[s + k] = 'pivot';
      rec
        .begin({ zh: `对齐起点 ${s}`, en: `Align at ${s}` })
        .setArray(
          Array.from(text, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: '对齐', value: String(s), role: 'frontier' }])
        .commit();
    },
    onCompare: (s, j, eq) => {
      const roles: BarRole[] = new Array(text.length).fill('default');
      for (let k = 0; k < pat.length && s + k < text.length; k++) roles[s + k] = 'pivot';
      roles[s + j] = eq ? 'sorted' : 'swap';
      rec
        .begin({
          zh: `比较 text[${s + j}]='${text[s + j]}' 与 pat[${j}]='${pat[j]}' → ${eq ? '等' : '不等'}`,
          en: `Compare t[${s + j}]='${text[s + j]}' p[${j}]='${pat[j]}' → ${eq ? 'eq' : 'ne'}`,
        })
        .setArray(
          Array.from(text, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .commit();
    },
    onShift: (oldAlign, badCh, shift) => {
      rec
        .begin({
          zh: `坏字符 '${badCh}'，右移 ${shift}`,
          en: `Bad char '${badCh}', shift ${shift}`,
        })
        .setAux([{ label: '平移', value: String(shift), role: 'warn' }])
        .commit();
    },
    onFound: (pos) => {
      const roles: BarRole[] = new Array(text.length).fill('default');
      for (let k = 0; k < pat.length; k++) roles[pos + k] = 'final';
      rec
        .begin({ zh: `命中位置 ${pos}`, en: `Found at ${pos}` })
        .setArray(
          Array.from(text, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: '命中', value: String(pos), role: 'final' }])
        .commit();
    },
  };

  const res = boyerMooreBadChar(text, pat, hooks);
  rec
    .begin({ zh: `完成，命中位置 [${res.join(', ')}]`, en: `Done, hits [${res.join(', ')}]` })
    .setAux([{ label: '命中', value: `[${res.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
