import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwtEncode, bwtDecode } from '../../src/algorithms/compression/comp-bwt-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-bwt-3/trace.ts';

test('bwt banana', () => {
  const r = bwtEncode('banana');
  assert.equal(r.last, 'nnbaaa');
});
test('bwt round-trip', () => {
  for (const s of ['banana', 'abracadabra', 'mississippi']) {
    const r = bwtEncode(s);
    assert.equal(bwtDecode(r.last, r.primary), s);
  }
});
test('bwt trace 非空', () => assert.ok(buildTrace().length > 0));
