import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iqr } from '../../src/algorithms/selection/sel-iqr-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-iqr-2/trace.ts';

test('iqr 1..5 = 2', () => {
  // Q1=2, Q3=4 → IQR=2
  assert.equal(iqr([1, 2, 3, 4, 5]), 2);
});
test('iqr 常数数组 = 0', () => assert.equal(iqr([7, 7, 7, 7]), 0));
test('iqr trace 非空', () => assert.ok(buildTrace().length > 0));
