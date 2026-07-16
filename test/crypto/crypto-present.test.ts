import { test } from 'node:test';
import assert from 'node:assert/strict';
import { presentEncrypt } from '../../src/algorithms/crypto/crypto-present/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-present/trace.ts';
test('present 输出 4 字节', () =>
  assert.equal(presentEncrypt([1, 2, 3, 4], [1, 2, 3, 4]).length, 4));
test('present trace 非空', () => assert.ok(buildTrace().length > 0));
