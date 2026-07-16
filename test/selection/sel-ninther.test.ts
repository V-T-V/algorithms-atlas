import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nintherOfArray, median3 } from '../../src/algorithms/selection/sel-ninther/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-ninther/trace.ts';

test('sel-ninther median3', () => {
  assert.equal(median3(1, 2, 3), 2);
  assert.equal(median3(3, 1, 2), 2);
  assert.equal(median3(5, 5, 1), 5);
});

test('sel-ninther 大数组返回有效值', () => {
  const arr = Array.from({ length: 27 }, (_, i) => i + 1);
  const r = nintherOfArray(arr);
  assert.ok(r.value >= 1 && r.value <= 27);
  assert.ok(arr[r.index] === r.value);
});

test('sel-ninther 小数组回退', () => {
  const r = nintherOfArray([3, 1, 2]);
  assert.equal(r.value, 2);
});

test('sel-ninther trace', () => {
  assert.ok(buildTrace().length > 2);
});
