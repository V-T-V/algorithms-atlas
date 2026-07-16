import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MergeableSegTree,
  mergeSegment,
  type MergeSegHooks,
} from '../../src/algorithms/tree/merge-segment/impl.ts';

test('merge-segment 单点更新与区间查询', () => {
  const t = new MergeableSegTree(1, 8);
  t.update(3, 5);
  t.update(3, 2); // 同点累加
  t.update(6, 4);
  assert.equal(t.pointQuery(3), 7);
  assert.equal(t.pointQuery(6), 4);
  assert.equal(t.rangeSum(1, 8), 11);
  assert.equal(t.rangeSum(4, 5), 0);
  assert.equal(t.rangeSum(3, 6), 11);
});

test('merge-segment 合并两棵树', () => {
  const tA = new MergeableSegTree(1, 8);
  tA.update(2, 3);
  tA.update(5, 4);
  const tB = new MergeableSegTree(1, 8);
  tB.update(2, 1);
  tB.update(7, 5);
  tA.mergeInto(tB);
  // 合并后：位置 2=4, 5=4, 7=5
  assert.equal(tA.pointQuery(2), 4);
  assert.equal(tA.pointQuery(5), 4);
  assert.equal(tA.pointQuery(7), 5);
  assert.equal(tA.rangeSum(1, 8), 13);
});

test('merge-segment 合并不影响被合并树（按引用共享）', () => {
  const tA = new MergeableSegTree(1, 4);
  tA.update(1, 10);
  const tB = new MergeableSegTree(1, 4);
  tB.update(2, 20);
  tA.mergeInto(tB);
  // 合并后 tA 应能查到位置 2 的值
  assert.equal(tA.pointQuery(2), 20);
  // tB 仍可独立查询
  assert.equal(tB.pointQuery(2), 20);
});

test('merge-segment 便捷封装', () => {
  // 两组数据，值域 [1,5]，查询整个区间和
  const total = mergeSegment(
    [
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 1],
        [5, 5],
      ],
    ],
    { lo: 1, hi: 5 },
    { l: 1, r: 5 },
  );
  assert.equal(total, 12);
});

test('merge-segment hooks 被触发', () => {
  const updates: Array<[number, number]> = [];
  const merges: number[] = [];
  const sums: number[] = [];
  const hooks: MergeSegHooks = {
    onUpdate: (_root, pos) => updates.push([pos, 0]),
    onMerge: (l) => merges.push(l),
    onRangeSum: (l, r, s) => sums.push(s),
  };
  const tA = new MergeableSegTree(1, 4, hooks);
  tA.update(2, 5);
  const tB = new MergeableSegTree(1, 4);
  tB.update(2, 1);
  tA.mergeInto(tB);
  assert.equal(updates.length, 1);
  assert.ok(merges.length > 0);
  tA.rangeSum(1, 4);
  assert.equal(sums.length, 1);
  assert.equal(sums[0], 6);
});

test('merge-segment 与朴素字典对比一致', () => {
  const lo = 1;
  const hi = 20;
  const t = new MergeableSegTree(lo, hi);
  const brute = new Map<number, number>();
  for (let i = 0; i < 100; i++) {
    const pos = lo + Math.floor(Math.random() * (hi - lo + 1));
    const delta = Math.floor(Math.random() * 10) - 5;
    t.update(pos, delta);
    brute.set(pos, (brute.get(pos) ?? 0) + delta);
  }
  for (let l = lo; l <= hi; l++) {
    for (let r = l; r <= hi; r++) {
      let expected = 0;
      for (const [p, v] of brute) if (p >= l && p <= r) expected += v;
      assert.equal(t.rangeSum(l, r), expected, `rangeSum(${l},${r})`);
    }
  }
});
