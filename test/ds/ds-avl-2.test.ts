import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AvlTree2 } from '../../src/algorithms/ds/ds-avl-2/impl.ts';

function height(n: { left: unknown; right: unknown } | null): number {
  if (!n) return 0;
  return 1 + Math.max(height(n.left as never), height(n.right as never));
}

test('avl 插入 + 平衡', () => {
  const t = new AvlTree2();
  for (const v of [10, 20, 30, 40, 50, 25, 5]) t.insert(v);
  for (const v of [10, 20, 30, 40, 50, 25, 5]) assert.ok(t.contains(v));
  assert.equal(t.root!.value, 30); // 应是平衡后的根
});

test('avl 高度合理', () => {
  const t = new AvlTree2();
  for (let i = 1; i <= 15; i++) t.insert(i);
  assert.ok(height(t.root as never) <= 5);
});
