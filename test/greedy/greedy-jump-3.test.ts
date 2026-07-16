import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyJump3 } from '../../src/algorithms/greedy/greedy-jump-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-jump-3/trace.ts';

test('jump [2,3,1,1,4] 可达', () => {
  assert.equal(greedyJump3([2, 3, 1, 1, 4]).reachable, true);
});

test('jump [3,2,1,0,4] 不可达', () => {
  assert.equal(greedyJump3([3, 2, 1, 0, 4]).reachable, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
