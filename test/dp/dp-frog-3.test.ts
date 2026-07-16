import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frogEnergyJump } from '../../src/algorithms/dp/dp-frog-3/impl.ts';

test('frog AtCoder DP B 例 1', () => {
  // h=[10,30,40,20] K=2 => 30
  assert.equal(frogEnergyJump([10, 30, 40, 20], 2), 30);
});

test('frog K=1 累加相邻差', () => {
  // 只能跳 1 步：|10-30|+|30-40|+|40-20| = 20+10+20 = 50
  assert.equal(frogEnergyJump([10, 30, 40, 20], 1), 50);
});

test('frog 单石头', () => {
  assert.equal(frogEnergyJump([5], 2), 0);
});

test('frog 两石头', () => {
  assert.equal(frogEnergyJump([10, 20], 1), 10);
});

test('frog K 足够大', () => {
  // 可一步直达
  assert.equal(frogEnergyJump([10, 30, 40], 5), 30);
});
