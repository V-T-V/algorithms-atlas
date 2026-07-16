// =============================================================================
// 朴素匹配 · 录制帧序列
// 用 setArray 展示主串（values 取字符码），pointers 标注 文本比较位置 i 与
// 模式对齐起点 (i - j)；setAux 展示模式串与匹配结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { naiveMatch, type NaiveMatchHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'AABAACAADAABAABA',
  pat: 'AABA',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  let i = -1; // 当前比较的文本下标
  let j = -1; // 当前比较的模式下标
  const matches: number[] = []; // 命中起点
  let roleI: BarRole = 'default';

  const textAux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text, role: 'default' },
    { label: 'pat', value: pat, role: 'default' },
    {
      label: 'i / j',
      value: `${i < 0 ? '-' : i} / ${j < 0 ? '-' : j}`,
      role: 'compare',
    },
  ];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (i >= 0 && i < n) roles[i] = roleI;
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    if (i >= 0 && j >= 0) {
      const start = i - j;
      if (start >= 0 && start < n) pointers.push({ index: start, label: 'pat0' });
    }
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(textAux()).commit();
    roleI = 'default';
  };

  snapshot({ zh: `在 text 中查找 pat="${pat}"`, en: `Search pat="${pat}" in text` });

  const hooks: NaiveMatchHooks = {
    onAlign: (s) => {
      i = s;
      j = 0;
      roleI = 'frontier';
      snapshot({
        zh: `把模式对齐到起点 ${s}，开始逐字比较`,
        en: `Align pattern at start ${s}, compare char-by-char`,
      });
    },
    onCompare: (ci, cj, equal) => {
      i = ci;
      j = cj;
      roleI = equal ? 'compare' : 'warn';
      snapshot({
        zh: equal
          ? `相等：text[${ci}]='${text[ci]}' = pat[${cj}]='${pat[cj]}'`
          : `失配：text[${ci}]='${text[ci]}' ≠ pat[${cj}]='${pat[cj]}'`,
        en: equal
          ? `Equal: text[${ci}]='${text[ci]}' = pat[${cj}]='${pat[cj]}'`
          : `Mismatch: text[${ci}]='${text[ci]}' ≠ pat[${cj}]='${pat[cj]}'`,
      });
    },
    onFound: (s) => {
      matches.push(s);
      i = s;
      roleI = 'final';
      snapshot({
        zh: `命中！匹配起点 = ${s}`,
        en: `Found! match start = ${s}`,
      });
    },
  };

  naiveMatch(text, pat, hooks);

  // 终态：高亮所有匹配区间
  const roles: BarRole[] = new Array(n).fill('default');
  for (const start of matches) for (let k = 0; k < m; k++) roles[start + k] = 'final';
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配，起点 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} matches, starts [${matches.join(', ')}]`,
    })
    .setArray(CODE(text), roles, [])
    .setAux([{ label: 'matches', value: `[${matches.join(', ')}]`, role: 'final' }, ...textAux()])
    .commit();

  return rec.build();
}
