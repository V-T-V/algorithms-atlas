import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BinaryIndexedTree2,
  binaryIndexedTree2,
  type BIT2Hooks,
} from '../../src/algorithms/ds/binary-indexed-tree2/impl.ts';

test('binaryIndexedTree2 初始化还原原数组', () => {
  const t = binaryIndexedTree2([2, 1, 5, 3, 4]);
  assert.deepEqual(t.toArray(), [2, 1, 5, 3, 4]);
});

test('BIT2 rangeAdd 单点查询正确', () => {
  const t = new BinaryIndexedTree2(5);
  t.rangeAdd(1, 3, 10); // [10,10,10,0,0]
  assert.equal(t.pointQuery(1), 10);
  assert.equal(t.pointQuery(2), 10);
  assert.equal(t.pointQuery(3), 10);
  assert.equal(t.pointQuery(4), 0);
  assert.equal(t.pointQuery(5), 0);
});

test('BIT2 多次 rangeAdd 累加', () => {
  const t = BinaryIndexedTree2.fromArray([1, 1, 1, 1, 1]);
  t.rangeAdd(1, 3, 2); // [3,3,3,1,1]
  t.rangeAdd(2, 5, -1); // [3,2,2,0,0]
  assert.deepEqual(t.toArray(), [3, 2, 2, 0, 0]);
});

test('BIT2 区间加负值', () => {
  const t = new BinaryIndexedTree2(4);
  t.rangeAdd(1, 4, 5);
  t.rangeAdd(2, 3, -3); // [5,2,2,5]
  assert.deepEqual(t.toArray(), [5, 2, 2, 5]);
});

test('BIT2 单元素', () => {
  const t = binaryIndexedTree2([42]);
  assert.equal(t.pointQuery(1), 42);
  t.rangeAdd(1, 1, 8);
  assert.equal(t.pointQuery(1), 50);
});

test('BIT2 边界：空 / 越界忽略', () => {
  const t = new BinaryIndexedTree2(0);
  assert.equal(t.pointQuery(1), 0);
  const t2 = new BinaryIndexedTree2(3);
  t2.rangeAdd(0, 2, 5); // l<1 忽略
  t2.rangeAdd(2, 10, 5); // r>n 忽略
  assert.deepEqual(t2.toArray(), [0, 0, 0]);
  t2.rangeAdd(1, 3, 1);
  assert.deepEqual(t2.toArray(), [1, 1, 1]);
});

test('BIT2 大量随机操作 vs 暴力', () => {
  const n = 20;
  const ref = new Array<number>(n).fill(0);
  const t = new BinaryIndexedTree2(n);
  for (let step = 0; step < 100; step++) {
    const l = 1 + Math.floor((step * 7) % n);
    const r = 1 + Math.floor((step * 13) % n);
    const v = ((step * 3) % 11) - 5;
    const [a, b] = l <= r ? [l, r] : [r, l];
    t.rangeAdd(a, b, v);
    for (let i = a - 1; i < b; i++) ref[i] = (ref[i] ?? 0) + v;
  }
  for (let i = 1; i <= n; i++) assert.equal(t.pointQuery(i), ref[i - 1], `mismatch at ${i}`);
});

test('BIT2 钩子被调用', () => {
  let rangeSteps = 0;
  let querySteps = 0;
  const hooks: BIT2Hooks = {
    onRangeStep: () => rangeSteps++,
    onQueryStep: () => querySteps++,
  };
  const t = new BinaryIndexedTree2(5);
  t.rangeAdd(1, 3, 2, hooks);
  t.pointQuery(2, hooks);
  assert.ok(rangeSteps > 0, '区间加应触发 onRangeStep');
  assert.ok(querySteps > 0, '单点查应触发 onQueryStep');
});
