import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  treapTreeInsert,
  inorder,
  isTreapTree,
  resetSeed,
  type TreapTreeHooks,
  type TreapTreeNode,
} from '../../src/algorithms/tree/treap-tree/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/tree/treap-tree/trace.ts';
import { meta } from '../../src/algorithms/tree/treap-tree/meta.ts';

function height(n: TreapTreeNode | null): number {
  if (!n) return 0;
  return 1 + Math.max(height(n.left), height(n.right));
}

test('treap-tree 中序有序', () => {
  resetSeed();
  const root = treapTreeInsert(DEFAULT_INPUT);
  assert.deepEqual(
    inorder(root),
    [...DEFAULT_INPUT].sort((a, b) => a - b),
  );
});

test('treap-tree 满足 BST + 堆性质', () => {
  resetSeed();
  const root = treapTreeInsert([10, 20, 30, 40, 50, 25, 5, 15]);
  assert.ok(isTreapTree(root), '应为合法 Treap（分裂/合并式）');
});

test('treap-tree 有序插入仍保持平衡', () => {
  resetSeed();
  const keys = Array.from({ length: 100 }, (_, i) => i + 1);
  const root = treapTreeInsert(keys);
  assert.deepEqual(inorder(root), keys);
  assert.ok(isTreapTree(root));
  const h = height(root);
  assert.ok(h < 60, `高度 ${h} 应远小于 100`);
});

test('treap-tree 可复现：相同种子产生相同结构', () => {
  const r1 = treapTreeInsert(DEFAULT_INPUT, {}, { seed: 42 });
  const r2 = treapTreeInsert(DEFAULT_INPUT, {}, { seed: 42 });
  const ser = (n: TreapTreeNode | null): string =>
    n ? `(${n.key},${n.priority},${ser(n.left)},${ser(n.right)})` : '#';
  assert.equal(ser(r1), ser(r2));
});

test('treap-tree 重复 key 不插入', () => {
  resetSeed();
  const root = treapTreeInsert([5, 5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('treap-tree 与 ds/treap 实现不同（分裂/合并触发 onSplit/onMerge）', () => {
  resetSeed();
  let splits = 0;
  let merges = 0;
  const hooks: TreapTreeHooks = {
    onSplit: () => splits++,
    onMerge: () => merges++,
  };
  treapTreeInsert([10, 20, 30, 40, 50], hooks);
  assert.ok(splits > 0, '分裂式实现应触发 split');
  assert.ok(merges > 0, '分裂式实现应触发 merge');
});

test('treap-tree trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '末帧应有树');
  assert.equal(last.tree!.role, 'final');
});

test('treap-tree meta 信息真实', () => {
  assert.equal(meta.id, 'treap-tree');
  assert.equal(meta.categoryId, 'tree');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(log n)');
});
