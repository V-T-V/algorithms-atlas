import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scapegoatInsert,
  inorder,
  isScapegoat,
  type ScapegoatHooks,
  type SGNode,
} from '../../src/algorithms/ds/scapegoat-tree/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ds/scapegoat-tree/trace.ts';
import { meta } from '../../src/algorithms/ds/scapegoat-tree/meta.ts';

function height(n: SGNode | null): number {
  if (!n) return 0;
  return 1 + Math.max(height(n.left), height(n.right));
}

test('scapegoat-tree 中序有序', () => {
  const root = scapegoatInsert(DEFAULT_INPUT);
  assert.deepEqual(
    inorder(root),
    [...DEFAULT_INPUT].sort((a, b) => a - b),
  );
});

test('scapegoat-tree 满足 α 平衡', () => {
  const root = scapegoatInsert([10, 20, 30, 40, 50, 25, 5, 15]);
  assert.ok(isScapegoat(root, 0.7), '应为合法替罪羊树');
});

test('scapegoat-tree 有序插入保持平衡', () => {
  const keys = Array.from({ length: 100 }, (_, i) => i + 1);
  const root = scapegoatInsert(keys);
  assert.deepEqual(inorder(root), keys);
  assert.ok(isScapegoat(root, 0.7));
  const h = height(root);
  assert.ok(h < 30, `高度 ${h} 应远小于 100`);
});

test('scapegoat-tree 重复 key 不插入', () => {
  const root = scapegoatInsert([5, 5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('scapegoat-tree 钩子被调用', () => {
  let inserts = 0;
  let rebuilds = 0;
  const hooks: ScapegoatHooks = {
    onInsert: () => inserts++,
    onRebuild: () => rebuilds++,
  };
  // 顺序插入 1..20 必然触发多次重建
  scapegoatInsert(
    Array.from({ length: 20 }, (_, i) => i + 1),
    hooks,
  );
  assert.equal(inserts, 20);
  assert.ok(rebuilds > 0, '顺序插入应触发重建');
});

test('scapegoat-tree trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '末帧应有树');
  assert.equal(last.tree!.role, 'final');
});

test('scapegoat-tree meta 信息真实', () => {
  assert.equal(meta.id, 'scapegoat-tree');
  assert.equal(meta.categoryId, 'ds');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(log n)');
});
