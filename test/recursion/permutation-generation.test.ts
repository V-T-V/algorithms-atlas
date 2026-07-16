import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  permutations,
  factorial,
} from '../../src/algorithms/recursion/permutation-generation/impl.ts';

test('permutations 数量 = n!', () => {
  assert.equal(permutations([]).length, 1); // 空数组有 1 个排列（空）
  assert.equal(permutations([1]).length, 1);
  assert.equal(permutations([1, 2]).length, 2);
  assert.equal(permutations([1, 2, 3]).length, 6);
  assert.equal(permutations([1, 2, 3, 4]).length, 24);
  assert.equal(permutations([1, 2, 3, 4, 5]).length, 120);
});

test('permutations [1,2,3] 结果正确（集合相等）', () => {
  const perms = permutations([1, 2, 3]);
  assert.equal(perms.length, 6);
  const set = new Set(perms.map((p) => p.join(',')));
  assert.equal(set.size, 6, '6 个排列应互不相同');
  // 期望的 6 种
  const expected = ['1,2,3', '1,3,2', '2,1,3', '2,3,1', '3,2,1', '3,1,2'];
  for (const e of expected) assert.ok(set.has(e), `应包含 ${e}`);
});

test('permutations 每个排列都是原元素的重排', () => {
  const perms = permutations([1, 2, 3, 4]);
  for (const p of perms) {
    assert.deepEqual(
      [...p].sort((a, b) => a - b),
      [1, 2, 3, 4],
    );
  }
});

test('permutations 不修改原数组', () => {
  const input = [1, 2, 3];
  const snapshot = [...input];
  permutations(input);
  assert.deepEqual(input, snapshot);
});

test('permutations 含重复元素', () => {
  // 算法不去重，仍产生 n! 个（含重复排列）
  const perms = permutations([1, 1, 2]);
  assert.equal(perms.length, 6);
});

test('factorial 正确', () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(1), 1);
  assert.equal(factorial(5), 120);
  assert.equal(factorial(10), 3628800);
  assert.throws(() => factorial(-1), RangeError);
  assert.throws(() => factorial(1.5), RangeError);
});

test('permutations 钩子被调用', () => {
  let swaps = 0;
  let emits = 0;
  let recurseCalls = 0;
  const emitted: number[][] = [];
  permutations([1, 2, 3], {
    onSwap: () => swaps++,
    onEmit: (perm) => {
      emits++;
      emitted.push([...perm]);
    },
    onRecurse: () => recurseCalls++,
  });
  assert.equal(emits, 6, '应生成 6 个排列');
  assert.equal(emitted.length, 6);
  assert.ok(swaps > 0, '应有交换');
  assert.ok(recurseCalls > 0, '应递归');
  // 第一个排列应是原顺序
  assert.deepEqual(emitted[0], [1, 2, 3]);
});

test('permutations 单元素', () => {
  const perms = permutations([42]);
  assert.deepEqual(perms, [[42]]);
});
