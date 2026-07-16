import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsetsWithDup } from '../../src/algorithms/backtracking/bt-subset-unique/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-subset-unique/trace.ts';
test('subsetsWithDup 正确', () => {
  const r = subsetsWithDup([1, 2, 2]);
  assert.equal(r.length, 6);
  assert.ok(r.some((x) => x.join(',') === '2,2'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
