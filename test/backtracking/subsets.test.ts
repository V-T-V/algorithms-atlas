import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsets } from '../../src/algorithms/backtracking/subsets/impl.ts';

const asSets = (xs: number[][]): string[] =>
  xs.map((s) => [...s].sort((a, b) => a - b).join(',')).sort();

test('subsets 总数为 2^n', () => {
  assert.equal(subsets([]).length, 1); // 仅空集
  assert.equal(subsets([1]).length, 2);
  assert.equal(subsets([1, 2]).length, 4);
  assert.equal(subsets([1, 2, 3]).length, 8);
  assert.equal(subsets([1, 2, 3, 4]).length, 16);
});

test('subsets [1,2,3] 幂集正确', () => {
  const got = asSets(subsets([1, 2, 3]));
  assert.deepEqual(got, ['', '1', '1,2', '1,2,3', '1,3', '2', '2,3', '3']);
});

test('subsets 含空集与全集', () => {
  const results = subsets([1, 2, 3]);
  assert.ok(
    results.some((s) => s.length === 0),
    '应含空集',
  );
  assert.ok(
    results.some((s) => s.length === 3),
    '应含全集',
  );
});

test('subsets 每个元素合法且无重复', () => {
  const src = [1, 2, 3, 4];
  const results = subsets(src);
  const seen = new Set<string>();
  for (const s of results) {
    assert.ok(
      s.every((x) => src.includes(x)),
      '元素应来自源数组',
    );
    const key = [...s].sort().join(',');
    assert.ok(!seen.has(key), '子集不应重复');
    seen.add(key);
  }
});

test('subsets 不修改入参', () => {
  const src = [1, 2, 3];
  const snapshot = [...src];
  subsets(src);
  assert.deepEqual(src, snapshot);
});

test('subsets maxSubsets 限流生效', () => {
  const limited = subsets([1, 2, 3, 4], {}, { maxSubsets: 5 });
  assert.equal(limited.length, 5);
});

test('subsets 钩子被调用', () => {
  let decides = 0;
  let backtracks = 0;
  let collected = 0;
  subsets([1, 2, 3], {
    onDecide: () => decides++,
    onBacktrack: () => backtracks++,
    onSubset: () => collected++,
  });
  assert.ok(decides > 0, '应触发决策');
  assert.equal(decides, backtracks, '决策与回溯应配对');
  assert.equal(collected, 8);
});
