import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kInversePairs } from '../../src/algorithms/dp/dp-k-inverse-arrays/impl.ts';

test('k-inverse LeetCode 629 例', () => {
  assert.equal(kInversePairs(3, 0), 1); // 升序 123
  assert.equal(kInversePairs(3, 1), 2); // 132, 213
  assert.equal(kInversePairs(9, 5), 8044);
});

test('k-inverse k=0 恒 1（升序）', () => {
  assert.equal(kInversePairs(5, 0), 1);
});

test('k-inverse k 过大无解', () => {
  assert.equal(kInversePairs(3, 100), 0);
});

test('k-inverse n=1', () => {
  assert.equal(kInversePairs(1, 0), 1);
  assert.equal(kInversePairs(1, 1), 0);
});

test('k-inverse 总数 = n!', () => {
  // 对 n=4，所有 k 的数目之和应等于 24
  let sum = 0;
  for (let kk = 0; kk <= 6; kk++) sum += kInversePairs(4, kk);
  assert.equal(sum, 24);
});

test('k-inverse 钩子', () => {
  let cells = 0;
  kInversePairs(3, 1, 1_000_000_007, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
