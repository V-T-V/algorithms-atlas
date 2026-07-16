import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiwayNumber } from '../../src/algorithms/greedy/greedy-multiway-number/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-multiway-number/trace.ts';
test('划分和总数守恒', () => {
  const r = multiwayNumber([9, 8, 7, 6], 2);
  const total = r.groups.flat().reduce((a, b) => a + b, 0);
  assert.equal(total, 30);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
