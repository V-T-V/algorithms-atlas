import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsetSum } from '../../src/algorithms/dp/subset-sum/impl.ts';

// 校验：返回的子集下标合法，且元素和恰为 target。
function check(nums: number[], target: number, expectFound: boolean): void {
  const r = subsetSum(nums, target);
  if (expectFound) {
    assert.ok(r !== null, `应找到 (target=${target})`);
    for (const idx of r!) assert.ok(idx >= 0 && idx < nums.length, '下标越界');
    const sum = r!.reduce((a, idx) => a + nums[idx]!, 0);
    assert.equal(sum, target, '元素和应等于 target');
    // 去重检查
    assert.equal(new Set(r!).size, r!.length, '下标不应重复');
  } else {
    assert.equal(r, null, `应无解 (target=${target})`);
  }
}

test('subset-sum 基本行为', () => {
  assert.deepEqual(subsetSum([], 0), []);
  assert.equal(subsetSum([], 5), null);
  assert.deepEqual(subsetSum([7], 7), [0]);
  assert.equal(subsetSum([7], 3), null);
});

test('subset-sum 经典用例', () => {
  // {3,34,4,12,5,2}, target=9 → 4+5=9
  check([3, 34, 4, 12, 5, 2], 9, true);
  check([3, 34, 4, 12, 5, 2], 14, true); // 12+2=14
  check([3, 34, 4, 12, 5, 2], 13, false); // 无子集和恰为 13
  check([3, 34, 4, 12, 5, 2], 100, false); // 总和 60 < 100
  check([1, 2, 3], 0, true); // 空集
});

test('subset-sum target 为 0 返回空集', () => {
  assert.deepEqual(subsetSum([1, 2, 3], 0), []);
});

test('subset-sum 钩子被调用', () => {
  let items = 0;
  let fill = 0;
  let back = 0;
  let done: [boolean, number[]] | null = null;
  subsetSum([3, 34, 4, 12, 5, 2], 9, {
    onItem: () => items++,
    onFillCell: () => fill++,
    onBacktrack: () => back++,
    onDone: (ok, sub) => {
      done = [ok, sub];
    },
  });
  assert.ok(items >= 1, '应触发 onItem');
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.ok(back > 0, '应触发回溯');
  assert.ok(done !== null && done[0] === true, '应报告找到');
});
