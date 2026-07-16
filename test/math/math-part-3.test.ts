import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partitionTable } from '../../src/algorithms/math/math-part-3/impl.ts';

test('partition p(n) 前 10 项', () => {
  // p(1..10) = 1,2,3,5,7,11,15,22,30,42
  const p = partitionTable(10);
  assert.deepEqual(
    p.slice(1).map((x) => Number(x)),
    [1, 2, 3, 5, 7, 11, 15, 22, 30, 42],
  );
});
