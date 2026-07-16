import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  monotonicStack,
  nextGreaterElements,
} from '../../src/algorithms/ds/monotonic-stack/impl.ts';

test('monotonicStack 下一个更大元素（经典用例）', () => {
  // [2,1,4,3,5] → 2 后第一个更大是 4；1 后是 4；4 后是 5；3 后是 5；5 后无
  assert.deepEqual(monotonicStack([2, 1, 4, 3, 5]), [4, 4, 5, 5, -1]);
  // 递减序列：每个都无更大元素
  assert.deepEqual(monotonicStack([5, 4, 3, 2, 1]), [-1, -1, -1, -1, -1]);
  // 递增序列：每个的下一个更大就是后一个
  assert.deepEqual(monotonicStack([1, 2, 3, 4, 5]), [2, 3, 4, 5, -1]);
});

test('nextGreaterElements 返回值与索引', () => {
  const r = nextGreaterElements([2, 1, 4]);
  assert.deepEqual(r.values, [4, 4, -1]);
  assert.deepEqual(r.indices, [2, 2, -1]);
});

test('monotonicStack 空 / 单元素', () => {
  assert.deepEqual(monotonicStack([]), []);
  assert.deepEqual(monotonicStack([42]), [-1]); // 单个元素无下一个更大
});

test('monotonicStack 钩子被调用（push 次数 = n）', () => {
  const pushes: number[] = [];
  const pops: number[] = [];
  monotonicStack([2, 1, 4, 3, 5], {
    onPush: (i) => pushes.push(i),
    onPop: (topIdx) => pops.push(topIdx),
  });
  assert.deepEqual(pushes, [0, 1, 2, 3, 4]); // 每个元素入栈一次
  assert.deepEqual(pops, [1, 0, 3, 2]); // 1(被4弹),0(被4弹),3(被5弹),2(被5弹)
});

test('monotonicStack 弹出时记录正确的更大值', () => {
  const popped: Array<{ idx: number; greater: number }> = [];
  monotonicStack([3, 1, 2], {
    onPop: (topIdx, cur) => popped.push({ idx: topIdx, greater: cur }),
  });
  // 1 被 2 弹出(greater=2)；0 被... 实际上 3 不会被弹出（无更大）
  // 扫描：i=0 push0; i=1 push1; i=2: nums[1]=1<2 → pop1(greater=2); nums[0]=3 不<2 → push2
  assert.deepEqual(popped, [{ idx: 1, greater: 2 }]);
});
