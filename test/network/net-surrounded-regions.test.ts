import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveSurrounded } from '../../src/algorithms/network/net-surrounded-regions/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-surrounded-regions/trace.ts';
test('solveSurrounded 正确', () => {
  const b = [
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'X'],
    ['X', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'X'],
  ].map((r) => [...r]);
  solveSurrounded(b);
  assert.deepEqual(b, [
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X'],
    ['X', 'O', 'X', 'X'],
  ]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
