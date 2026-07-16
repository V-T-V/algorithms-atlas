import { test } from 'node:test';
import assert from 'node:assert/strict';
import { squareEncrypt } from '../../src/algorithms/crypto/crypto-square/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-square/trace.ts';
test('square 输出 16 字节', () =>
  assert.equal(
    squareEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).length,
    16,
  ));
test('square trace 非空', () => assert.ok(buildTrace().length > 0));
