import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recTower3peg } from '../../src/algorithms/recursion/rec-tower-3peg/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-tower-3peg/trace.ts';
test('tower-3peg 步数 = 2^n - 1', () => {
  const r = recTower3peg(4);
  assert.equal(r.moves.length, 15);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
