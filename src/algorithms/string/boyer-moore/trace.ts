// =============================================================================
// Boyer-Moore 匹配 · 录制帧序列
// 用 setArray 展示文本（values 取字符码），pointers 标注模式对齐起点 s 与当前比较
// 指针 j；setAux 展示坏字符表与当前跳跃规则。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boyerMoore, buildBadCharTable, type BoyerMooreHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'HERE IS A SIMPLE EXAMPLE',
  pat: 'EXAMPLE',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  const bc = buildBadCharTable(pat);
  const bcText = (pat: string): string => [...pat].map((c) => `${c}:${bc.get(c) ?? -1}`).join(' ');

  let curS = 0;
  let curJ = m - 1;
  let roleJ: BarRole = 'frontier';
  const matches: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    // 高亮模式对齐区间 [s, s+m)
    for (let k = 0; k < m; k++) {
      if (curS + k < n) roles[curS + k] = 'compare';
    }
    // 当前比较位置
    if (curS + curJ < n && curJ >= 0) {
      roles[curS + curJ] = roleJ;
      pointers.push({ index: curS + curJ, label: 'j' });
    }
    pointers.push({ index: Math.min(curS, n - 1), label: 's' });
    for (const start of matches) for (let k = 0; k < m; k++) roles[start + k] = 'final';

    rec
      .begin(note)
      .setArray(CODE(text), roles, pointers)
      .setAux([
        { label: 'text', value: text, role: 'default' },
        { label: 'pat', value: pat, role: 'default' },
        { label: '坏字符表', value: bcText(pat), role: 'pivot' },
        {
          label: '对齐区间',
          value: `[${curS}, ${curS + m - 1}]`,
          role: 'frontier',
        },
        {
          label: '命中',
          value: matches.length ? matches.join(', ') : '—',
          role: 'compare',
        },
      ])
      .commit();
    roleJ = 'frontier';
  };

  snapshot({
    zh: `在 "${text}" 中从右向左匹配 "${pat}"`,
    en: `Match "${pat}" in "${text}" right-to-left`,
  });

  const hooks: BoyerMooreHooks = {
    onAlign: (s, j) => {
      curS = s;
      curJ = j;
      snapshot({
        zh: `模式对齐到 s=${s}，从 j=${j} 开始比较`,
        en: `Align pattern at s=${s}; compare from j=${j}`,
      });
    },
    onCompare: (s, j, match) => {
      curS = s;
      curJ = j;
      roleJ = match ? 'compare' : 'warn';
      snapshot({
        zh: `比较 text[${s + j}]='${text[s + j]}' 与 pat[${j}]='${pat[j]}'：${match ? '相等' : '不等'}`,
        en: `Compare text[${s + j}]='${text[s + j]}' vs pat[${j}]='${pat[j]}': ${match ? 'match' : 'mismatch'}`,
      });
    },
    onShift: (from, to, shift, rule) => {
      snapshot({
        zh: `${rule === 'bad-char' ? '坏字符' : '好后缀'}规则：s 从 ${from} 跳到 ${to}（+${shift}）`,
        en: `${rule}: s ${from} → ${to} (+${shift})`,
      });
    },
    onFound: (start) => {
      matches.push(start);
      curS = start;
      roleJ = 'final';
      snapshot({
        zh: `命中！匹配起点 = ${start}`,
        en: `Found! match start = ${start}`,
      });
    },
  };

  boyerMoore(text, pat, hooks);

  // 终态
  const roles: BarRole[] = new Array(n).fill('default');
  for (const start of matches) for (let k = 0; k < m; k++) roles[start + k] = 'final';
  rec
    .begin({
      zh: `完成：${matches.length} 处匹配，起点 [${matches.join(', ')}]`,
      en: `Done: ${matches.length} matches, starts [${matches.join(', ')}]`,
    })
    .setArray(CODE(text), roles, [])
    .setAux([{ label: 'matches', value: `[${matches.join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
