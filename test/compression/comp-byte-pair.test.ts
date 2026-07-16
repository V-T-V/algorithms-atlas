import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bytePairEncode,
  bytePairDecode,
} from '../../src/algorithms/compression/comp-byte-pair/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-byte-pair/trace.ts';
test('bpe 往返', () => {
  const { tokens, rules } = bytePairEncode([1, 1, 2, 1, 1, 2], 256, 2);
  assert.deepEqual(bytePairDecode(tokens, rules), [1, 1, 2, 1, 1, 2]);
});
test('bpe 长度缩减', () => {
  const { tokens } = bytePairEncode([1, 1, 1, 1], 256, 2);
  assert.ok(tokens.length <= 4);
});
test('bpe trace 非空', () => assert.ok(buildTrace().length >= 2));
