import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SplayTree2 } from '../../src/algorithms/ds/ds-splay-2/impl.ts';

test('splay 中序有序', () => {
  const t = new SplayTree2();
  for (const v of [5, 1, 9, 3, 7]) t.insert(v);
  assert.deepEqual(t.toArray(), [1, 3, 5, 7, 9]);
});

test('splay 访问后仍保持 BST', () => {
  const t = new SplayTree2();
  for (const v of [5, 1, 9, 3, 7]) t.insert(v);
  assert.equal(t.contains(3), true);
  assert.equal(t.contains(6), false);
  assert.deepEqual(t.toArray(), [1, 3, 5, 7, 9]);
});
