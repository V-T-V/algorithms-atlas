import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BinaryHeap, heap } from '../../src/algorithms/ds/heap/impl.ts';

test('heap 建堆后满足最小堆性质', () => {
  // 任意节点 ≤ 其子节点
  const arr = heap([9, 4, 7, 1, 5, 3, 8]);
  assert.equal(arr[0], 1); // 堆顶最小
  for (let i = 0; i < arr.length; i++) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < arr.length) assert.ok(arr[i]! <= arr[l]!, `parent ${arr[i]} > left ${arr[l]}`);
    if (r < arr.length) assert.ok(arr[i]! <= arr[r]!, `parent ${arr[i]} > right ${arr[r]}`);
  }
});

test('heap 确定顺序（同一输入）', () => {
  assert.deepEqual(heap([9, 4, 7, 1, 5, 3, 8]), [1, 4, 3, 9, 5, 7, 8]);
});

test('heap insert + peek/extract', () => {
  const h = new BinaryHeap();
  h.insert(5);
  h.insert(1);
  h.insert(3);
  assert.equal(h.peek(), 1);
  assert.equal(h.extract(), 1);
  assert.equal(h.extract(), 3);
  assert.equal(h.extract(), 5);
  assert.equal(h.extract(), undefined); // 空
});

test('heap extract 输出升序（堆排序）', () => {
  const h = new BinaryHeap();
  h.buildHeap([9, 4, 7, 1, 5, 3, 8, 2]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extract()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 7, 8, 9]);
});

test('heap 最大堆（自定义比较器）', () => {
  const h = new BinaryHeap((a, b) => a > b); // 大者在上
  h.buildHeap([3, 1, 6, 4]);
  assert.equal(h.peek(), 6);
  assert.equal(h.extract(), 6);
  assert.equal(h.extract(), 4);
});

test('heap 单元素 / 空堆', () => {
  assert.deepEqual(heap([]), []);
  assert.deepEqual(heap([42]), [42]);
  const h = new BinaryHeap();
  assert.equal(h.isEmpty(), true);
  assert.equal(h.extract(), undefined);
  assert.equal(h.peek(), undefined);
});

test('heap 重复元素', () => {
  const h = new BinaryHeap();
  for (const v of [3, 3, 1, 1, 2]) h.insert(v);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extract()!);
  assert.deepEqual(out, [1, 1, 2, 3, 3]);
});

test('heap 钩子被调用', () => {
  let swaps = 0;
  let compares = 0;
  heap([5, 3, 1], (a, b) => a < b, {
    onSwap: () => swaps++,
    onCompare: () => compares++,
  });
  assert.ok(swaps > 0, '建堆应发生交换');
  assert.ok(compares > 0, '应发生比较');
});

test('heap insert 钩子反映上浮', () => {
  const swaps: Array<[number, number]> = [];
  const h = new BinaryHeap();
  h.buildHeap([5, 4]); // [4,5]
  h.insert(1, { onSwap: (i, j) => swaps.push([i, j]) });
  // 1 应上浮到堆顶：交换 2↔0（经过 idx1）
  assert.ok(swaps.length >= 1);
  assert.equal(h.peek(), 1);
});
