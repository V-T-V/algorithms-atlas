import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equationsPossible } from '../../src/algorithms/network/net-satisfy-eq-equations/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-satisfy-eq-equations/trace.ts';
test('equationsPossible 正确', () => {
  assert.equal(equationsPossible(['a==b', 'b!=a']), false);
  assert.equal(equationsPossible(['a==b', 'b==c', 'a==c']), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
