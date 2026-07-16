import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skiRental } from '../../src/algorithms/greedy/greedy-ski-rental/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-ski-rental/trace.ts';
test('短期全租', () => {
  const r = skiRental(3, 1, 10);
  assert.equal(r.bought, false);
  assert.equal(r.total, 3);
});
test('长期最终购买', () => {
  const r = skiRental(20, 1, 10);
  assert.equal(r.bought, true);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
