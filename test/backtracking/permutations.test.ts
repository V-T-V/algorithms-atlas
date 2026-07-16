import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permutations, factorial } from '../../src/algorithms/backtracking/permutations/impl.ts';

test('permutations 总数为 n!', () => {
  assert.equal(permutations([]).length, 1); // 空数组有一个空排列
  assert.equal(permutations([1]).length, 1);
  assert.equal(permutations([1, 2, 3]).length, factorial(3));
  assert.equal(permutations([1, 2, 3, 4]).length, factorial(4));
  assert.equal(permutations([5, 6, 7, 8, 9]).length, factorial(5));
});

test('permutations [1,2,3] 结果集合正确', () => {
  const got = permutations([1, 2, 3])
    .map((p) => p.join(','))
    .sort();
  assert.deepEqual(got, ['1,2,3', '1,3,2', '2,1,3', '2,3,1', '3,1,2', '3,2,1']);
});

test('permutations 每个结果都是合法排列', () => {
  const src = [1, 2, 3, 4];
  const results = permutations(src);
  for (const p of results) {
    assert.deepEqual([...p].sort(), [...src].sort(), '排列应包含原数组所有元素');
  }
  // 无重复
  const set = new Set(results.map((p) => p.join(',')));
  assert.equal(set.size, results.length, '排列不应重复');
});

test('permutations 不修改入参', () => {
  const src = [1, 2, 3];
  const snapshot = [...src];
  permutations(src);
  assert.deepEqual(src, snapshot);
});

test('permutations 单元素', () => {
  assert.deepEqual(permutations([42]), [[42]]);
});

test('permutations maxPermutations 限流生效', () => {
  const limited = permutations([1, 2, 3, 4], {}, { maxPermutations: 3 });
  assert.equal(limited.length, 3);
});

test('permutations 钩子被调用', () => {
  let swaps = 0;
  let unswaps = 0;
  let perms = 0;
  permutations([1, 2, 3], {
    onSwap: () => swaps++,
    onUnswap: () => unswaps++,
    onPermutation: () => perms++,
  });
  assert.ok(swaps > 0, '应触发交换');
  assert.equal(swaps, unswaps, '交换与撤销应配对');
  assert.equal(perms, factorial(3));
});
