import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SkipListSet } from '../../src/algorithms/ds/ds-skiplist-set/impl.ts';

test('SkipListSet insert + search', () => {
  const sl = new SkipListSet();
  for (const v of [5, 2, 8, 1, 9, 3]) sl.insert(v);
  assert.equal(sl.search(5), true);
  assert.equal(sl.search(1), true);
  assert.equal(sl.search(9), true);
  assert.equal(sl.search(4), false);
});

test('SkipListSet 有序', () => {
  const sl = new SkipListSet();
  const vals = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  for (const v of vals) sl.insert(v);
  assert.deepEqual(
    sl.toArray(),
    [...vals].sort((a, b) => a - b),
  );
});

test('SkipListSet 重复插入', () => {
  const sl = new SkipListSet();
  assert.equal(sl.insert(5), true);
  assert.equal(sl.insert(5), false);
  assert.equal(sl.size, 1);
});

test('SkipListSet delete', () => {
  const sl = new SkipListSet();
  for (const v of [5, 2, 8, 1, 9]) sl.insert(v);
  assert.equal(sl.delete(5), true);
  assert.equal(sl.search(5), false);
  assert.equal(sl.delete(5), false); // 已删
  assert.equal(sl.size, 4);
});

test('SkipListSet min/max', () => {
  const sl = new SkipListSet();
  for (const v of [5, 2, 8, 1, 9]) sl.insert(v);
  assert.equal(sl.min(), 1);
  assert.equal(sl.max(), 9);
});

test('SkipListSet 空 min/max', () => {
  const sl = new SkipListSet();
  assert.equal(sl.min(), undefined);
  assert.equal(sl.max(), undefined);
});

test('SkipListSet ceiling/floor', () => {
  const sl = new SkipListSet();
  for (const v of [1, 3, 5, 7, 9]) sl.insert(v);
  assert.equal(sl.ceiling(4), 5);
  assert.equal(sl.ceiling(5), 5);
  assert.equal(sl.ceiling(10), undefined);
  assert.equal(sl.floor(4), 3);
  assert.equal(sl.floor(5), 5);
  assert.equal(sl.floor(0), undefined);
});

test('SkipListSet 与 Set 对照', () => {
  const sl = new SkipListSet();
  const ref = new Set<number>();
  const ops = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  for (const v of ops) {
    sl.insert(v);
    ref.add(v);
  }
  assert.equal(sl.size, ref.size);
  for (const v of ref) assert.equal(sl.search(v), true);
  // 删一半
  const arr = [...ref];
  for (let i = 0; i < arr.length / 2; i++) {
    sl.delete(arr[i]!);
    ref.delete(arr[i]!);
  }
  assert.equal(sl.size, ref.size);
  for (const v of ref) assert.equal(sl.search(v), true);
  assert.deepEqual(
    sl.toArray(),
    [...ref].sort((a, b) => a - b),
  );
});
