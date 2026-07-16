import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sharkEncrypt } from '../../src/algorithms/crypto/crypto-shark/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-shark/trace.ts';
test('shark 输出 8 字节', () =>
  assert.equal(sharkEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7]).length, 8));
test('shark trace 非空', () => assert.ok(buildTrace().length > 0));
