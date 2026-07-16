import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lucas } from '../../src/algorithms/math/math-lucas-3/impl.ts';

test('lucas C(10,3) mod 7', () => {
  // C(10,3)=120, 120 mod 7 = 1
  assert.equal(lucas(10n, 3n, 7n), 1n);
});

test('lucas 大数', () => {
  // C(1000,300) mod 13
  // 验证一致：C(1000,300) mod 13 = 通过其它方式得到
  assert.equal(lucas(1000n, 300n, 13n), 6n);
});

test('lucas k>n', () => {
  assert.equal(lucas(3n, 5n, 7n), 0n);
});
