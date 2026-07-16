import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frogJump } from '../../src/algorithms/dp/dp-frog/impl.ts';

test('frog 路径合法（跳 1 或 2）', () => {
  const cost = [2, 7, 9, 3, 1];
  const { total, path } = frogJump(cost);
  assert.equal(path[0], 0);
  assert.equal(path[path.length - 1], cost.length - 1);
  for (let i = 1; i < path.length; i++) {
    const d = path[i]! - path[i - 1]!;
    assert.ok(d === 1 || d === 2, `步长 ${d} 不合法`);
  }
  let sum = 0;
  for (const idx of path) sum += cost[idx]!;
  assert.equal(sum, total);
});

test('frog 两块', () => {
  const { total, path } = frogJump([5, 10]);
  assert.deepEqual(path, [0, 1]);
  assert.equal(total, 15);
});

test('frog 跳过中间大代价', () => {
  // [1, 100, 1] → 0->2 = 1+1 = 2 < 0->1->2 = 1+100+1
  const { total } = frogJump([1, 100, 1]);
  assert.equal(total, 2);
});

test('frog 单块', () => {
  assert.equal(frogJump([7]).total, 7);
});

test('frog 空数组', () => {
  assert.equal(frogJump([]).total, 0);
});

test('frog 钩子', () => {
  let steps = 0;
  frogJump([1, 2, 3], { onStep: () => steps++ });
  assert.equal(steps, 3);
});
