import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantile } from '../../src/algorithms/selection/sel-quantile/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quantile/trace.ts';

test('sel-quantile 四分位返回 3 切点', () => {
  const c = quantile([1, 2, 3, 4, 5], 4);
  assert.equal(c.length, 3);
});

test('sel-quantile 切点递增', () => {
  const c = quantile(
    Array.from({ length: 20 }, (_, i) => i + 1),
    5,
  );
  for (let i = 1; i < c.length; i++) assert.ok(c[i]! >= c[i - 1]!);
});

test('sel-quantile q=2 为中位数', () => {
  const c = quantile([1, 2, 3, 4, 5], 2);
  assert.equal(c[0], 3);
});

test('sel-quantile q<2 抛错', () => {
  assert.throws(() => quantile([1, 2], 1));
});

test('sel-quantile trace', () => {
  assert.ok(buildTrace().length >= 2);
});
