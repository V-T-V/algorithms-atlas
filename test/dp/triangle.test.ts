import { test } from 'node:test';
import assert from 'node:assert/strict';
import { triangle } from '../../src/algorithms/dp/triangle/impl.ts';

test('triangle 基本行为', () => {
  assert.equal(triangle([]), 0);
  assert.equal(triangle([[5]]), 5);
  assert.equal(triangle([[1], [2, 3]]), 3); // 1 + min(2,3) = 3
});

test('triangle 经典用例', () => {
  // LeetCode 120：2 → 3 → 5 → 1 = 11
  assert.equal(triangle([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
  // 全负数
  assert.equal(triangle([[-1], [2, 3], [1, -1, -3]]), -1);
});

test('triangle 单列直下', () => {
  // 每行首元最小：路径恒沿 j=0
  assert.equal(triangle([[1], [1, 9], [1, 9, 9]]), 3);
});

test('triangle 钩子被调用', () => {
  let fill = 0;
  let path = 0;
  let done = -1;
  triangle([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]], {
    onFillCell: () => fill++,
    onPath: () => path++,
    onDone: (v) => {
      done = v;
    },
  });
  // 内部格数 = 1+2+3+4 = 10
  assert.equal(fill, 10);
  assert.ok(path >= 4, '路径至少 n 个格');
  assert.equal(done, 11);
});
