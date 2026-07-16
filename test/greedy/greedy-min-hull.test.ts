import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giftWrapping } from '../../src/algorithms/greedy/greedy-min-hull/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-min-hull/trace.ts';
test('正方形凸包 4 点', () => {
  const h = giftWrapping([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]);
  assert.equal(h.length, 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
