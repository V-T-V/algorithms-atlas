import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RBTree } from '../../src/algorithms/ds/ds-rb-2/impl.ts';

test('rb 插入 + 查询', () => {
  const t = new RBTree();
  for (const v of [10, 20, 30, 40, 50, 25, 5, 15]) t.insert(v);
  for (const v of [10, 20, 30, 40, 50, 25, 5, 15]) assert.ok(t.contains(v));
  assert.equal(t.contains(99), false);
});

test('rb 根是黑', () => {
  const t = new RBTree();
  for (const v of [1, 2, 3]) t.insert(v);
  assert.equal(t.root!.red, false);
});
