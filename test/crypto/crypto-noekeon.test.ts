import { test } from 'node:test';
import assert from 'node:assert/strict';
import { noekeonEncrypt } from '../../src/algorithms/crypto/crypto-noekeon/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-noekeon/trace.ts';
test('noekeon 输出 16 字节', () =>
  assert.equal(
    noekeonEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).length,
    16,
  ));
test('noekeon trace 非空', () => assert.ok(buildTrace().length > 0));
