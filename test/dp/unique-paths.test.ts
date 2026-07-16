import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniquePaths } from '../../src/algorithms/dp/unique-paths/impl.ts';

// 组合数 C(n,k)
function C(n: number, k: number): number {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

test('unique-paths 基本行为', () => {
  assert.equal(uniquePaths(0, 5), 0);
  assert.equal(uniquePaths(5, 0), 0);
  assert.equal(uniquePaths(1, 1), 1);
  assert.equal(uniquePaths(1, 7), 1); // 单行只有一条
  assert.equal(uniquePaths(7, 1), 1);
});

test('unique-paths 经典用例', () => {
  assert.equal(uniquePaths(3, 7), 28); // LeetCode 62 示例
  assert.equal(uniquePaths(3, 2), 3);
  assert.equal(uniquePaths(4, 5), 35);
});

test('unique-paths 等于组合数 C(m+n-2,m-1)', () => {
  for (let m = 1; m <= 8; m++) {
    for (let n = 1; n <= 8; n++) {
      assert.equal(uniquePaths(m, n), C(m + n - 2, Math.min(m - 1, n - 1)), `m=${m},n=${n}`);
    }
  }
});

test('unique-paths 钩子被调用', () => {
  let fill = 0;
  let done = -1;
  uniquePaths(3, 7, {
    onFillCell: () => fill++,
    onDone: (v) => {
      done = v;
    },
  });
  assert.equal(fill, 3 * 7, '应填满 m*n 格');
  assert.equal(done, 28);
});
