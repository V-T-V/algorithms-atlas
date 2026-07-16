import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knightsTour } from '../../src/algorithms/backtracking/bt-knight-tour/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-knight-tour/trace.ts';
test('knightsTour 正确', () => {
  const b = knightsTour(5, 0, 0);
  assert.ok(b !== null);
  const flat = b!.flat().sort((a, x) => a - x);
  assert.deepEqual(
    flat,
    Array.from({ length: 25 }, (_, i) => i),
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
