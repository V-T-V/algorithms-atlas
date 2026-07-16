import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyRefuelingStops } from '../../src/algorithms/greedy/greedy-refueling-stops/impl.ts';

test('greedy-refueling-stops 经典用例 = 2', () => {
  assert.equal(
    greedyRefuelingStops(100, 10, [
      [10, 60],
      [20, 30],
      [30, 30],
      [60, 40],
    ]),
    2,
  );
});

test('greedy-refueling-stops 无需加油', () => {
  assert.equal(greedyRefuelingStops(1, 1, []), 0);
});

test('greedy-refueling-stops 无法到达 = -1', () => {
  assert.equal(greedyRefuelingStops(100, 1, [[10, 100]]), -1);
});
