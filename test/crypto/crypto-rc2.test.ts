import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc2Encrypt } from '../../src/algorithms/crypto/crypto-rc2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-rc2/trace.ts';
test('rc2 输出 4 字节', () => assert.equal(rc2Encrypt([1, 2, 3, 4], [1, 2, 3, 4]).length, 4));
test('rc2 确定性', () =>
  assert.deepEqual(rc2Encrypt([1, 2, 3, 4], [1, 2, 3, 4]), rc2Encrypt([1, 2, 3, 4], [1, 2, 3, 4])));
test('rc2 trace 非空', () => assert.ok(buildTrace().length > 0));
