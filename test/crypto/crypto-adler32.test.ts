import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adler32 } from '../../src/algorithms/crypto/crypto-adler32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-adler32/trace.ts';
test('adler 空输入=1', () => assert.equal(adler32([]), 1));
test('adler 确定性', () => assert.equal(adler32([1, 2, 3]), adler32([1, 2, 3])));
test('adler trace 非空', () => assert.ok(buildTrace().length > 0));
