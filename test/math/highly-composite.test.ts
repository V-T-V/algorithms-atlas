import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  highlyCompositeUpTo,
  divisorCount,
} from '../../src/algorithms/math/highly-composite/impl.ts';

test('highly-composite 已知序列', () => {
  const { records } = highlyCompositeUpTo(120);
  const vals = records.map((r) => r.value);
  // 1, 2, 4, 6, 12, 24, 36, 48, 60, 120
  assert.deepEqual(vals, [1, 2, 4, 6, 12, 24, 36, 48, 60, 120]);
});

test('highly-composite 60 有 12 个因子', () => {
  assert.equal(divisorCount(60), 12);
});

test('highly-composite divisorCount 基础', () => {
  assert.equal(divisorCount(1), 1);
  assert.equal(divisorCount(6), 4); // 1,2,3,6
  assert.equal(divisorCount(12), 6); // 1,2,3,4,6,12
  assert.equal(divisorCount(7), 2); // 素数
});

test('highly-composite 因子数严格递增', () => {
  const { records } = highlyCompositeUpTo(100);
  for (let i = 1; i < records.length; i++) {
    assert.ok(records[i]!.divisors > records[i - 1]!.divisors, 'divisors strictly increase');
    assert.ok(records[i]!.value > records[i - 1]!.value, 'values strictly increase');
  }
});

test('highly-composite n=1', () => {
  const { records } = highlyCompositeUpTo(1);
  assert.deepEqual(records, [{ value: 1, divisors: 1 }]);
});

test('highly-composite n=0', () => {
  const { records } = highlyCompositeUpTo(0);
  assert.equal(records.length, 0);
});

test('highly-composite 钩子被调用', () => {
  let records = 0;
  highlyCompositeUpTo(50, { onRecord: () => records++ });
  assert.ok(records > 0);
});
