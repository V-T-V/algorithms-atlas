import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxNonConflict } from '../../src/algorithms/backtracking/bt-conflicting-appts/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-conflicting-appts/trace.ts';
test('maxNonConflict 正确', () => {
  assert.equal(
    maxNonConflict([
      { start: 1, end: 3 },
      { start: 2, end: 5 },
      { start: 4, end: 6 },
      { start: 6, end: 7 },
      { start: 5, end: 8 },
      { start: 7, end: 9 },
    ]),
    3,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
