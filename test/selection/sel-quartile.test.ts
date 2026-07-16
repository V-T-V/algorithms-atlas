import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quartiles } from '../../src/algorithms/selection/sel-quartile/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quartile/trace.ts';

test('sel-quartile 基本四分位', () => {
  const q = quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(q.q2, 5.5); // 中位数
  assert.ok(q.q1 < q.q2 && q.q2 < q.q3);
});

test('sel-quartile 单元素', () => {
  const q = quartiles([7]);
  assert.equal(q.q1, 7);
  assert.equal(q.q2, 7);
  assert.equal(q.q3, 7);
});

test('sel-quartile 排序无关', () => {
  assert.deepEqual(quartiles([3, 1, 2, 5, 4]), quartiles([1, 2, 3, 4, 5]));
});

test('sel-quartile trace', () => {
  assert.ok(buildTrace().length > 1);
});
