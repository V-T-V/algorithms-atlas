import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMazePath } from '../../src/algorithms/backtracking/bt-rat-in-maze/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-rat-in-maze/trace.ts';
test('findMazePath 正确', () => {
  const p = findMazePath(
    [
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [1, 0, 1, 0],
      [0, 0, 0, 0],
    ].map((r) => [...r]),
  );
  assert.ok(p !== null);
  assert.deepEqual(p![0], [0, 0]);
  assert.deepEqual(p![p!.length - 1], [3, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
