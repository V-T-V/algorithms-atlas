import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyGasStation2 } from '../../src/algorithms/greedy/greedy-gas-station-2/impl.ts';

test('greedy-gas-station-2 经典用例', () => {
  assert.equal(greedyGasStation2([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3);
});

test('greedy-gas-station-2 无解', () => {
  assert.equal(greedyGasStation2([2, 3, 4], [3, 4, 3]), -1);
});

test('greedy-gas-station-2 单站有解', () => {
  assert.equal(greedyGasStation2([5], [4]), 0);
});

test('greedy-gas-station-2 总油恰等于总耗', () => {
  assert.equal(greedyGasStation2([5, 1, 2, 3, 4], [4, 4, 4, 4, 4]), 4);
});
