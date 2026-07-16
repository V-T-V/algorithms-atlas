import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sbtInsert,
  inorder,
  isSBT,
  sizesValid,
  type SBTHooks,
  type SBTNode,
} from '../../src/algorithms/ds/sbt/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ds/sbt/trace.ts';
import { meta } from '../../src/algorithms/ds/sbt/meta.ts';

function height(n: SBTNode | null): number {
  if (!n) return 0;
  return 1 + Math.max(height(n.left), height(n.right));
}

test('sbt 中序有序', () => {
  const root = sbtInsert(DEFAULT_INPUT);
  assert.deepEqual(
    inorder(root),
    [...DEFAULT_INPUT].sort((a, b) => a - b),
  );
});

test('sbt size 字段自洽', () => {
  const root = sbtInsert([10, 20, 30, 40, 50, 25, 5, 15]);
  assert.ok(sizesValid(root));
});

test('sbt 满足尺寸平衡性质', () => {
  const root = sbtInsert([10, 20, 30, 40, 50, 25, 5, 15]);
  assert.ok(isSBT(root), '应为合法 SBT');
});

test('sbt 有序插入保持平衡（不退化成链）', () => {
  const keys = Array.from({ length: 100 }, (_, i) => i + 1);
  const root = sbtInsert(keys);
  assert.deepEqual(inorder(root), keys);
  assert.ok(isSBT(root));
  assert.ok(sizesValid(root));
  const h = height(root);
  assert.ok(h < 60, `高度 ${h} 应远小于 100`);
});

test('sbt 重复 key 不插入', () => {
  const root = sbtInsert([5, 5, 5, 5]);
  assert.deepEqual(inorder(root), [5]);
});

test('sbt 钩子被调用', () => {
  let inserts = 0;
  const hooks: SBTHooks = { onInsert: () => inserts++ };
  sbtInsert([10, 20, 30, 40, 50], hooks);
  assert.equal(inserts, 5);
});

test('sbt trace 末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '末帧应有树');
  assert.equal(last.tree!.role, 'final');
});

test('sbt meta 信息真实', () => {
  assert.equal(meta.id, 'sbt');
  assert.equal(meta.categoryId, 'ds');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(log n)');
});
