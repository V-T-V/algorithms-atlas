import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keccakSponge } from '../../src/algorithms/crypto/crypto-keccak-sponge/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-keccak-sponge/trace.ts';
test('keccak 输出长度', () => assert.equal(keccakSponge([1, 2, 3], 4, 4).length, 4));
test('keccak trace 非空', () => assert.ok(buildTrace().length > 0));
