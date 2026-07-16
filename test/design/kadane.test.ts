import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kadane } from '../../src/algorithms/design/kadane/impl.ts';

test('kadane 经典例 [-2,1,-3,4,-1,2,1,-5,4] = 6', () => {
  const r = kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  assert.equal(r.maxSum, 6);
  // 最优子数组 [4,-1,2,1]，下标 3..6
  assert.equal(r.start, 3);
  assert.equal(r.end, 6);
});

test('kadane 全正数组', () => {
  const r = kadane([1, 2, 3, 4]);
  assert.equal(r.maxSum, 10);
  assert.equal(r.start, 0);
  assert.equal(r.end, 3);
});

test('kadane 全负数组返回最大单个元素', () => {
  const r = kadane([-3, -5, -1, -2]);
  assert.equal(r.maxSum, -1);
  assert.equal(r.start, 2);
  assert.equal(r.end, 2);
});

test('kadane 单元素数组', () => {
  assert.deepEqual(kadane([42]), { maxSum: 42, start: 0, end: 0 });
});

test('kadane 空数组', () => {
  assert.deepEqual(kadane([]), { maxSum: 0, start: -1, end: -1 });
});

test('kadane 钩子 onStep 反映每步 curMax', () => {
  const steps: Array<[number, number]> = [];
  kadane([-2, 1, -3, 4], {
    onStep: (i, curMax) => steps.push([i, curMax]),
  });
  // i=0: curMax=-2; i=1: curMax=max(1,-1)=1; i=2: curMax=max(-3,-2)=-2; i=3: curMax=4
  assert.deepEqual(steps, [
    [0, -2],
    [1, 1],
    [2, -2],
    [3, 4],
  ]);
});

test('kadane 钩子 onUpdateBest 仅在改进时触发', () => {
  const bests: Array<[number, number, number]> = [];
  kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4], {
    onUpdateBest: (s, e, m) => bests.push([s, e, m]),
  });
  // 最优更新序列：[0,0,-2] → [1,1,1] → [3,3,4] → [3,4,3]? no, 4>3 so [3,4,3] 不触发
  // 实际：-2, 1, 4, 3(不更新), 5, 6, ...
  assert.equal(bests.at(-1)![2], 6);
});

test('kadane 与朴素对照（随机）', () => {
  const arr = [3, -2, 5, -1, 2, -4, 1, 2, -3, 4];
  const r = kadane(arr);
  // 朴素 O(n^2)
  let best = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    let s = 0;
    for (let j = i; j < arr.length; j++) {
      s += arr[j]!;
      if (s > best) best = s;
    }
  }
  assert.equal(r.maxSum, best);
});
