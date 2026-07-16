import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCycleList, hasCycle } from '../../src/algorithms/list/has-cycle/impl.ts';

test('hasCycle 检测', () => {
  assert.equal(hasCycle(buildCycleList([3, 2, 0, -4], 1)), true);
  assert.equal(hasCycle(buildCycleList([1, 2], 0)), true);
  assert.equal(hasCycle(buildCycleList([1, 2, 3, 4], -1)), false);
  assert.equal(hasCycle(buildCycleList([1], -1)), false);
  assert.equal(hasCycle(buildCycleList([], -1)), false);
  assert.equal(hasCycle(buildCycleList([1], 0)), true);
});

test('hasCycle 钩子', () => {
  let steps = 0;
  let done = false;
  hasCycle(buildCycleList([3, 2, 0, -4], 1), {
    onStep: () => steps++,
    onDone: () => (done = true),
  });
  assert.ok(steps > 0);
  assert.equal(done, true);
});
