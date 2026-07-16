import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyGas3 } from '../../src/algorithms/greedy/greedy-gas-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-gas-3/trace.ts';

test('加油站可行起点 = 3', () => {
  const r = greedyGas3([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]);
  assert.equal(r.start, 3);
  assert.equal(r.feasible, true);
});

test('总油不足则不可行', () => {
  const r = greedyGas3([2, 3, 4], [3, 4, 3]);
  assert.equal(r.feasible, false);
  assert.equal(r.start, -1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
