import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoSat } from '../../src/algorithms/randomized/rand-2sat-papadimitriou/impl.ts';
test('可满足', () => {
  // (x1∨x2)∧(¬x1∨x2) — satisfiable
  const a = twoSat(
    [
      [1, 2],
      [-1, 2],
    ],
    2,
    42,
  );
  assert.ok(a !== null);
});
