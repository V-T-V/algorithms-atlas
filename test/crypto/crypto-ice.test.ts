import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iceEncrypt } from '../../src/algorithms/crypto/crypto-ice/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ice/trace.ts';
test('ice 输出 8 字节', () =>
  assert.equal(iceEncrypt([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8]).length, 8));
test('ice trace 非空', () => assert.ok(buildTrace().length > 0));
