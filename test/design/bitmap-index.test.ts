import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BitmapIndex } from '../../src/algorithms/design/bitmap-index/impl.ts';

test('BitmapIndex add/has 基本功能', () => {
  const bm = new BitmapIndex(64);
  assert.equal(bm.add(5), true);
  assert.equal(bm.add(0), true);
  assert.equal(bm.add(63), true);
  assert.equal(bm.has(5), true);
  assert.equal(bm.has(0), true);
  assert.equal(bm.has(63), true);
  assert.equal(bm.has(1), false);
});

test('BitmapIndex 重复 add 返回 false', () => {
  const bm = new BitmapIndex(16);
  assert.equal(bm.add(3), true);
  assert.equal(bm.add(3), false);
  assert.equal(bm.sizeOf(), 1);
});

test('BitmapIndex remove', () => {
  const bm = new BitmapIndex(32);
  bm.add(7);
  assert.equal(bm.remove(7), true);
  assert.equal(bm.has(7), false);
  assert.equal(bm.remove(7), false); // 再删返回 false
  assert.equal(bm.remove(10), false); // 不存在
});

test('BitmapIndex toArray 升序去重', () => {
  const bm = new BitmapIndex(100);
  [5, 3, 9, 3, 50, 0].forEach((v) => bm.add(v));
  assert.deepEqual(bm.toArray(), [0, 3, 5, 9, 50]);
});

test('BitmapIndex union', () => {
  const a = new BitmapIndex(32);
  const b = new BitmapIndex(32);
  a.add(1);
  a.add(3);
  b.add(3);
  b.add(5);
  const u = a.union(b);
  assert.deepEqual(u.toArray(), [1, 3, 5]);
});

test('BitmapIndex clear', () => {
  const bm = new BitmapIndex(16);
  bm.add(2);
  bm.add(4);
  bm.clear();
  assert.equal(bm.sizeOf(), 0);
  assert.equal(bm.has(2), false);
});

test('BitmapIndex 越界抛错', () => {
  const bm = new BitmapIndex(16);
  assert.throws(() => bm.add(16));
  assert.throws(() => bm.add(-1));
  assert.throws(() => bm.has(16));
  assert.throws(() => new BitmapIndex(0));
});

test('BitmapIndex 跨 word 边界', () => {
  const bm = new BitmapIndex(65);
  bm.add(31); // 第 0 word 末位
  bm.add(32); // 第 1 word 首位
  bm.add(64); // 第 2 word 首位
  assert.equal(bm.has(31), true);
  assert.equal(bm.has(32), true);
  assert.equal(bm.has(64), true);
});
