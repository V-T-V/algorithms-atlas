import { test } from 'node:test';
import assert from 'node:assert/strict';
import { threeWayEncrypt } from '../../src/algorithms/crypto/crypto-3way/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-3way/trace.ts';
test('3way 输出 12 字节', () =>
  assert.equal(threeWayEncrypt([1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).length, 12));
test('3way trace 非空', () => assert.ok(buildTrace().length > 0));
