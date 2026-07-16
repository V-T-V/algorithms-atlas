import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateCombinations,
  binomial,
} from '../../src/algorithms/recursion/combinations-generation/impl.ts';

test('generateCombinations C(4,2)', () => {
  const res = generateCombinations(4, 2);
  assert.equal(res.length, 6);
  assert.deepEqual(res, [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ]);
});

test('generateCombinations C(5,3) 数量正确', () => {
  const res = generateCombinations(5, 3);
  assert.equal(res.length, 10);
  // 每组长度都为 3
  assert.ok(res.every((c) => c.length === 3));
  // 无重复
  const seen = new Set(res.map((c) => c.join(',')));
  assert.equal(seen.size, res.length);
  // 字典序
  for (let i = 1; i < res.length; i++) {
    assert.ok(res[i - 1]!.join(',') < res[i]!.join(','));
  }
});

test('generateCombinations 边界', () => {
  assert.deepEqual(generateCombinations(0, 0), [[]]);
  assert.deepEqual(generateCombinations(3, 0), [[]]);
  assert.deepEqual(generateCombinations(3, 4), []);
  assert.deepEqual(generateCombinations(5, 5), [[0, 1, 2, 3, 4]]);
});

test('binomial 与组合数一致', () => {
  assert.equal(binomial(5, 3), 10);
  assert.equal(binomial(10, 0), 1);
  assert.equal(binomial(10, 10), 1);
  assert.equal(binomial(6, 2), 15);
  assert.equal(binomial(4, 5), 0);
});

test('generateCombinations 数量与 binomial 一致', () => {
  for (let n = 0; n <= 8; n++) {
    for (let kk = 0; kk <= n; kk++) {
      assert.equal(generateCombinations(n, kk).length, binomial(n, kk), `n=${n} k=${kk}`);
    }
  }
});

test('generateCombinations 非法输入抛错', () => {
  assert.throws(() => generateCombinations(-1, 0));
  assert.throws(() => generateCombinations(2, -1));
});
