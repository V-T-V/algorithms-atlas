import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clefiaEncrypt } from '../../src/algorithms/crypto/crypto-clefia/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-clefia/trace.ts';
test('clefia 输出 16 字节', () =>
  assert.equal(
    clefiaEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).length,
    16,
  ));
test('clefia trace 非空', () => assert.ok(buildTrace().length > 0));
