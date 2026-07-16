import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hkdfExpand } from '../../src/algorithms/crypto/crypto-hkdf/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-hkdf/trace.ts';
test('hkdf 输出长度', () => assert.equal(hkdfExpand([1, 2, 3, 4], [], 20).length, 20));
test('hkdf trace 非空', () => assert.ok(buildTrace().length > 0));
