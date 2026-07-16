import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxUnits } from '../../src/algorithms/greedy/greedy-max-units/impl.ts';

test('greedy-max-units 经典用例', () => {
  assert.equal(
    greedyMaxUnits(
      [
        [1, 3],
        [2, 2],
        [3, 1],
      ],
      4,
    ),
    8,
  );
});

test('greedy-max-units 容量 0', () => {
  assert.equal(greedyMaxUnits([[1, 3]], 0), 0);
});

test('greedy-max-units 全装下', () => {
  assert.equal(greedyMaxUnits([[2, 5]], 10), 10);
});
