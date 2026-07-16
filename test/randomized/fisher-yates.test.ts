import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fisherYates, makeLcg } from '../../src/algorithms/randomized/fisher-yates/impl.ts';

test('fisher-yates 边界情况', () => {
  assert.deepEqual(fisherYates([]), []);
  assert.deepEqual(fisherYates([1]), [1]);
});

test('fisher-yates 保留多集合（作为多重集）', () => {
  const input = [3, 1, 2, 3, 1, 2];
  const out = fisherYates(input, makeLcg(123));
  // 作为多重集应当相同
  assert.deepEqual([...out].sort(), [...input].sort());
});

test('fisher-yates 固定种子可复现', () => {
  const input = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.deepEqual(fisherYates(input, makeLcg(42)), [4, 7, 8, 3, 6, 5, 1, 9, 2]);
  assert.deepEqual(fisherYates(input, makeLcg(42)), fisherYates(input, makeLcg(42)));
});

test('fisher-yates 不修改原数组', () => {
  const input = [3, 1, 2];
  fisherYates(input, makeLcg(1));
  assert.deepEqual(input, [3, 1, 2]);
});

test('fisher-yates 钩子被调用', () => {
  let picks = 0;
  let swaps = 0;
  fisherYates([3, 2, 1, 4], makeLcg(7), {
    onPick: () => picks++,
    onSwap: () => swaps++,
  });
  assert.equal(picks, 3, '应 pick n-1 次');
  assert.ok(swaps >= 0, 'swap 至少 0 次');
});
