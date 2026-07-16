import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caacEncode } from '../../src/algorithms/compression/comp-arith-context/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-arith-context/trace.ts';
test('caac low 在 [0,1)', () => {
  const r = caacEncode([0, 1, 0, 1], 1);
  assert.ok(r.low >= 0 && r.low < 1);
});
test('caac trace 非空', () => assert.ok(buildTrace().length >= 2));
