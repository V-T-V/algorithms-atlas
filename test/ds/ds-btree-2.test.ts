import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BTree2 } from '../../src/algorithms/ds/ds-btree-2/impl.ts';

test('btree 插入 + 查询', () => {
  const t = new BTree2();
  for (const v of [10, 20, 5, 6, 12, 30, 7, 17]) t.insert(v);
  for (const v of [10, 20, 5, 6, 12, 30, 7, 17]) assert.ok(t.contains(v));
  assert.equal(t.contains(99), false);
});

test('btree 根分裂', () => {
  const t = new BTree2();
  // 1,2,3 填满根，4 触发分裂
  for (const v of [1, 2, 3, 4]) t.insert(v);
  assert.equal(t.root!.keys.length, 1); // 根只有 1 键（中间）
  assert.equal(t.root!.children.length, 2);
});
