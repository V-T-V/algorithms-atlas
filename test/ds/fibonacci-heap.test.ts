import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FibonacciHeap,
  fibonacciHeap,
  type FibHooks,
} from '../../src/algorithms/ds/fibonacci-heap/impl.ts';

test('fibonacciHeap extractMin 输出升序', () => {
  const h = fibonacciHeap([9, 4, 7, 1, 5, 3, 8, 2, 6]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('FibonacciHeap findMin / extractMin 基本行为', () => {
  const h = new FibonacciHeap();
  h.insert(5);
  h.insert(1);
  h.insert(3);
  assert.equal(h.findMin(), 1);
  assert.equal(h.extractMin(), 1);
  assert.equal(h.extractMin(), 3);
  assert.equal(h.extractMin(), 5);
  assert.equal(h.extractMin(), undefined);
});

test('FibonacciHeap 空堆', () => {
  const h = new FibonacciHeap();
  assert.equal(h.isEmpty(), true);
  assert.equal(h.findMin(), undefined);
  assert.equal(h.extractMin(), undefined);
});

test('FibonacciHeap 单元素', () => {
  const h = fibonacciHeap([42]);
  assert.equal(h.findMin(), 42);
  assert.equal(h.extractMin(), 42);
  assert.equal(h.size, 0);
});

test('FibonacciHeap 重复元素', () => {
  const h = fibonacciHeap([3, 1, 3, 1, 2]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 1, 2, 3, 3]);
});

test('FibonacciHeap consolidate 后根表度数互异', () => {
  const h = fibonacciHeap([5, 1, 3, 4, 2]);
  h.extractMin(); // 触发 consolidate
  const degrees = h.rootList().map((n) => n.degree);
  const uniq = new Set(degrees);
  assert.equal(uniq.size, degrees.length, '根表度数应互异');
});

test('FibonacciHeap 钩子被调用', () => {
  let inserts = 0;
  let extracts = 0;
  let consolidates = 0;
  let links = 0;
  const hooks: FibHooks = {
    onInsert: () => inserts++,
    onExtract: () => extracts++,
    onConsolidate: () => consolidates++,
    onLink: () => links++,
  };
  const h = fibonacciHeap([1, 2, 3, 4, 5], hooks);
  assert.equal(inserts, 5);
  h.extractMin(hooks); // 触发 consolidate + links
  assert.ok(consolidates > 0, '应触发 consolidate');
  assert.ok(links > 0, '应发生 link');
  assert.ok(extracts > 0);
});

test('FibonacciHeap 大量随机操作正确性', () => {
  const h = new FibonacciHeap();
  const ref: number[] = [];
  for (let i = 0; i < 70; i++) {
    const v = (i * 19 + 11) % 89;
    h.insert(v);
    ref.push(v);
  }
  ref.sort((a, b) => a - b);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, ref);
});
