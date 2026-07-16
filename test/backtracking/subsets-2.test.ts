import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsets2, type Subsets2Hooks } from '../../src/algorithms/backtracking/subsets-2/impl.ts';

const asSets = (xs: number[][]): string[] =>
  xs.map((s) => [...s].sort((a, b) => a - b).join(',')).sort();

test('subsets-2 [1,2,2] 去重正确', () => {
  const got = asSets(subsets2([1, 2, 2]));
  assert.deepEqual(got, ['', '1', '1,2', '1,2,2', '2', '2,2']);
});

test('subsets-2 [4,4,4,1,4]', () => {
  const got = asSets(subsets2([4, 4, 4, 1, 4]));
  const expected = asSets([
    [],
    [4],
    [4, 4],
    [4, 4, 4],
    [4, 4, 4, 4],
    [1],
    [1, 4],
    [1, 4, 4],
    [1, 4, 4, 4],
    [1, 4, 4, 4, 4],
  ]);
  assert.deepEqual(got, expected);
});

test('subsets-2 无重复元素时退化为幂集', () => {
  const got = asSets(subsets2([1, 2, 3]));
  assert.deepEqual(got, ['', '1', '1,2', '1,2,3', '1,3', '2', '2,3', '3']);
});

test('subsets-2 全相同元素只有 n+1 个子集', () => {
  // [2,2,2] → [], [2], [2,2], [2,2,2] = 4 个
  assert.equal(subsets2([2, 2, 2]).length, 4);
  assert.equal(subsets2([5]).length, 2);
});

test('subsets-2 结果中无重复', () => {
  const src = [1, 2, 2, 3, 3];
  const results = subsets2(src);
  const seen = new Set<string>();
  for (const s of results) {
    const key = [...s].sort((a, b) => a - b).join(',');
    assert.ok(!seen.has(key), `子集重复: ${key}`);
    seen.add(key);
  }
});

test('subsets-2 不修改入参', () => {
  const src = [3, 1, 2, 2];
  const snapshot = [...src];
  subsets2(src);
  assert.deepEqual(src, snapshot);
});

test('subsets-2 空数组只有空集', () => {
  assert.deepEqual(subsets2([]), [[]]);
});

test('subsets-2 钩子被调用', () => {
  let picks = 0;
  let prunes = 0;
  let subsets = 0;
  const hooks: Subsets2Hooks = {
    onPick: () => picks++,
    onPrune: () => prunes++,
    onSubset: () => subsets++,
  };
  subsets2([1, 2, 2], hooks);
  assert.equal(subsets, 6);
  assert.ok(picks > 0, '应有选取事件');
  assert.ok(prunes >= 1, '应有剪枝事件');
});
