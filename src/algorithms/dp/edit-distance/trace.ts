// =============================================================================
// 编辑距离 · 录制帧序列
// 用二维 grid 展示 dp 表：行标 = a 的字符，列标 = b 的字符。
// 当前填格标 'compare'，回溯路径标 'final'，match 贡献点标 'pivot'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { editDistance, type EditDistanceHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = { a: 'kitten', b: 'sitting' };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const m = a.length;
  const n = b.length;

  // dp 表：(m+1) x (n+1)，未填记 -1
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    new Array<number>(n + 1).fill(i === 0 ? -1 : -1),
  );
  // 边界：第 0 行 j、第 0 列 i 已知
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;

  let curI = -1;
  let curJ = -1;
  const matchPath = new Set<string>(); // 回溯出的 match 贡献点 "i,j"
  const walkPath = new Set<string>(); // 整条回溯路径 "i,j"

  /** 渲染带表头的 grid。 */
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头行：左上角 'a\b' + b 的各字符
    const header: Cell[] = [{ v: 'a\\b', role: 'default' }];
    header.push({ v: 'ε', role: 'pivot' }); // 空串列
    for (let j = 0; j < n; j++) header.push({ v: b[j]!, role: 'pivot' });
    grid.push(header);
    // 数据行
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
        { label: 'a', value: `"${a}"`, role: 'default' },
        { label: 'b', value: `"${b}"`, role: 'default' },
      ])
      .commit();
  };

  snapshot({ zh: `求 "${a}" → "${b}" 的编辑距离`, en: `Edit distance "${a}" → "${b}"` });

  const hooks: EditDistanceHooks = {
    onFillCell: (i, j, val, from) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      const note =
        from === 'match'
          ? {
              zh: `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}'，dp[${i}][${j}] = ${val}（字符相同，免操作）`,
              en: `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}', dp[${i}][${j}] = ${val} (equal, free)`,
            }
          : {
              zh: `a[${i - 1}]≠b[${j - 1}]，dp[${i}][${j}] = ${val}（${from === 'replace' ? '替换' : from === 'delete' ? '删除 a[' + (i - 1) + ']' : '插入 b[' + (j - 1) + ']'}）`,
              en: `a[${i - 1}]≠b[${j - 1}], dp[${i}][${j}] = ${val} (${from === 'replace' ? 'replace' : from === 'delete' ? 'delete a[' + (i - 1) + ']' : 'insert b[' + (j - 1) + ']'})`,
            };
      snapshot(note);
    },
    onBacktrack: (i, j, op) => {
      walkPath.add(`${i},${j}`);
      if (op === 'match') matchPath.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      snapshot(
        op === 'match'
          ? {
              zh: `回溯 (${i},${j})：字符相同（保留）`,
              en: `Backtrack (${i},${j}): equal (keep)`,
            }
          : {
              zh: `回溯 (${i},${j})：${op === 'replace' ? '替换' : op === 'delete' ? '删除' : '插入'}`,
              en: `Backtrack (${i},${j}): ${op}`,
            },
      );
    },
  };

  const result = editDistance(a, b, hooks);

  // 终态
  rec
    .begin({
      zh: `编辑距离 = ${result}`,
      en: `Edit distance = ${result}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '距离', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
