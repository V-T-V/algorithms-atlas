import { test } from 'node:test';
import assert from 'node:assert/strict';
import { khazadEncrypt } from '../../src/algorithms/crypto/crypto-khazad/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-khazad/trace.ts';
test('khazad 输出 8 字节', () =>
  assert.equal(khazadEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7]).length, 8));
test('khazad trace 非空', () => assert.ok(buildTrace().length > 0));
