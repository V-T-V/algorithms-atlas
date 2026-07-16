import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hallTheorem } from '../../src/algorithms/greedy/greedy-hall-matching/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-hall-matching/trace.ts';
test('完全二分图满足 Hall', () => {
  assert.equal(
    hallTheorem([
      [0, 1],
      [0, 1],
    ]),
    true,
  );
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
