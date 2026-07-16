import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  permutations2,
  countUniquePermutations,
  type Permutations2Hooks,
} from '../../src/algorithms/backtracking/permutations-2/impl.ts';

const asStrs = (xs: number[][]): string[] => xs.map((p) => p.join(',')).sort();

test('permutations-2 [1,1,2] 去重正确', () => {
  const got = asStrs(permutations2([1, 1, 2]));
  assert.deepEqual(got, ['1,1,2', '1,2,1', '2,1,1']);
});

test('permutations-2 [1,2,3] 无重复时为 6 个', () => {
  assert.equal(permutations2([1, 2, 3]).length, 6);
});

test('permutations-2 全相同元素只有 1 个排列', () => {
  assert.equal(permutations2([5, 5, 5]).length, 1);
});

test('permutations-2 [2,2,1,1]', () => {
  // n!/(2!*2!) = 24/4 = 6
  assert.equal(permutations2([2, 2, 1, 1]).length, 6);
});

test('permutations-2 结果无重复', () => {
  const results = permutations2([1, 1, 2, 2, 3]);
  const seen = new Set<string>();
  for (const p of results) {
    const key = p.join(',');
    assert.ok(!seen.has(key), `排列重复: ${key}`);
    seen.add(key);
  }
});

test('permutations-2 总数与公式一致', () => {
  const cases: number[][] = [
    [1, 1, 2],
    [1, 2, 3],
    [2, 2, 1, 1],
    [1, 1, 1, 2],
    [4, 4, 4, 4],
  ];
  for (const c of cases) {
    assert.equal(permutations2(c).length, countUniquePermutations(c));
  }
});

test('permutations-2 不修改入参', () => {
  const src = [2, 1, 1];
  const snapshot = [...src];
  permutations2(src);
  assert.deepEqual(src, snapshot);
});

test('permutations-2 钩子被调用', () => {
  let picks = 0;
  let prunes = 0;
  let perms = 0;
  const hooks: Permutations2Hooks = {
    onPick: () => picks++,
    onPrune: () => prunes++,
    onPermutation: () => perms++,
  };
  permutations2([1, 1, 2], hooks);
  assert.equal(perms, 3);
  assert.ok(picks > 0);
  assert.ok(prunes >= 1, '应有剪枝');
});
