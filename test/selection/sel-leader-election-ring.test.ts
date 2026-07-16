import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ringLeaderElection } from '../../src/algorithms/selection/sel-leader-election-ring/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-leader-election-ring/trace.ts';

test('sel-leader-election-ring 选最大 id', () => {
  const leader = ringLeaderElection([3, 1, 4, 1, 5, 9, 2, 6], 0);
  assert.equal(leader, 9);
});

test('sel-leader-election-ring 发起者最大直接当选', () => {
  const leader = ringLeaderElection([9, 1, 2, 3], 0);
  assert.equal(leader, 9);
});

test('sel-leader-election-ring 不同发起者结果相同', () => {
  const ids = [3, 7, 2, 5];
  const a = ringLeaderElection(ids, 0);
  const b = ringLeaderElection(ids, 2);
  assert.equal(a, 7);
  assert.equal(b, 7);
});

test('sel-leader-election-ring trace', () => {
  assert.ok(buildTrace().length > 2);
});
