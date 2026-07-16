import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monotonicStack } from '../../src/algorithms/design/monotonic-stack-lr/impl.ts';

test('monotonic-stack 经典例 [2,1,5,6,2,3]', () => {
  // 左/右第一个更小
  const { left, right } = monotonicStack([2, 1, 5, 6, 2, 3]);
  // a=[2,1,5,6,2,3]
  // left:  i0:-1(无), i1:-1(无), i2:1(a=1), i3:2(a=5), i4:1(a=1), i5:4(a=2)
  assert.deepEqual(left, [-1, -1, 1, 2, 1, 4]);
  // right: i0:1(a=1), i1:6(无), i2:4(a=2), i3:4(a=2), i4:6(无), i5:6(无)
  assert.deepEqual(right, [1, 6, 4, 4, 6, 6]);
});

test('monotonic-stack 单调递增数组（无更小右侧）', () => {
  const { left, right } = monotonicStack([1, 2, 3, 4]);
  assert.deepEqual(left, [-1, 0, 1, 2]);
  assert.deepEqual(right, [4, 4, 4, 4]); // 无右侧更小
});

test('monotonic-stack 单调递减数组（无更小左侧）', () => {
  const { left, right } = monotonicStack([4, 3, 2, 1]);
  assert.deepEqual(left, [-1, -1, -1, -1]); // 无左侧更小
  assert.deepEqual(right, [1, 2, 3, 4]);
});

test('monotonic-stack 单元素数组', () => {
  const { left, right } = monotonicStack([42]);
  assert.deepEqual(left, [-1]);
  assert.deepEqual(right, [1]);
});

test('monotonic-stack 空数组', () => {
  const { left, right } = monotonicStack([]);
  assert.deepEqual(left, []);
  assert.deepEqual(right, []);
});

test('monotonic-stack 钩子 onPush / onPop', () => {
  const pushes: number[] = [];
  const pops: Array<[number, number]> = [];
  monotonicStack([2, 1], {
    onPush: (idx) => pushes.push(idx),
    onPop: (idx, rightIdx) => pops.push([idx, rightIdx]),
  });
  // i=0 push 0；i=1 弹出 0（a[0]=2 > a[1]=1）→ pop(0,1)，再 push 1
  assert.deepEqual(pushes, [0, 1]);
  assert.deepEqual(pops, [[0, 1]]);
});

test('monotonic-stack 与朴素对照', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  const { left, right } = monotonicStack(arr);
  const n = arr.length;
  // 朴素
  const naiveLeft = arr.map((v, i) => {
    for (let j = i - 1; j >= 0; j--) if (arr[j]! < v) return j;
    return -1;
  });
  const naiveRight = arr.map((v, i) => {
    for (let j = i + 1; j < n; j++) if (arr[j]! < v) return j;
    return n;
  });
  assert.deepEqual(left, naiveLeft);
  assert.deepEqual(right, naiveRight);
});

test('monotonic-stack 含重复元素（严格更小）', () => {
  // a=[2,2,2]：严格更小，故无元素更小
  const { left, right } = monotonicStack([2, 2, 2]);
  assert.deepEqual(left, [-1, -1, -1]);
  assert.deepEqual(right, [3, 3, 3]);
});
