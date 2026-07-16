import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RaveStats,
  raveBeta,
  raveEstimate,
  type RaveActionStat,
} from '../../src/algorithms/ai-search/ais-rave-implementation/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-rave-implementation/trace.ts';

test('ais-rave-implementation β 随 MC 访问数增大而减小', () => {
  const b1 = raveBeta(1, 10);
  const b2 = raveBeta(100, 10);
  assert.ok(b2 < b1);
});

test('ais-rave-implementation 高奖励动作估计更高', () => {
  const stats = new RaveStats(1);
  // 动作 0 全胜，动作 1 全败
  for (let i = 0; i < 10; i++) stats.recordRollout(0, 1, [0]);
  for (let i = 0; i < 10; i++) stats.recordRollout(1, 0, [1]);
  const ests = stats.estimates();
  const a0 = ests.find((e) => e.action === 0)!;
  const a1 = ests.find((e) => e.action === 1)!;
  assert.ok(a0.value > a1.value);
});

test('ais-rave-implementation 早期偏 RAVE', () => {
  const stat: RaveActionStat = { action: 0, mcVisits: 1, mcWins: 0, raveVisits: 20, raveWins: 15 };
  const val = raveEstimate(stat);
  // RAVE = 0.75, MC = 0，早期 β 大，应接近 0.75
  assert.ok(val > 0.5);
});

test('ais-rave-implementation trace', () => {
  assert.ok(buildTrace().length > 2);
});
