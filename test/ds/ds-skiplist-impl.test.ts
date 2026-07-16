import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SkipList } from '../../src/algorithms/ds/ds-skiplist-impl/impl.ts';

test('跳表插入升序保持有序', () => {
  const sl = new SkipList();
  for (let i = 1; i <= 20; i++) sl.insert(i);
  assert.deepEqual(
    sl.values(),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
});

test('跳表乱序插入有序', () => {
  const sl = new SkipList();
  const input = [50, 30, 70, 20, 40, 60, 80];
  input.forEach((v) => sl.insert(v));
  assert.deepEqual(
    sl.values(),
    [...input].sort((a, b) => a - b),
  );
});

test('跳表查找', () => {
  const sl = new SkipList();
  [10, 5, 15, 3, 7, 12].forEach((v) => sl.insert(v));
  assert.equal(sl.search(7), true);
  assert.equal(sl.search(8), false);
});

test('跳表重复不增加规模', () => {
  const sl = new SkipList();
  sl.insert(5);
  sl.insert(5);
  assert.equal(sl.size, 1);
});

test('跳表大量随机插入后有序', () => {
  const sl = new SkipList();
  const input = Array.from({ length: 100 }, (_, i) => (i * 37) % 100);
  input.forEach((v) => sl.insert(v));
  const sorted = [...new Set(input)].sort((a, b) => a - b);
  assert.deepEqual(sl.values(), sorted);
});
