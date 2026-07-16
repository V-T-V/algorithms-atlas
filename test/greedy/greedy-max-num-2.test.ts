import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxNum2 } from '../../src/algorithms/greedy/greedy-max-num-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-max-num-2/trace.ts';

test('maxNum [10,2] → "210"', () => {
  assert.equal(greedyMaxNum2([10, 2]).value, '210');
});

test('maxNum [3,30,34,5,9] → "9534330"', () => {
  assert.equal(greedyMaxNum2([3, 30, 34, 5, 9]).value, '9534330');
});

test('maxNum [0,0] → "0"', () => {
  assert.equal(greedyMaxNum2([0, 0]).value, '0');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
