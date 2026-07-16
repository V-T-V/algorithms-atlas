import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discreteLog } from '../../src/algorithms/math/math-disc-log-3/impl.ts';

test('bsgs 2^x=3 mod 5', () => {
  // 2^3 = 8 ≡ 3 mod 5
  assert.equal(discreteLog(2n, 3n, 5n), 3n);
});

test('bsgs 2^x=1 mod 7', () => {
  // 2^0 = 1
  assert.equal(discreteLog(2n, 1n, 7n), 0n);
});

test('bsgs 无解', () => {
  // 2 在模 7 下生成 {1,2,4}；3 不在其中
  assert.equal(discreteLog(2n, 3n, 7n), null);
});
