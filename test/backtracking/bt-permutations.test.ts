import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permutations } from '../../src/algorithms/backtracking/bt-permutations/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-permutations/trace.ts';
test('permutations 正确', () => {
  const p = permutations([1, 2, 3]);
  assert.equal(p.length, 6);
  assert.ok(p.some((x) => x.join('') === '123'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
