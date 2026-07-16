import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pacificAtlantic } from '../../src/algorithms/recursion/rec-pacific-atlantic/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-pacific-atlantic/trace.ts';

test('rec-pacific-atlantic 经典用例', () => {
  const heights = [
    [1, 2, 2, 3, 5],
    [3, 2, 3, 4, 4],
    [2, 4, 5, 3, 1],
    [6, 7, 1, 4, 5],
    [5, 1, 1, 2, 4],
  ];
  const result = pacificAtlantic(heights);
  assert.equal(result.length, 7);
  // 角落应在结果中
  assert.ok(result.some(([r, c]) => r === 0 && c === 4)); // 右上
  assert.ok(result.some(([r, c]) => r === 4 && c === 0)); // 左下
});

test('rec-pacific-atlantic 单格', () => {
  assert.deepEqual(pacificAtlantic([[1]]), [[0, 0]]);
});

test('rec-pacific-atlantic 全相等', () => {
  // 所有格子都可达两洋
  const result = pacificAtlantic([
    [2, 2],
    [2, 2],
  ]);
  assert.equal(result.length, 4);
});

test('rec-pacific-atlantic 单行', () => {
  const result = pacificAtlantic([[1, 2, 3]]);
  assert.equal(result.length, 3);
});

test('rec-pacific-atlantic trace', () => {
  assert.ok(buildTrace().length > 2);
});
