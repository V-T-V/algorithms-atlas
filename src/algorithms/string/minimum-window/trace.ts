// =============================================================================
// 最小覆盖子串 · 录制帧序列
// 用 setArray 展示主串（values 取字符码），pointers 标注 left/right 窗口边界；
// setAux 展示「需求 need」与「已有 have」字符计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimumWindow, countChars, type MinimumWindowHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string; t: string } = {
  s: 'ADOBECODEBANC',
  t: 'ABC',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { s: string; t: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, t } = input;
  const n = s.length;

  let left = 0;
  let right = -1;
  let curRole: BarRole = 'default';
  const need = countChars(t);
  const have = new Map<string, number>();
  let bestStart = -1;
  let bestLen = Infinity;

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const needStr = Array.from(need.entries())
      .map(([c, v]) => `${c}:${v}`)
      .join(' ');
    const haveStr = Array.from(need.keys())
      .map((c) => `${c}:${have.get(c) ?? 0}`)
      .join(' ');
    return [
      { label: 's', value: s, role: 'default' },
      { label: 't', value: t, role: 'pivot' },
      { label: 'need', value: needStr, role: 'frontier' },
      { label: 'have', value: haveStr, role: 'compare' },
      {
        label: '最优',
        value: bestStart < 0 ? '—' : s.slice(bestStart, bestStart + bestLen),
        role: 'final',
      },
    ];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    // 高亮当前窗口
    for (let k = left; k <= right && k < n; k++) roles[k] = 'frontier';
    // 最优区间标记为 final（弱化）
    if (bestStart >= 0) {
      for (let k = 0; k < bestLen; k++) roles[bestStart + k] = 'sorted';
    }
    // 当前比较/扩展位
    if (right >= 0 && right < n) roles[right] = curRole === 'default' ? 'compare' : curRole;
    const pointers: Array<{ index: number; label: string }> = [];
    if (left >= 0 && left < n) pointers.push({ index: left, label: 'L' });
    if (right >= 0 && right < n) pointers.push({ index: right, label: 'R' });
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(auxRows()).commit();
    curRole = 'default';
  };

  snapshot({
    zh: `在 s 中找包含 t="${t}" 所有字符的最短子串`,
    en: `Find shortest substring of s covering all chars of t="${t}"`,
  });

  const hooks: MinimumWindowHooks = {
    onExpand: (l, r, c) => {
      left = l;
      right = r;
      curRole = 'compare';
      if (need.has(c)) have.set(c, (have.get(c) ?? 0) + 1);
      snapshot({
        zh: `R=${r}：纳入 '${c}'，窗口 [${l}, ${r}]`,
        en: `R=${r}: include '${c}', window [${l}, ${r}]`,
      });
    },
    onCandidate: (start, end, len) => {
      if (len < bestLen) {
        bestLen = len;
        bestStart = start;
      }
      curRole = 'final';
      snapshot({
        zh: `候选 [${start}, ${end}] 长度 ${len}，当前最优="${s.slice(bestStart, bestStart + bestLen)}"`,
        en: `Candidate [${start}, ${end}] len ${len}, best="${s.slice(bestStart, bestStart + bestLen)}"`,
      });
    },
    onShrink: (l, r, c) => {
      left = l;
      right = r;
      curRole = 'warn';
      snapshot({
        zh: `L=${l}：收缩，移除 '${c}'，窗口 [${l + 1}, ${r}]`,
        en: `L=${l}: shrink, drop '${c}', window [${l + 1}, ${r}]`,
      });
      if (need.has(c)) have.set(c, (have.get(c) ?? 0) - 1);
    },
    onDone: (start, len) => {
      bestStart = start < 0 ? bestStart : start;
      bestLen = start < 0 ? bestLen : len;
    },
  };

  minimumWindow(s, t, hooks);

  // 终态
  const roles: BarRole[] = new Array(n).fill('default');
  if (bestStart >= 0) {
    for (let k = 0; k < bestLen; k++) roles[bestStart + k] = 'final';
  }
  const result = bestStart >= 0 ? s.slice(bestStart, bestStart + bestLen) : '';
  rec
    .begin({
      zh: bestStart < 0 ? '无解：s 不覆盖 t' : `完成：最短覆盖子串 = "${result}"`,
      en: bestStart < 0 ? 'No solution: s does not cover t' : `Done: minimum window = "${result}"`,
    })
    .setArray(CODE(s), roles, [])
    .setAux([{ label: '结果', value: result || '—', role: 'final' }, ...auxRows()])
    .commit();

  return rec.build();
}
