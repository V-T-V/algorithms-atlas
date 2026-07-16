import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iqr } from '../../src/algorithms/selection/sel-iqr/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-iqr/trace.ts';

test('sel-iqr 基本', () => {
  const r = iqr([1, 2, 3, 4, 5]);
  assert.ok(r.iqr > 0);
});

test('sel-iqr 检测离群点', () => {
  const r = iqr([1, 2, 3, 4, 5, 100]);
  assert.ok(r.outliers.includes(100));
});

test('sel-iqr 无离群点', () => {
  const r = iqr([1, 2, 3, 4, 5]);
  assert.equal(r.outliers.length, 0);
});

test('sel-iqr 等价于 Q3-Q1', () => {
  const r = iqr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.ok(Math.abs(r.iqr - (r.q3 - r.q1)) < 1e-9);
});

test('sel-iqr trace', () => {
  assert.ok(buildTrace().length >= 2);
});
