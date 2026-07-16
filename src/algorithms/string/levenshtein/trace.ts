// =============================================================================
// 莱文斯坦距离 · 录制帧序列
// 用 setGrid 展示 (n+1)×(m+1) DP 表，行 = a 的前缀、列 = b 的前缀；末帧用 final
// 高亮回溯路径。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { levenshtein, backtrack, type LevenshteinHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'kitten',
  b: 'sitting',
};

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const n = a.length;
  const m = b.length;

  // 当前 DP 表
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  // 回溯路径上的格子集合（"r,c"，含表头偏移）
  let pathCells = new Set<string>();
  let cur: { i: number; j: number; from: 'diag' | 'left' | 'top' } | null = null;

  const gridFrom = (): Cell[][] => {
    // 表头行：空格 + b 的字符（首格留空）
    const header: Array<string | number | undefined> = ['', ...Array.from(b)];
    const rows: Array<Array<string | number | undefined>> = [header];
    for (let i = 0; i <= n; i++) {
      const rowLabel = i === 0 ? '∅' : a[i - 1]!;
      const rowVals: Array<string | number | undefined> = [rowLabel];
      for (let j = 0; j <= m; j++) rowVals.push(dp[i]![j]!);
      rows.push(rowVals);
    }
    const roles: Record<string, BarRole> = {};
    // 表头行 / 首列设为 pivot 高亮
    for (let c = 0; c <= m; c++) roles[`0,${c}`] = 'pivot';
    for (let r = 0; r <= n; r++) roles[`${r},0`] = 'pivot';
    for (const key of pathCells) roles[key] = 'final';
    if (cur) roles[`${cur.i + 1},${cur.j + 1}`] = 'frontier'; // +1 偏移表头行
    return rec.gridFrom(rows, roles);
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(gridFrom())
      .setAux([
        { label: 'a', value: a, role: 'default' },
        { label: 'b', value: b, role: 'default' },
        {
          label: '当前',
          value: cur ? `(${cur.i},${cur.j}) via ${cur.from}` : '—',
          role: 'frontier',
        },
        {
          label: '已回溯步数',
          value: String(pathCells.size),
          role: 'compare',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `求 "${a}" → "${b}" 的编辑距离（DP 表）`,
    en: `Edit distance "${a}" → "${b}" (DP table)`,
  });

  const hooks: LevenshteinHooks = {
    onSet: (i, j, value, from) => {
      cur = { i, j, from };
      dp[i]![j] = value;
      if (i >= 1 && j >= 1) {
        snapshot({
          zh: `填 dp[${i}][${j}] = ${value}（来自 ${from}）`,
          en: `dp[${i}][${j}] = ${value} (from ${from})`,
        });
      }
    },
  };

  const distance = levenshtein(a, b, hooks);

  // 重新构造一份完整 DP 表用于回溯（与 impl 内部一致），并标记回溯路径
  const dpForBack: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = 0; i <= n; i++) dpForBack[i]![0] = i;
  for (let j = 0; j <= m; j++) dpForBack[0]![j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dpForBack[i]![j] = Math.min(
        dpForBack[i - 1]![j - 1]! + cost,
        dpForBack[i]![j - 1]! + 1,
        dpForBack[i - 1]![j]! + 1,
      );
    }
  }
  const path = backtrack(a, b, dpForBack);
  pathCells = new Set<string>();
  for (const step of path) pathCells.add(`${step.i + 1},${step.j + 1}`);
  cur = null;

  // 终态：高亮回溯路径
  rec
    .begin({
      zh: `编辑距离 = ${distance}（高亮为一条最优编辑路径）`,
      en: `Edit distance = ${distance} (highlighted: an optimal edit path)`,
    })
    .setGrid(gridFrom())
    .setAux([
      { label: '距离', value: String(distance), role: 'final' },
      {
        label: '编辑序列',
        value: path.map((s) => s.op).join(' → '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
