import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Treap2 } from '../../src/algorithms/ds/ds-treap-2/impl.ts';

test('treap 中序有序', () => {
  const t = new Treap2();
  for (const v of [7, 3, 9, 1, 5]) t.insert(v);
  assert.deepEqual(t.toArray(), [1, 3, 5, 7, 9]);
});

test('treap 查询', () => {
  const t = new Treap2();
  for (const v of [7, 3, 9, 1, 5]) t.insert(v);
  assert.equal(t.contains(5), true);
  assert.equal(t.contains(6), false);
});
