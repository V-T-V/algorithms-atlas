import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  memory1ValueIteration,
  titForTatPolicy,
  prisonerReward,
} from '../../src/algorithms/ai-search/ais-memory-1/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-memory-1/trace.ts';

test('ais-memory-1 价值迭代收敛', () => {
  const { values, iterations } = memory1ValueIteration(4, titForTatPolicy(), prisonerReward(), 0.9);
  assert.ok(iterations < 1000);
  assert.equal(values.length, 4);
});

test('ais-memory-1 TFT 双方合作稳态最高', () => {
  const { values } = memory1ValueIteration(4, titForTatPolicy(), prisonerReward(), 0.9);
  // TFT 下从 CC 出发会稳定合作，价值最高
  assert.ok(values[0]! > values[3]!);
});

test('ais-memory-1 单状态平凡收敛', () => {
  const policy = [[1]];
  const reward = [[5]];
  const { values, iterations } = memory1ValueIteration(1, policy, reward, 0.5);
  // V = 5 + 0.5·V => V = 10
  assert.ok(Math.abs(values[0]! - 10) < 0.1);
  assert.ok(iterations < 1000);
});

test('ais-memory-1 trace', () => {
  assert.ok(buildTrace().length > 2);
});
