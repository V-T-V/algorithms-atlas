import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beadSort } from '../../src/algorithms/sorting/sort-gravity-bead/impl.ts';

test('beadSort 基本排序（非负整数）', () => {
  assert.deepEqual(beadSort([]), []);
  assert.deepEqual(beadSort([0]), [0]);
  assert.deepEqual(beadSort([3, 1, 4, 1, 2]), [1, 1, 2, 3, 4]);
  assert.deepEqual(beadSort([5, 0, 2, 0, 3]), [0, 0, 2, 3, 5]);
});

test('beadSort 升序输出', () => {
  const r = beadSort([4, 3, 2, 1]);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1]! <= r[i]!);
});

test('beadSort 拒绝非整数/负数', () => {
  assert.throws(() => beadSort([-1, 2]));
  assert.throws(() => beadSort([1.5, 2]));
});

test('beadSort 钩子被调用', () => {
  let lay = 0;
  let fall = 0;
  beadSort([2, 1], { onLay: () => lay++, onFall: () => fall++ });
  assert.equal(lay, 1);
  assert.equal(fall, 1);
});
