import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc5Encrypt, rc5KeyExpand } from '../../src/algorithms/crypto/crypto-rc5/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc5/trace.ts';

test('rc5 输出 4 字节', () => {
  const ct = rc5Encrypt([0x01, 0x23, 0x45, 0x67], [0x12, 0x34, 0x56, 0x78]);
  assert.equal(ct.length, 4);
});
test('rc5 密钥扩展长度正确', () => {
  const S = rc5KeyExpand([1, 2, 3, 4], 4);
  assert.equal(S.length, 10);
});
test('rc5 确定性', () => {
  assert.deepEqual(rc5Encrypt([1, 2, 3, 4], [5, 6, 7, 8]), rc5Encrypt([1, 2, 3, 4], [5, 6, 7, 8]));
});
test('rc5 trace 非空', () => assert.ok(buildTrace().length > 0));
