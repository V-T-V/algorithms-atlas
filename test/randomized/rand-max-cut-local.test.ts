import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxCutLocal } from '../../src/algorithms/randomized/rand-max-cut-local/impl.ts';
test('三角形可分割 2 条', () => {
  const r = maxCutLocal(
    [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    3,
    42,
  );
  assert.ok(r.cut >= 2);
});
