// =============================================================================
// Boyer-Moore-Horspool · 录制帧序列
// 用 setArray 展示文本（values 取字符码），pointers 标注模式首字符对齐位置 (pos)
// 与当前比较位 (ti)；setAux 展示模式与坏字符表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bmHorspool, buildBadCharTable, type BmHorspoolHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'GCATCGCAGAGAGTATACAGTACG',
  pat: 'GCAGAGAG',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const n = text.length;
  const m = pat.length;

  let pos = 0; // 模式首字符对齐的文本下标
  let curTi = -1; // 当前比较的文本下标
  let curRole: BarRole = 'default';
  const matches: number[] = [];
  const shift = buildBadCharTable(pat);

  const textAux = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const shiftEntries = Array.from(shift.entries())
      .map(([c, s]) => `${c}:${s}`)
      .join(' ');
    return [
      { label: 'text', value: text, role: 'default' },
      { label: 'pat', value: pat, role: 'default' },
      { label: '坏字符表', value: shiftEntries || '(空)', role: 'pivot' },
      { label: 'pos', value: String(pos), role: 'frontier' },
    ];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    // 高亮模式对齐区间
    for (let k = 0; k < m; k++) {
      const idx = pos + k;
      if (idx >= 0 && idx < n) roles[idx] = 'frontier';
    }
    if (curTi >= 0 && curTi < n) roles[curTi] = curRole;
    // 命中区间 final
    for (const start of matches) {
      for (let k = 0; k < m; k++) roles[start + k] = 'final';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos >= 0 && pos < n) pointers.push({ index: pos, label: 'pat0' });
    if (curTi >= 0 && curTi < n) pointers.push({ index: curTi, label: 'cmp' });
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(textAux()).commit();
    curRole = 'default';
  };

  snapshot({
    zh: `在 text 中查找 pat="${pat}"（坏字符表已构造）`,
    en: `Search pat="${pat}" in text (bad-char table ready)`,
  });

  const hooks: BmHorspoolHooks = {
    onAlign: (p) => {
      pos = p;
    },
    onCompare: (j, ti, eq) => {
      curTi = ti;
      curRole = eq ? 'compare' : 'warn';
      snapshot({
        zh: `比较 pat[${j}]='${pat[j]}' 与 text[${ti}]='${text[ti]}' ${eq ? '（相等）' : '（不等）'}`,
        en: `Compare pat[${j}]='${pat[j]}' vs text[${ti}]='${text[ti]}' ${eq ? '(match)' : '(mismatch)'}`,
      });
    },
    onFound: (start) => {
      matches.push(start);
      curTi = start + m - 1;
      curRole = 'final';
      snapshot({
        zh: `命中！匹配起点 = ${start}`,
        en: `Found! match start = ${start}`,
      });
    },
    onShift: (oldPos, newPos, badChar) => {
      pos = newPos;
      const step = newPos - oldPos;
      curTi = oldPos + m - 1;
      curRole = 'swap';
      snapshot({
        zh: `坏字符 '${badChar}' → 滑动 ${step} 位（pos ${oldPos} → ${newPos}）`,
        en: `Bad char '${badChar}' → shift ${step} (pos ${oldPos} → ${newPos})`,
      });
    },
  };

  bmHorspool(text, pat, hooks);

  // 终态
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
