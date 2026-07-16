import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyNonOverlapping } from '../../src/algorithms/greedy/greedy-non-overlapping/impl.ts';

test('greedy-non-overlapping 经典用例 = 1', () => {
  assert.equal(
    greedyNonOverlapping([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 3],
    ]),
    1,
  );
});

test('greedy-non-overlapping 全嵌套', () => {
  assert.equal(
    greedyNonOverlapping([
      [1, 10],
      [2, 5],
      [3, 4],
    ]),
    2,
  );
});

test('greedy-non-overlapping 已不重叠 = 0', () => {
  assert.equal(
    greedyNonOverlapping([
      [1, 2],
      [2, 3],
    ]),
    0,
  );
});
