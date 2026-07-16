import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitplaneSeparate } from '../../src/algorithms/compression/comp-bitplane/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bitplane/trace.ts';
test('bitplane 数量=bits', () => {
  const p = bitplaneSeparate([1, 2, 3], 3);
  assert.equal(p.length, 3);
  assert.equal(p[0]!.length, 3);
});
test('bitplane trace 非空', () => assert.ok(buildTrace().length >= 2));
