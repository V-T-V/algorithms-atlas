import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frogJumpHard } from '../../src/algorithms/dp/dp-frog-hard/impl.ts';

test('frog-hard maxJump=1 退化为全踩', () => {
  const { total, path } = frogJumpHard({ cost: [0, 3, 5, 1, 2], maxJump: 1 });
  assert.equal(total, 0 + 3 + 5 + 1 + 2);
  assert.deepEqual(path, [0, 1, 2, 3, 4]);
});

test('frog-hard maxJump=2 选最小', () => {
  // cost [0,3,5,1,2], maxJump 2: dp[0]=0, dp[1]=3, dp[2]=min(0,3)+5=5, dp[3]=min(3,5)+1=4, dp[4]=min(5,4)+2=6
  const { total } = frogJumpHard({ cost: [0, 3, 5, 1, 2], maxJump: 2 });
  assert.equal(total, 6);
});

test('frog-hard 路径步长 <= maxJump', () => {
  const cost = [0, 3, 5, 1, 2, 6, 4, 8];
  const { path } = frogJumpHard({ cost, maxJump: 3 });
  assert.equal(path[0], 0);
  assert.equal(path[path.length - 1], cost.length - 1);
  for (let i = 1; i < path.length; i++) {
    const d = path[i]! - path[i - 1]!;
    assert.ok(d >= 1 && d <= 3, `步长 ${d} 越界`);
  }
});

test('frog-hard 单元素', () => {
  const { total, path } = frogJumpHard({ cost: [7], maxJump: 2 });
  assert.equal(total, 7);
  assert.deepEqual(path, [0]);
});

test('frog-hard maxJump 大于 n 时直达', () => {
  // cost [10,1,1,1,1] maxJump 10: 只需从 0 跳到末尾，但每跳都要踩目标，dp[4]=10+1=11? 实际 dp[0]=10,
  // dp[i]=min(dp[j])+cost[i]，最小 dp[j] 是 dp[0]=10，所以 dp[4]=10+1=11，但也可 dp[1]=11,dp[4]=11+1=12
  // 最小为 dp[4]=min over j of dp[j]+cost[4] = dp[0]+1 = 11
  const { total } = frogJumpHard({ cost: [10, 1, 1, 1, 1], maxJump: 10 });
  assert.equal(total, 11);
});

test('frog-hard 钩子被调用', () => {
  let steps = 0;
  frogJumpHard({ cost: [0, 3, 5], maxJump: 2 }, { onStep: () => steps++ });
  assert.equal(steps, 3);
});
