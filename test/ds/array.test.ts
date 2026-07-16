import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DynamicArray, array } from '../../src/algorithms/ds/array/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/array/trace.ts';

test('array push 与随机访问', () => {
  const da = new DynamicArray(2);
  da.push(10);
  da.push(20);
  da.push(30); // 触发扩容
  assert.equal(da.size, 3);
  assert.equal(da.capacity, 4);
  assert.equal(da.get(0), 10);
  assert.equal(da.get(2), 30);
  assert.deepEqual(da.toArray(), [10, 20, 30]);
});

test('array 便利函数', () => {
  assert.deepEqual(array([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(array([]), []);
});

test('array insert / remove', () => {
  const da = new DynamicArray(8);
  for (const v of [1, 2, 3]) da.push(v);
  da.insert(1, 99); // [1, 99, 2, 3]
  assert.deepEqual(da.toArray(), [1, 99, 2, 3]);
  const removed = da.remove(0); // [99, 2, 3]
  assert.equal(removed, 1);
  assert.deepEqual(da.toArray(), [99, 2, 3]);
});

test('array 扩容钩子', () => {
  let resizes = 0;
  const da = new DynamicArray(4);
  for (let i = 0; i < 9; i++) da.push(i, { onResize: () => resizes++ });
  // cap 4->8->16，9 个元素触发 2 次扩容
  assert.equal(resizes, 2);
  assert.equal(da.capacity, 16);
});

test('array 边界异常', () => {
  const da = new DynamicArray(4);
  assert.throws(() => da.get(0));
  assert.throws(() => da.insert(5, 0));
  assert.throws(() => da.remove(0));
  da.push(1);
  assert.throws(() => da.get(1)); // 只有 1 个元素
});

test('array buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
