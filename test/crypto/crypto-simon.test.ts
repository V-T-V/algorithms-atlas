import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simonEncrypt } from '../../src/algorithms/crypto/crypto-simon/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-simon/trace.ts';
test('simon 输出 8 字节', () =>
  assert.equal(simonEncrypt([0, 0, 0, 1], [0, 0, 0, 2, 0, 0, 0, 3]).length, 8));
test('simon trace 非空', () => assert.ok(buildTrace().length > 0));
