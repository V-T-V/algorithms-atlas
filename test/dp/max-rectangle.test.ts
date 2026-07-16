import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxRectangle } from '../../src/algorithms/dp/max-rectangle/impl.ts';

test('max-rectangle 基本行为', () => {
  assert.equal(maxRectangle([]), 0);
  assert.equal(maxRectangle([[]]), 0);
  assert.equal(maxRectangle([[0]]), 0);
  assert.equal(maxRectangle([[1]]), 1);
});

test('max-rectangle 经典用例', () => {
  // LeetCode 85：最大面积 6（2×3 或 3×2）
  const m1 = [
    ['1', '0', '1', '0', '0'],
    ['1', '0', '1', '1', '1'],
    ['1', '1', '1', '1', '1'],
    ['1', '0', '0', '1', '0'],
  ];
  assert.equal(maxRectangle(m1), 6);

  // 全 1 的 3×4 → 12
  const m2 = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  assert.equal(maxRectangle(m2), 12);

  // 全 0
  assert.equal(
    maxRectangle([
      [0, 0],
      [0, 0],
    ]),
    0,
  );
});

test('max-rectangle 单行/单列', () => {
  assert.equal(maxRectangle([[1, 1, 0, 1, 1, 1]]), 3);
  assert.equal(maxRectangle([[1], [1], [0], [1]]), 2);
});

test('max-rectangle 与最大正方形一致性（边长 k 的全 1 方块面积 k²）', () => {
  // 2×2 全 1
  assert.equal(
    maxRectangle([
      [1, 1],
      [1, 1],
    ]),
    4,
  );
});

test('max-rectangle 钩子被调用', () => {
  let upd = 0;
  let cand = 0;
  let done = -1;
  maxRectangle(
    [
      [1, 0, 1],
      [1, 1, 1],
    ],
    {
      onUpdateHeights: () => upd++,
      onCandidate: () => cand++,
      onDone: (a) => {
        done = a;
      },
    },
  );
  assert.ok(upd >= 2, '应每行更新高度');
  assert.ok(cand > 0, '应产生候选');
  assert.equal(done, 3);
});
