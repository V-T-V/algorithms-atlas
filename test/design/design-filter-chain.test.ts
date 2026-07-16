import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyFilters } from '../../src/algorithms/design/design-filter-chain/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-filter-chain/trace.ts';

test('filter 全部通过', () => {
  const r = applyFilters(5, [(x) => ({ ok: x > 0 }), (x) => ({ ok: x < 10 })]);
  assert.equal(r.ok, true);
});
test('filter 短路拒绝', () => {
  const r = applyFilters(100, [(x) => ({ ok: x > 0 }), (x) => ({ ok: x < 10, reason: 'too big' })]);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'too big');
});
test('filter trace 非空', () => assert.ok(buildTrace().length > 0));
