import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LeftistHeap,
  leftistHeap,
  type LeftistHooks,
} from '../../src/algorithms/ds/leftist-heap/impl.ts';

test('leftistHeap extractMin 输出升序', () => {
  const h = leftistHeap([9, 4, 7, 1, 5, 3, 8, 2, 6]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('LeftistHeap findMin / extractMin 基本行为', () => {
  const h = new LeftistHeap();
  h.insert(5);
  h.insert(1);
  h.insert(3);
  assert.equal(h.findMin(), 1);
  assert.equal(h.extractMin(), 1);
  assert.equal(h.extractMin(), 3);
  assert.equal(h.extractMin(), 5);
  assert.equal(h.extractMin(), undefined);
});

test('LeftistHeap 空堆', () => {
  const h = new LeftistHeap();
  assert.equal(h.isEmpty(), true);
  assert.equal(h.findMin(), undefined);
  assert.equal(h.extractMin(), undefined);
});

test('LeftistHeap 始终满足左偏性质', () => {
  const h = leftistHeap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(h.isValid(), true);
  h.extractMin();
  assert.equal(h.isValid(), true);
});

test('LeftistHeap meld 合并两堆', () => {
  const a = leftistHeap([5, 1, 3]);
  const b = leftistHeap([4, 2, 6]);
  a.meld(b);
  assert.equal(b.size, 0);
  const out: number[] = [];
  while (!a.isEmpty()) out.push(a.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6]);
});

test('LeftistHeap 重复元素', () => {
  const h = leftistHeap([3, 1, 3, 1, 2]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 1, 2, 3, 3]);
});

test('LeftistHeap 钩子被调用', () => {
  let compares = 0;
  let inserts = 0;
  let extracts = 0;
  const hooks: LeftistHooks = {
    onCompare: () => compares++,
    onInsert: () => inserts++,
    onExtract: () => extracts++,
  };
  const h = leftistHeap([1, 2, 3], hooks);
  assert.equal(inserts, 3);
  assert.ok(compares > 0);
  h.extractMin(hooks);
  assert.ok(extracts > 0);
});

test('LeftistHeap 大量随机操作正确性', () => {
  const h = new LeftistHeap();
  const ref: number[] = [];
  for (let i = 0; i < 60; i++) {
    const v = (i * 29 + 3) % 101;
    h.insert(v);
    ref.push(v);
  }
  ref.sort((a, b) => a - b);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, ref);
});
