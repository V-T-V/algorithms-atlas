import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimumPath } from '../../src/algorithms/dp/minimum-path/impl.ts';

test('minimum-path 基本行为', () => {
  assert.equal(minimumPath([]), 0);
  assert.equal(minimumPath([[]]), 0);
  assert.equal(minimumPath([[5]]), 5);
});

test('minimum-path 经典用例', () => {
  // LeetCode 64：路径 1→3→1→1→1 和 = 7
  assert.equal(
    minimumPath([
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ]),
    7,
  );
  // 单行
  assert.equal(minimumPath([[1, 2, 3]]), 6);
  // 单列
  assert.equal(minimumPath([[1], [2], [3]]), 6);
});

test('minimum-path 全相同', () => {
  assert.equal(
    minimumPath([
      [1, 1],
      [1, 1],
    ]),
    3,
  );
});

test('minimum-path 钩子被调用', () => {
  let fill = 0;
  let path = 0;
  let done = -1;
  minimumPath(
    [
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ],
    {
      onFillCell: () => fill++,
      onPath: () => path++,
      onDone: (v) => {
        done = v;
      },
    },
  );
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.ok(path >= 5, '路径至少经过 m+n-1 个格');
  assert.equal(done, 7);
});
