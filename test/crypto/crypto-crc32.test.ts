import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32 } from '../../src/algorithms/crypto/crypto-crc32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-crc32/trace.ts';
test('crc32 空输入=0', () => assert.equal(crc32([]), 0));
test('crc32 确定性', () => assert.equal(crc32([1, 2, 3]), crc32([1, 2, 3])));
test('crc32 trace 非空', () => assert.ok(buildTrace().length > 0));
