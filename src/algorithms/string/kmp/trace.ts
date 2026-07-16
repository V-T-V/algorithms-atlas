// =============================================================================
// KMP 模式匹配 · 录制帧序列
// 用 setArray 展示主串（values 取字符码），pointers 标注 文本指针 i 与
// 模式串对齐起点 (i - j)；setAux 展示模式串与 lps（失败指针）数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kmp, type KmpHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'ABABDABACDABABCABAB',
  pat: 'ABABCABAB',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  // lps 表（构造期间逐位填入）
  const lps: number[] = new Array<number>(m).fill(0);
  // 当前文本指针 i、模式指针 j
  let i = -1;
  let j = -1;
  // 命中的匹配起点（终态高亮）
  const matches: number[] = [];
  // 当前比较格的角色
  let roleI: BarRole = 'default';

  const textAux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: text, role: 'default' },
    { label: 'pat', value: pat, role: 'default' },
    {
      label: 'lps',
      value: `[${lps.join(', ')}]`,
      role: 'default',
    },
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

  const hooks: KmpHooks = {
    onSetLps: (idx, value) => {
      lps[idx] = value;
    },
    onMatch: (ti, pj) => {
      i = ti;
      j = pj;
      roleI = 'compare';
      snapshot({
        zh: `匹配：text[${ti}]='${text[ti]}' = pat[${pj}]='${pat[pj]}'，i、j 各 +1`,
        en: `Match: text[${ti}]='${text[ti]}' = pat[${pj}]='${pat[pj]}', advance i & j`,
      });
    },
    onMismatch: (ti, pj) => {
      i = ti;
      j = pj;
      roleI = 'warn';
      snapshot({
        zh: `失配：text[${ti}]='${ti < n ? text[ti] : '#'}' ≠ pat[${pj}]='${pat[pj]}'`,
        en: `Mismatch: text[${ti}]='${ti < n ? text[ti] : '#'}' ≠ pat[${pj}]='${pat[pj]}'`,
      });
    },
    onShift: (ti, fromJ, toJ) => {
      i = ti;
      j = toJ;
      roleI = 'frontier';
      snapshot({
        zh: `利用 lps 把 j 从 ${fromJ} 移到 ${toJ}（i 不回退）`,
        en: `Use lps to move j from ${fromJ} to ${toJ} (i stays)`,
      });
    },
    onFound: (endIdx) => {
      const start = endIdx - m + 1;
      matches.push(start);
      i = endIdx;
      roleI = 'final';
      snapshot({
        zh: `命中！匹配起点 = ${start}`,
        en: `Found! match start = ${start}`,
      });
    },
  };

  kmp(text, pat, hooks);

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
