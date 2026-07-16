import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maximalSquare } from '../../src/algorithms/dp/maximal-square/impl.ts';

test('maximal-square 基本行为', () => {
  assert.equal(maximalSquare([]), 0);
  assert.equal(maximalSquare([[]]), 0);
  assert.equal(maximalSquare([[0]]), 0);
  assert.equal(maximalSquare([[1]]), 1);
  assert.equal(maximalSquare([['1']]), 1); // 字符也支持
});

test('maximal-square 经典用例', () => {
  // LeetCode 221 示例：答案边长 2，面积 4
  const m1 = [
    ['1', '0', '1', '0', '0'],
    ['1', '0', '1', '1', '1'],
    ['1', '1', '1', '1', '1'],
    ['1', '0', '0', '1', '0'],
  ];
  assert.equal(maximalSquare(m1), 2);

  // 全 1 的 3x3 → 边长 3
  const m2 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  assert.equal(maximalSquare(m2), 3);

  // 全 0
  assert.equal(
    maximalSquare([
      [0, 0],
      [0, 0],
    ]),
    0,
  );
});

test('maximal-square 单行/单列', () => {
  assert.equal(maximalSquare([[1, 1, 0, 1]]), 1);
  assert.equal(maximalSquare([[1], [1], [0], [1]]), 1);
});

test('maximal-square 钩子被调用', () => {
  let fill = 0;
  let doneSide = -1;
  let doneArea = -1;
  maximalSquare(
    [
      [1, 1],
      [1, 1],
    ],
    {
      onFillCell: () => fill++,
      onDone: (s, a) => {
        doneSide = s;
        doneArea = a;
      },
    },
  );
  assert.equal(fill, 4, '应填满 m*n 格');
  assert.equal(doneSide, 2);
  assert.equal(doneArea, 4);
});
