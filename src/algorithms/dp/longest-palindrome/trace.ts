// =============================================================================
// 最长回文子串 · 录制帧序列
// 用二维 grid 展示回文表 dp[i][j]：行/列均为字符下标。
// 真（回文）格标 'final'，当前判定的 (i,j) 标 'compare'，最长回文覆盖格标 'pivot'。
// 仅展示上三角（i <= j）。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestPalindrome, type LongestPalindromeHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'babad' };

/** 录制演示帧序列。 */
export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;
  const n = s.length;

  if (n === 0) {
    rec.begin({ zh: '空串', en: 'Empty string' }).commit();
    return rec.build();
  }

  // dp[i][j]：s[i..j] 是否回文；未判定记 undefined
  const dp: (boolean | undefined)[][] = Array.from({ length: n }, () =>
    new Array<boolean | undefined>(n).fill(undefined),
  );

  let curI = -1;
  let curJ = -1;
  let bestStart = 0;
  let bestEnd = 0; // 闭区间

  /** 渲染带表头的 grid（上三角）。 */
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：左上角 'i\j' + 各列字符
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: s[j]!, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: s[i]!, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        if (j < i) {
          row.push({ v: ' ', role: 'default' }); // 下三角留空
        } else {
          const inBest = i >= bestStart && j <= bestEnd;
          let role: BarRole = 'default';
          if (inBest && dp[i]![j] === true) role = 'pivot';
          else if (dp[i]![j] === true) role = 'final';
          else if (curI === i && curJ === j) role = 'compare';
          const v = dp[i]![j];
          row.push({ v: v === undefined ? '·' : v ? 'T' : 'F', role });
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '串', value: `"${s}"`, role: 'default' },
        { label: '当前最长', value: s.slice(bestStart, bestEnd + 1), role: 'final' },
      ])
      .commit();
  };

  snapshot({ zh: `求 "${s}" 的最长回文子串`, en: `Longest palindrome in "${s}"` });

  const hooks: LongestPalindromeHooks = {
    onCheck: (i, j, isPal) => {
      dp[i]![j] = isPal;
      curI = i;
      curJ = j;
      snapshot({
        zh: `判定 s[${i}..${j}] = "${s.slice(i, j + 1)}"：${isPal ? '是回文 ✓' : '非回文 ✗'}`,
        en: `Check s[${i}..${j}] = "${s.slice(i, j + 1)}": ${isPal ? 'palindrome ✓' : 'not ✗'}`,
      });
    },
    onUpdateBest: (i, j, length) => {
      bestStart = i;
      bestEnd = j;
      curI = -1;
      curJ = -1;
      snapshot({
        zh: `发现更长回文 "${s.slice(i, j + 1)}"（长度 ${length}）`,
        en: `New longest palindrome "${s.slice(i, j + 1)}" (length ${length})`,
      });
    },
  };

  const result = longestPalindrome(s, hooks);

  // 终态
  curI = -1;
  curJ = -1;
  rec
    .begin({
      zh: `最长回文子串 = "${result}"（长度 ${result.length}）`,
      en: `Longest palindrome = "${result}" (length ${result.length})`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '答案', value: `"${result}"`, role: 'final' }])
    .commit();

  return rec.build();
}
