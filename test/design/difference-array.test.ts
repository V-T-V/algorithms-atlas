import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DifferenceArray,
  differenceArray,
} from '../../src/algorithms/design/difference-array/impl.ts';

test('difference-array 单次区间加正确', () => {
  const da = new DifferenceArray(5);
  da.update(1, 3, 7);
  assert.deepEqual(da.restore(), [0, 7, 7, 7, 0]);
});

test('difference-array 多次区间加累加', () => {
  const arr = differenceArray(6, [
    { l: 0, r: 5, val: 1 }, // 全 +1
    { l: 2, r: 4, val: 3 }, // 中段再 +3
    { l: 3, r: 3, val: -2 }, // 单点 -2
  ]);
  // 期望：[1,1,4,2,4,1]
  assert.deepEqual(arr, [1, 1, 4, 2, 4, 1]);
});

test('difference-array 全区间更新', () => {
  const da = new DifferenceArray(4);
  da.update(0, 3, 5);
  assert.deepEqual(da.restore(), [5, 5, 5, 5]);
});

test('difference-array 负值更新', () => {
  const da = new DifferenceArray(5);
  da.update(0, 4, 10);
  da.update(1, 2, -3);
  da.update(3, 4, -4);
  // [10, 7, 7, 6, 6]
  assert.deepEqual(da.restore(), [10, 7, 7, 6, 6]);
});

test('difference-array 非法区间抛错', () => {
  const da = new DifferenceArray(4);
  assert.throws(() => da.update(-1, 2, 1), RangeError);
  assert.throws(() => da.update(0, 4, 1), RangeError);
  assert.throws(() => da.update(2, 1, 1), RangeError);
});

test('difference-array 空数组', () => {
  const da = new DifferenceArray(0);
  assert.deepEqual(da.restore(), []);
});

test('difference-array 钩子 onUpdate / onRestore', () => {
  const updates: Array<[number, number, number]> = [];
  let restored: number[] = [];
  differenceArray(
    4,
    [
      { l: 0, r: 2, val: 1 },
      { l: 1, r: 3, val: 2 },
    ],
    {
      onUpdate: (l, r, val) => updates.push([l, r, val]),
      onRestore: (arr) => (restored = [...arr]),
    },
  );
  assert.deepEqual(updates, [
    [0, 2, 1],
    [1, 3, 2],
  ]);
  assert.deepEqual(restored, [1, 3, 3, 2]);
});

test('difference-array 逐点设置可重构任意数组', () => {
  // 从全 0 出发，对每个位置做单点加 a[i]，restore 后应得 a
  const a = [2, 5, 3, 8, 1];
  const n = a.length;
  const da = new DifferenceArray(n);
  for (let i = 0; i < n; i++) da.update(i, i, a[i]!);
  assert.deepEqual(da.restore(), a);
});

test('difference-array 差分语义：d[i]=a[i]-a[i-1] 时前缀和还原 a', () => {
  // 差分数组 d 满足 d[0]=a[0], d[i]=a[i]-a[i-1]；d 的前缀和 = a。
  // 这里直接构造内部 diff（用 update 表达：update(i,i,val) 等价于 diff[i]+=val; diff[i+1]-=val，
  // 故单点设置一个「脉冲」会同时影响 i 与 i+1；正确做法是把 a 当作区间增量直接累加）。
  const a = [2, 5, 3, 8, 1];
  const n = a.length;
  const da = new DifferenceArray(n);
  // 把整个 a 当作初始内容：逐点 update(i,i,a[i])
  for (let i = 0; i < n; i++) da.update(i, i, a[i]!);
  // restore 即对 diff 求前缀和，应等于 a
  assert.deepEqual(da.restore(), a);
  // 验证差分不变量：相邻元素差 = diff[i]（在还原前的差分数组中）
  // diff[i] = a[i] - a[i-1]（除首项），这里通过 restore 后的相邻差验证
  const restored = da.restore();
  for (let i = 1; i < n; i++) {
    assert.equal(restored[i]! - restored[i - 1]!, a[i]! - a[i - 1]!);
  }
});
