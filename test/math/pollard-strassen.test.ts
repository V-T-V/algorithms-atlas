import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pollardStrassen } from '../../src/algorithms/math/pollard-strassen/impl.ts';

test('pollardStrassen 偶数', () => {
  assert.equal(pollardStrassen(100), 2n);
});

test('pollardStrassen 合数', () => {
  const f = pollardStrassen(10403n)!; // 101 × 103
  assert.equal(10403n % f, 0n);
  assert.ok(f > 1n && f < 10403n);
});

test('pollardStrassen 半素数', () => {
  const f = pollardStrassen(8051n)!; // 83 × 97
  assert.ok(f === 83n || f === 97n || 8051n % f === 0n);
});

test('pollardStrassen 素数返回 null', () => {
  assert.equal(pollardStrassen(97n), null);
  assert.equal(pollardStrassen(1009n), null);
});

test('pollardStrassen 大半素数', () => {
  const f = pollardStrassen(1000003n * 1000033n)!;
  assert.ok(f > 1n);
  assert.equal((1000003n * 1000033n) % f, 0n);
});

test('pollardStrassen 边界', () => {
  assert.equal(pollardStrassen(0n), null);
  assert.equal(pollardStrassen(1n), null);
});
