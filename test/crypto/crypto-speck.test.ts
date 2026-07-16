import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speckEncrypt } from '../../src/algorithms/crypto/crypto-speck/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-speck/trace.ts';
test('speck 输出 8 字节', () =>
  assert.equal(speckEncrypt([0, 0, 0, 1], [0, 0, 0, 2, 0, 0, 0, 3]).length, 8));
test('speck trace 非空', () => assert.ok(buildTrace().length > 0));
