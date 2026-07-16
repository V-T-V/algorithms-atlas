import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPeak2D } from '../../src/algorithms/searching/search-peak-2d/impl.ts';

/** 校验 返回坐标 是否为合法二维峰值（≥ 上下左右）。 */
function isPeak(m: number[][], r: number, c: number): boolean {
  const v = m[r]![c]!;
  const up = r > 0 ? m[r - 1]![c]! : -Infinity;
  const down = r < m.length - 1 ? m[r + 1]![c]! : -Infinity;
  const lft = c > 0 ? m[r]![c - 1]! : -Infinity;
  const rgt = c < m[0]!.length - 1 ? m[r]![c + 1]! : -Infinity;
  return v >= up && v >= down && v >= lft && v >= rgt;
}

test('findPeak2D 返回合法峰值', () => {
  const m = [
    [10, 8, 10, 10],
    [14, 13, 12, 11],
    [15, 9, 11, 17],
    [16, 21, 19, 20],
  ];
  const p = findPeak2D(m);
  assert.ok(isPeak(m, p.row, p.col), `(${p.row},${p.col}) 非峰值`);
});

test('findPeak2D 单元素矩阵', () => {
  const p = findPeak2D([[42]]);
  assert.deepEqual(p, { row: 0, col: 0 });
});

test('findPeak2D 单列矩阵', () => {
  const m = [[1], [3], [2], [5], [4]];
  const p = findPeak2D(m);
  assert.ok(isPeak(m, p.row, p.col));
});

test('findPeak2D 单行矩阵', () => {
  const m = [[1, 3, 2, 5, 4]];
  const p = findPeak2D(m);
  assert.ok(isPeak(m, p.row, p.col));
});

test('findPeak2D 随机矩阵均返回合法峰值', () => {
  for (let t = 0; t < 50; t++) {
    const rows = 1 + Math.floor(Math.random() * 8);
    const cols = 1 + Math.floor(Math.random() * 8);
    const m: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) row.push(Math.floor(Math.random() * 100));
      m.push(row);
    }
    const p = findPeak2D(m);
    assert.ok(isPeak(m, p.row, p.col), `随机 ${rows}x${cols} 矩阵返回非峰值`);
  }
});
