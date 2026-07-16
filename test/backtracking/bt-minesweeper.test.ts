import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateBoard } from '../../src/algorithms/backtracking/bt-minesweeper/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-minesweeper/trace.ts';
test('updateBoard 正确', () => {
  const b = [
    ['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
  ].map((r) => [...r]);
  updateBoard(b, [3, 0]);
  assert.equal(b[3]![0], 'B');
  assert.equal(b[1]![2], 'M');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
