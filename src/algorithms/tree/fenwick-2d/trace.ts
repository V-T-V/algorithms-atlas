// 二维树状数组 · 录制帧序列
// 演示：在 4x4 网格上做几次 update 与一次矩形查询。用 setGrid 展示数值矩阵。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Fenwick2D, type Fenwick2dHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 4x4 初始矩阵（0-based 行/列）
  initial: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ],
  updates: [
    { r: 2, c: 3, delta: 10 },
    { r: 4, c: 1, delta: -5 },
  ],
  query: { r1: 2, c1: 2, r2: 4, c2: 4 },
};

function snapshot(
  rec: TraceRecorder,
  mat: number[][],
  rows: number,
  cols: number,
  roleMap: Record<string, BarRole> = {},
): Frame['array2d'] {
  const rowsArr: Array<Array<string | number | undefined>> = [];
  for (let r = 1; r <= rows; r++) {
    const row: Array<string | number | undefined> = [];
    for (let c = 1; c <= cols; c++) row.push(mat[r]![c]);
    rowsArr.push(row);
  }
  return rec.gridFrom(rowsArr, roleMap);
}

export function buildTrace(
  input: {
    initial?: number[][];
    updates?: Array<{ r: number; c: number; delta: number }>;
    query?: { r1: number; c1: number; r2: number; c2: number };
  } = {},
): Frame[] {
  const {
    initial = DEFAULT_INPUT.initial,
    updates = DEFAULT_INPUT.updates,
    query = DEFAULT_INPUT.query,
  } = input;
  const rec = new TraceRecorder();
  const rows = initial.length;
  const cols = rows > 0 ? (initial[0]?.length ?? 0) : 0;

  // 先空构造，再手动 update 以触发 hook；hooks 闭包引用 ft（运行时已构造）
  const ftRef: { ft: Fenwick2D | null } = { ft: null };
  const hooks: Fenwick2dHooks = {
    onUpdate: (r, c, delta) => {
      const roles: Record<string, BarRole> = { [`${r - 1},${c - 1}`]: 'compare' };
      rec
        .begin({
          zh: `update(${r}, ${c}, ${delta})`,
          en: `update(${r}, ${c}, ${delta})`,
        })
        .setGrid(snapshot(rec, ftRef.ft!.mat, rows, cols, roles)!)
        .commit();
    },
    onQueryJump: (i, j, partial) => {
      const roles: Record<string, BarRole> = { [`${i - 1},${j - 1}`]: 'final' };
      rec
        .begin({
          zh: `prefixSum 跳点 tree[${i}][${j}]，累计 ${partial}`,
          en: `prefixSum jumps tree[${i}][${j}], partial ${partial}`,
        })
        .setGrid(snapshot(rec, ftRef.ft!.mat, rows, cols, roles)!)
        .setAux([
          { label: 'jump', value: `(${i},${j})`, role: 'final' },
          { label: 'partial', value: String(partial), role: 'compare' },
        ])
        .commit();
    },
  };

  const ft = new Fenwick2D(rows, cols, [], hooks);
  ftRef.ft = ft;
  // 插入初始矩阵（静默，避免 hook 噪音，统一一帧展示）
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (initial[r]![c]! !== 0) ft.update(r + 1, c + 1, initial[r]![c]!, true);
    }
  }
  rec
    .begin({
      zh: `初始 ${rows}×${cols} 矩阵已写入 2D BIT`,
      en: `Initial ${rows}x${cols} matrix loaded into 2D BIT`,
    })
    .setGrid(snapshot(rec, ft.mat, rows, cols)!)
    .commit();

  // 显式 update
  for (const u of updates) ft.update(u.r, u.c, u.delta);

  // 矩形查询：高亮查询区域
  const ans = ft.rectSum(query.r1, query.c1, query.r2, query.c2);
  const roles: Record<string, BarRole> = {};
  for (let r = query.r1; r <= query.r2; r++) {
    for (let c = query.c1; c <= query.c2; c++) roles[`${r - 1},${c - 1}`] = 'final';
  }
  rec
    .begin({
      zh: `矩形查询 [${query.r1},${query.c1}]–[${query.r2},${query.c2}] = ${ans}`,
      en: `Rect query [${query.r1},${query.c1}]-[${query.r2},${query.c2}] = ${ans}`,
    })
    .setGrid(snapshot(rec, ft.mat, rows, cols, roles)!)
    .commit();

  return rec.build();
}
