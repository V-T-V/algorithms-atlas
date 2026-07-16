import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a32 } from '../../src/algorithms/crypto/crypto-fnv1a-32/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-fnv1a-32/trace.ts';
test('fnv 确定性', () => assert.equal(fnv1a32([1, 2, 3]), fnv1a32([1, 2, 3])));
test('fnv 空输入', () => assert.equal(fnv1a32([]), 0x811c9dc5));
test('fnv trace 非空', () => assert.ok(buildTrace().length > 0));
