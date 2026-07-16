import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BinomialHeap,
  binaryHeap2,
  type BinomialHeapHooks,
} from '../../src/algorithms/ds/binary-heap-2/impl.ts';

test('binaryHeap2 extractMin 输出升序', () => {
  const h = binaryHeap2([9, 4, 7, 1, 5, 3, 8, 2, 6]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('BinomialHeap findMin / extractMin 基本行为', () => {
  const h = new BinomialHeap();
  h.insert(5);
  h.insert(1);
  h.insert(3);
  assert.equal(h.findMin(), 1);
  assert.equal(h.extractMin(), 1);
  assert.equal(h.extractMin(), 3);
  assert.equal(h.extractMin(), 5);
  assert.equal(h.extractMin(), undefined);
});

test('BinomialHeap 空堆', () => {
  const h = new BinomialHeap();
  assert.equal(h.isEmpty(), true);
  assert.equal(h.findMin(), undefined);
  assert.equal(h.extractMin(), undefined);
  assert.equal(h.size, 0);
});

test('BinomialHeap 单元素', () => {
  const h = binaryHeap2([42]);
  assert.equal(h.size, 1);
  assert.equal(h.findMin(), 42);
  assert.equal(h.extractMin(), 42);
  assert.equal(h.size, 0);
});

test('BinomialHeap 重复元素', () => {
  const h = binaryHeap2([3, 1, 3, 1, 2]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 1, 2, 3, 3]);
});

test('BinomialHeap meld 合并两堆', () => {
  const a = binaryHeap2([5, 1, 3]);
  const b = binaryHeap2([4, 2, 6]);
  a.meld(b);
  assert.equal(b.size, 0);
  assert.equal(a.size, 6);
  const out: number[] = [];
  while (!a.isEmpty()) out.push(a.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6]);
});

test('BinomialHeap 森林根表满足二项性质（度数严格递增）', () => {
  const h = binaryHeap2([1, 2, 3, 4, 5, 6, 7, 8]); // 8 个元素 → 单棵 B3
  const roots = h.roots();
  for (let i = 1; i < roots.length; i++) {
    assert.ok(roots[i - 1]!.degree < roots[i]!.degree, '度数应严格递增');
  }
});

test('BinomialHeap 钩子被调用', () => {
  let links = 0;
  let inserts = 0;
  let extracts = 0;
  const hooks: BinomialHeapHooks = {
    onLink: () => links++,
    onInsert: () => inserts++,
    onExtract: () => extracts++,
  };
  const h = binaryHeap2([1, 2, 3, 4], hooks); // 4 元素必发生 link
  assert.equal(inserts, 4);
  assert.ok(links > 0, '应发生 link');
  h.extractMin(hooks);
  assert.ok(extracts > 0);
});

test('BinomialHeap 大量随机操作正确性', () => {
  const h = new BinomialHeap();
  const ref: number[] = [];
  for (let i = 0; i < 50; i++) {
    const v = (i * 31 + 7) % 97;
    h.insert(v);
    ref.push(v);
  }
  ref.sort((a, b) => a - b);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, ref);
});
