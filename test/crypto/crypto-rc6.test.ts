import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc6Encrypt } from '../../src/algorithms/crypto/crypto-rc6/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc6/trace.ts';

test('rc6 输出 8 字节', () => {
  const ct = rc6Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('rc6 确定性', () => {
  assert.deepEqual(
    rc6Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
    rc6Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('rc6 trace 非空', () => assert.ok(buildTrace().length > 0));
