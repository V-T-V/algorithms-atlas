import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gasStationG } from '../../src/algorithms/greedy/gas-station-g/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/gas-station-g/trace.ts';

test('gasStationG 经典示例 起点=3', () => {
  assert.equal(gasStationG([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]).start, 3);
});

test('gasStationG 无解返回 -1', () => {
  assert.equal(gasStationG([2, 3, 4], [3, 4, 3]).start, -1);
});

test('gasStationG 单站点', () => {
  assert.equal(gasStationG([5], [4]).start, 0);
});

test('gasStationG 钩子触发', () => {
  let settled = false;
  gasStationG([1, 2, 3, 4, 5], [3, 4, 5, 1, 2], { onResult: () => (settled = true) });
  assert.ok(settled);
});

test('buildTrace 含起点', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
