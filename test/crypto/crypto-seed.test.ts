import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedEncrypt } from '../../src/algorithms/crypto/crypto-seed/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-seed/trace.ts';

test('seed 输出 8 字节', () => {
  const ct = seedEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('seed 确定性', () => {
  assert.deepEqual(
    seedEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
    seedEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('seed trace 非空', () => assert.ok(buildTrace().length > 0));
