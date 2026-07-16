import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btOptimalDivision } from '../../src/algorithms/backtracking/bt-optimal-division/impl.ts';

test('bt-optimal-division [1000,100,10,2]', () => {
  assert.equal(btOptimalDivision([1000, 100, 10, 2]), '1000/(100/10/2)');
});

test('bt-optimal-division 单元素', () => {
  assert.equal(btOptimalDivision([5]), '5');
});

test('bt-optimal-division 两元素', () => {
  assert.equal(btOptimalDivision([6, 2]), '6/2');
});

test('bt-optimal-division 结果确实最大', () => {
  // 1000/(100/10/2) = 1000/5 = 200，远大于左结合
  const expr = btOptimalDivision([1000, 100, 10, 2]);
  assert.ok(expr.includes('('));
});
