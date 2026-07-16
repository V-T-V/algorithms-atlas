import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  persistentSegment,
  type PSGHooks,
} from '../../src/algorithms/ds/persistent-segment/impl.ts';

test('persistentSegment 建树后区间查询', () => {
  const t = persistentSegment([2, 1, 5, 3, 4]);
  assert.equal(t.query(0, 0, 4), 15);
  assert.equal(t.query(0, 1, 3), 9);
  assert.equal(t.query(0, 2, 2), 5);
});

test('PersistentSegmentTree 单点更新产生新版本', () => {
  const t = persistentSegment([2, 1, 5, 3, 4]);
  assert.equal(t.versionCount, 1);
  const v1 = t.update(0, 2, 8); // 5 -> 8
  assert.equal(t.versionCount, 2);
  // 旧版本不变
  assert.equal(t.query(0, 2, 2), 5);
  assert.equal(t.query(0, 0, 4), 15);
  // 新版本
  assert.equal(t.query(v1, 2, 2), 8);
  assert.equal(t.query(v1, 0, 4), 18);
});

test('PersistentSegmentTree 多版本互不影响', () => {
  const t = persistentSegment([1, 1, 1, 1]);
  const v1 = t.update(0, 0, 10); // [10,1,1,1]
  const v2 = t.update(v1, 1, 20); // [10,20,1,1]
  // 每个版本独立
  assert.deepEqual(t.toArray(0), [1, 1, 1, 1]);
  assert.deepEqual(t.toArray(v1), [10, 1, 1, 1]);
  assert.deepEqual(t.toArray(v2), [10, 20, 1, 1]);
});

test('PersistentSegmentTree 历史版本查询', () => {
  const t = persistentSegment([2, 1, 5, 3, 4]);
  const v1 = t.update(0, 2, 8);
  const v2 = t.update(v1, 0, 10);
  // 在 v1 上查全区间
  assert.equal(t.query(v1, 0, 4), 18);
  // 在 v2 上查全区间
  assert.equal(t.query(v2, 0, 4), 26);
  // 在版本 0 上查
  assert.equal(t.query(0, 0, 4), 15);
});

test('PersistentSegmentTree 基于任意旧版本更新', () => {
  const t = persistentSegment([1, 2, 3]);
  const v1 = t.update(0, 0, 10); // [10,2,3]
  // 基于版本 0 再分支
  const v2 = t.update(0, 0, 20); // [20,2,3]
  assert.deepEqual(t.toArray(v1), [10, 2, 3]);
  assert.deepEqual(t.toArray(v2), [20, 2, 3]);
  assert.deepEqual(t.toArray(0), [1, 2, 3]);
});

test('PersistentSegmentTree 单元素 / 空', () => {
  const t = persistentSegment([42]);
  assert.equal(t.query(0, 0, 0), 42);
  const v1 = t.update(0, 0, 7);
  assert.equal(t.query(0, 0, 0), 42);
  assert.equal(t.query(v1, 0, 0), 7);

  const empty = persistentSegment([]);
  assert.equal(empty.query(0, 0, 0), 0);
});

test('PersistentSegmentTree 越界查询自动忽略', () => {
  const t = persistentSegment([1, 2, 3]);
  assert.equal(t.query(0, -5, 0), 1);
  assert.equal(t.query(0, 2, 100), 3);
  assert.equal(t.query(0, -5, 100), 6);
});

test('PersistentSegmentTree 钩子被调用', () => {
  let clones = 0;
  let visits = 0;
  const hooks: PSGHooks = {
    onClone: () => clones++,
    onQueryVisit: () => visits++,
  };
  const t = persistentSegment([1, 2, 3, 4]);
  // 更新带钩子（克隆路径）
  t.update(0, 0, 10, hooks);
  // 查询带钩子
  t.query(0, 0, 3, hooks);
  assert.ok(clones > 0, '更新应触发 onClone');
  assert.ok(visits > 0, '查询应触发 onQueryVisit');
});

test('PersistentSegmentTree 建树钩子触发', () => {
  let builds = 0;
  const t = persistentSegment([1, 2, 3, 4], { onBuild: () => builds++ });
  void t;
  // 4 个叶子 + 3 个内部 = 7 个节点
  assert.equal(builds, 7);
});
