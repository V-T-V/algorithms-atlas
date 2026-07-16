import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cast5Encrypt } from '../../src/algorithms/crypto/crypto-cast5/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cast5/trace.ts';

test('cast5 输出 8 字节', () => {
  const ct = cast5Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(ct.length, 8);
});
test('cast5 确定性', () => {
  assert.deepEqual(
    cast5Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
    cast5Encrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]),
  );
});
test('cast5 trace 非空', () => assert.ok(buildTrace().length > 0));
