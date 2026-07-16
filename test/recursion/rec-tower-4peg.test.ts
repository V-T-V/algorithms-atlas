import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recTower4peg } from '../../src/algorithms/recursion/rec-tower-4peg/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-tower-4peg/trace.ts';
test('tower-4peg 生成步数', () => {
  const r = recTower4peg(3);
  assert.ok(r.moves.length >= 1);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
