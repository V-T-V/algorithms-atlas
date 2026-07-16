// 随机化跳表 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SkipList, makeRng } from '../../src/algorithms/randomized/randomized-skip-list/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/randomized-skip-list/trace.ts';

test('插入与搜索基础', () => {
  const sl = new SkipList(makeRng(42));
  sl.insert(5, 50);
  sl.insert(3, 30);
  sl.insert(7, 70);
  assert.equal(sl.search(5)?.value, 50);
  assert.equal(sl.search(3)?.value, 30);
  assert.equal(sl.search(7)?.value, 70);
  assert.equal(sl.search(4), undefined);
  assert.equal(sl.size, 3);
});

test('插入重复键更新值', () => {
  const sl = new SkipList(makeRng(42));
  sl.insert(5, 50);
  sl.insert(5, 999);
  assert.equal(sl.search(5)?.value, 999);
  assert.equal(sl.size, 1);
});

test('有序遍历', () => {
  const sl = new SkipList(makeRng(42));
  for (const k of [9, 3, 7, 1, 5, 2, 8, 4, 6]) sl.insert(k, k);
  const arr = sl.toArray();
  assert.deepEqual(
    arr.map((e) => e.key),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test('删除基础', () => {
  const sl = new SkipList(makeRng(42));
  for (const k of [1, 2, 3, 4, 5]) sl.insert(k, k);
  assert.equal(sl.delete(3), true);
  assert.equal(sl.search(3), undefined);
  assert.equal(sl.delete(3), false); // 已删
  assert.equal(sl.delete(100), false);
  assert.equal(sl.size, 4);
});

test('删除后仍有序', () => {
  const sl = new SkipList(makeRng(7));
  for (const k of [5, 3, 9, 1, 7]) sl.insert(k, k);
  sl.delete(5);
  sl.delete(1);
  assert.deepEqual(
    sl.toArray().map((e) => e.key),
    [3, 7, 9],
  );
});

test('大批量插入后所有键可搜', () => {
  const sl = new SkipList(makeRng(1));
  const N = 200;
  const keys: number[] = [];
  for (let i = 0; i < N; i++) {
    const k = i * 7 + 3; // 互异
    keys.push(k);
    sl.insert(k, k * 2);
  }
  for (const k of keys) {
    assert.equal(sl.search(k)?.value, k * 2);
  }
  assert.equal(sl.size, N);
});

test('高度有上界', () => {
  const sl = new SkipList(makeRng(2), { p: 0.5, maxLevel: 8 });
  for (let i = 0; i < 500; i++) sl.insert(i, i);
  assert.ok(sl.heads.length <= 8, `层数 ${sl.heads.length} 应 <= 8`);
});

test('钩子触发', () => {
  const heights: number[] = [];
  const inserts: number[] = [];
  const searches: boolean[] = [];
  const sl = new SkipList(
    makeRng(42),
    {},
    {
      onRandomHeight: (h) => heights.push(h),
      onInsert: (k) => inserts.push(k),
      onSearch: (_k, f) => searches.push(f),
    },
  );
  sl.insert(1, 1);
  sl.insert(2, 2);
  sl.search(1);
  sl.search(99);
  assert.equal(heights.length, 2);
  assert.equal(inserts.length, 2);
  assert.deepEqual(searches, [true, false]);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.keys 非空', () => {
  assert.ok(DEFAULT_INPUT.keys.length > 0);
});
