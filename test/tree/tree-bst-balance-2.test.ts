import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, balanceFactors } from '../../src/algorithms/tree/tree-bst-balance-2/impl.ts';
import { buildTrace } from '../../src/algorithms/tree/tree-bst-balance-2/trace.ts';
test('balanceFactors 正确', () => {
  const fs = balanceFactors(buildTree([1, 2, 3, 4]));
  const m = new Map(fs.map((f) => [f.v, f.bf]));
  assert.equal(m.get(4), 0);
  assert.equal(m.get(2), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
