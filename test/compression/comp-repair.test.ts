import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repairCompress } from '../../src/algorithms/compression/comp-repair/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-repair/trace.ts';
test('repair 缩减重复对', () => {
  const { tokens } = repairCompress([1, 2, 1, 2, 1, 2], 256);
  assert.ok(tokens.length < 6);
});
test('repair trace 非空', () => assert.ok(buildTrace().length >= 2));
