import { test } from 'node:test';
import assert from 'node:assert/strict';
import { piccoloEncrypt } from '../../src/algorithms/crypto/crypto-piccolo/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-piccolo/trace.ts';
test('piccolo 输出 8 字节', () =>
  assert.equal(piccoloEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7]).length, 8));
test('piccolo trace 非空', () => assert.ok(buildTrace().length > 0));
