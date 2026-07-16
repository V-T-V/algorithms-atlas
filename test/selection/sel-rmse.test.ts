import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rmse } from '../../src/algorithms/selection/sel-rmse/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-rmse/trace.ts';

test('rmse 常数数组 = 0', () => assert.equal(rmse([5, 5, 5, 5]), 0));
test('rmse 对称分布', () => {
  assert.ok(Math.abs(rmse([1, 2, 3]) - 0.8165) < 0.001);
});
test('rmse trace 非空', () => assert.ok(buildTrace().length > 0));
