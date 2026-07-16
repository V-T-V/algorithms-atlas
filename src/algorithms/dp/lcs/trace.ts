// =============================================================================
// 最长公共子序列 LCS · 录制帧序列
// 用二维 grid 展示 dp 表：行标 = A 的字符，列标 = B 的字符。
// 当前填的格标 'compare'，回溯路径标 'final'，匹配贡献点标 'pivot'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcs, type LcsHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = { a: 'ABCBDAB', b: 'BDCAB' };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const m = a.length;
  const n = b.length;

  // dp 表：(m+1) x (n+1)，未填记 -1（首行/首列恒 0）
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    new Array<number>(n + 1).fill(i === 0 ? 0 : -1),
  );
  for (let j = 0; j <= n; j++) dp[0]![j] = 0;

  let curI = -1;
  let curJ = -1;
  const matchPath = new Set<string>(); // 回溯出的「匹配贡献点」"i,j"
  const walkPath = new Set<string>(); // 整条回溯路径 "i,j"

  /** 把当前 dp 渲染成带表头的 grid。 */
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头行：左上角空 + B 的各字符
    const header: Cell[] = [{ v: ' ', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: b[j]!, role: 'pivot' });
    grid.push(header);
    // 数据行：第 0 行前缀为 ε，其余为 a[i-1]
    for (let i = 0; i <= m; i++) {
      const row: Cell[] = [{ v: i === 0 ? 'ε' : a[i - 1]!, role: 'pivot' }];
      for (let j = 0; j <= n; j++) {
        const key = `${i},${j}`;
        let role: BarRole = 'default';
        if (matchPath.has(key)) role = 'pivot';
        else if (walkPath.has(key)) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        row.push({ v: dp[i]![j]! < 0 ? '·' : dp[i]![j]!, role });
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
        { label: 'A', value: a, role: 'default' },
        { label: 'B', value: b, role: 'default' },
      ])
      .commit();
  };

  snapshot({ zh: `求 LCS：A="${a}"，B="${b}"`, en: `Find LCS: A="${a}", B="${b}"` });

  const hooks: LcsHooks = {
    onFillCell: (i, j, val, from) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      const note =
        from === 'match'
          ? {
              zh: `A[${i - 1}]='${a[i - 1]}' = B[${j - 1}]='${b[j - 1]}'，dp[${i}][${j}] = ${val}（匹配，取左上+1）`,
              en: `A[${i - 1}]='${a[i - 1]}' = B[${j - 1}]='${b[j - 1]}', dp[${i}][${j}] = ${val} (match, ↖+1)`,
            }
          : {
              zh: `A[${i - 1}]≠B[${j - 1}]，dp[${i}][${j}] = ${val}（取${from === 'up' ? '上' : '左'}）`,
              en: `A[${i - 1}]≠B[${j - 1}], dp[${i}][${j}] = ${val} (take ${from === 'up' ? '↑ up' : '← left'})`,
            };
      snapshot(note);
    },
    onBacktrack: (i, j, isMatch) => {
      walkPath.add(`${i},${j}`);
      if (isMatch) matchPath.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      snapshot(
        isMatch
          ? {
              zh: `回溯到 (${i},${j})：A[${i - 1}]='${a[i - 1]}' 是公共字符`,
              en: `Backtrack to (${i},${j}): A[${i - 1}]='${a[i - 1]}' is a common char`,
            }
          : {
              zh: `回溯经过 (${i},${j})`,
              en: `Backtrack through (${i},${j})`,
            },
      );
    },
  };

  const result = lcs(a, b, hooks);

  // 终态：保持回溯高亮
  rec
    .begin({
      zh: `LCS = "${result}"（长度 ${result.length}）`,
      en: `LCS = "${result}" (length ${result.length})`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: 'LCS', value: `"${result}"`, role: 'final' }])
    .commit();

  return rec.build();
}
