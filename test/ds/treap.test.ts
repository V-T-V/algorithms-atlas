import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  treapInsert,
  inorder,
  isTreap,
  resetSeed,
  type TreapHooks,
  type TreapNode,
} from '../../src/algorithms/ds/treap/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ds/treap/trace.ts';
import { meta } from '../../src/algorithms/ds/treap/meta.ts';

function height(n: TreapNode | null): number {
  if (!n) return 0;
  return 1 + Math.max(height(n.left), height(n.right));
}

test('treap 中序有序', () => {
  resetSeed();
  const root = treapInsert(DEFAULT_INPUT);
  assert.deepEqual(
    inorder(root),
    [...DEFAULT_INPUT].sort((a, b) => a - b),
  );
});

test('treap 满足 BST + 堆性质', () => {
  resetSeed();
  const root = treapInsert([10, 20, 30, 40, 50, 25, 5, 15]);
  assert.ok(isTreap(root), '应为合法 Treap');
});

test('treap 有序插入仍保持平衡（避免退化成链）', () => {
  resetSeed();
  // 顺序插入 1..100，朴素 BST 会退化为高度 100 的链
  const keys = Array.from({ length: 100 }, (_, i) => i + 1);
  const root = treapInsert(keys);
  assert.deepEqual(inorder(root), keys);
  assert.ok(isTreap(root));
  const h = height(root);
  // Treap 期望高度 O(log n)，100 个节点高度应远小于 100
  assert.ok(h < 60, `高度 ${h} 应远小于 100`);
});

test('treap 可复现：相同种子产生相同结构', () => {
  const r1 = treapInsert(DEFAULT_INPUT, {}, { seed: 42 });
  const r2 = treapInsert(DEFAULT_INPUT, {}, { seed: 42 });
  assert.deepEqual(inorder(r1), inorder(r2));
  // 结构相同：比较前序+优先级
  const ser = (n: TreapNode | null): string =>
    n ? `(${n.key},${n.priority},${ser(n.left)},${ser(n.right)})` : '#';
  assert.equal(ser(r1), ser(r2));
});

test('treap 重复 key 不插入', () => {
  resetSeed();
  const root = treapInsert([5, 5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('treap 钩子被调用', () => {
  resetSeed();
  let inserts = 0;
  let rotates = 0;
  const hooks: TreapHooks = {
    onInsert: () => inserts++,
    onRotate: () => rotates++,
  };
  treapInsert([10, 20, 30, 40, 50], hooks);
  assert.equal(inserts, 5, '应插入 5 个节点');
  assert.ok(rotates >= 0, '旋转次数非负');
});

test('treap trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '末帧应有树');
  assert.equal(last.tree!.role, 'final');
});

test('treap meta 信息真实', () => {
  assert.equal(meta.id, 'treap');
  assert.equal(meta.categoryId, 'ds');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(log n)');
});
