import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pbkdf2 } from '../../src/algorithms/crypto/crypto-pbkdf2/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-pbkdf2/trace.ts';
test('pbkdf2 输出长度', () => assert.equal(pbkdf2([1, 2], [9, 9, 9, 9], 3, 16).length, 16));
test('pbkdf2 trace 非空', () => assert.ok(buildTrace().length > 0));
