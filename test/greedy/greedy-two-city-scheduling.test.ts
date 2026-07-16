import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyTwoCityScheduling } from '../../src/algorithms/greedy/greedy-two-city-scheduling/impl.ts';

test('greedy-two-city-scheduling 经典用例 = 110', () => {
  assert.equal(
    greedyTwoCityScheduling([
      [10, 20],
      [30, 200],
      [400, 50],
      [30, 20],
    ]),
    110,
  );
});

test('greedy-two-city-scheduling 最小费用', () => {
  assert.equal(
    greedyTwoCityScheduling([
      [259, 770],
      [448, 54],
      [926, 667],
      [184, 139],
    ]),
    1859,
  );
});
