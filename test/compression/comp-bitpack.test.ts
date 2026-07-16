import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitPack, bitUnpack } from '../../src/algorithms/compression/comp-bitpack/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bitpack/trace.ts';
test('bitpack 往返一致', () => {
  const { bytes } = bitPack([1, 2, 3, 4, 5], 3);
  assert.deepEqual(bitUnpack(bytes, 3, 5), [1, 2, 3, 4, 5]);
});
test('bitpack trace 非空', () => assert.ok(buildTrace().length >= 2));
