import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exist } from '../../src/algorithms/backtracking/bt-word-search/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-word-search/trace.ts';
test('exist 正确', () => {
  assert.equal(
    exist(
      [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E'],
      ].map((r) => [...r]),
      'ABCCED',
    ),
    true,
  );
  assert.equal(
    exist(
      [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E'],
      ].map((r) => [...r]),
      'SEE',
    ),
    true,
  );
  assert.equal(
    exist(
      [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E'],
      ].map((r) => [...r]),
      'ABCB',
    ),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
