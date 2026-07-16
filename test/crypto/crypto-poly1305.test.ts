import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poly1305 } from '../../src/algorithms/crypto/crypto-poly1305/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-poly1305/trace.ts';
test('poly1305 16 字节', () => assert.equal(poly1305([1, 2, 3], 7n, 0n).length, 16));
test('poly1305 确定性', () => assert.deepEqual(poly1305([1, 2], 7n, 0n), poly1305([1, 2], 7n, 0n)));
test('poly1305 trace 非空', () => assert.ok(buildTrace().length > 0));
