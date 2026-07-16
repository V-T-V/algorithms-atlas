import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCoinGreedy } from '../../src/algorithms/greedy/greedy-coin-greedy/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-coin-greedy/trace.ts';

test('规范币系 63 分 = 2×25+1×10+3×1', () => {
  const r = greedyCoinGreedy(63, [25, 10, 5, 1]);
  assert.equal(r.totalCoins, 6);
  assert.equal(r.used[25], 2);
  assert.equal(r.used[10], 1);
  assert.equal(r.used[1], 3);
});

test('无法凑出标记 ok=false', () => {
  const r = greedyCoinGreedy(3, [2]);
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
