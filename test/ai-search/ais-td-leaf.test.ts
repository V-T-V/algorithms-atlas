import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tdLeafLearn, evaluate } from '../../src/algorithms/ai-search/ais-td-leaf/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-td-leaf/trace.ts';

test('ais-td-leaf 线性评估', () => {
  assert.equal(evaluate([1, 2, 3], [1, 1, 1]), 6);
  assert.equal(evaluate([0.5, 0.5], [2, 4]), 3);
});

test('ais-td-leaf 权重被更新', () => {
  const features = [
    [1, 0],
    [1, 0],
  ];
  const values = [0, 0];
  const weights = [0, 0];
  const rewards = [1, 0];
  const before = [...weights];
  tdLeafLearn(features, values, weights, rewards, 0.9, 0.5, 0.1);
  // 权重应变化
  assert.ok(weights[0] !== before[0] || weights[1] !== before[1]);
});

test('ais-td-leaf 正奖励使权重增大', () => {
  const features = [
    [1, 0],
    [1, 0],
  ];
  const values = [0, 0];
  const weights = [0.5, 0.5];
  const rewards = [1, 0]; // 正 TD 误差
  tdLeafLearn(features, values, weights, rewards, 0.9, 0.5, 0.1);
  assert.ok(weights[0]! > 0.5);
});

test('ais-td-leaf 空序列不报错', () => {
  const weights = [0.5];
  tdLeafLearn([], [], weights, [], 0.9, 0.5, 0.1);
  assert.equal(weights[0], 0.5);
});

test('ais-td-leaf trace', () => {
  assert.ok(buildTrace().length > 2);
});
