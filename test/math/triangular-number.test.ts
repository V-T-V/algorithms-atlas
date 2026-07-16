import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  triangular,
  triangularSequence,
  isTriangular,
} from '../../src/algorithms/math/triangular-number/impl.ts';

test('triangular 公式', () => {
  assert.equal(triangular(1), 1);
  assert.equal(triangular(2), 3);
  assert.equal(triangular(3), 6);
  assert.equal(triangular(4), 10);
  assert.equal(triangular(5), 15);
  assert.equal(triangular(10), 55);
});

test('triangular 序列', () => {
  assert.deepEqual(triangularSequence(6), [1, 3, 6, 10, 15, 21]);
});

test('triangular 判定是', () => {
  assert.equal(isTriangular(6).isTriangular, true);
  assert.equal(isTriangular(6).rank, 3);
  assert.equal(isTriangular(10).isTriangular, true);
  assert.equal(isTriangular(55).rank, 10);
});

test('triangular 判定否', () => {
  assert.equal(isTriangular(5).isTriangular, false);
  assert.equal(isTriangular(7).isTriangular, false);
  assert.equal(isTriangular(100).isTriangular, false); // 100 非三角数
});

test('triangular 边界', () => {
  assert.equal(isTriangular(0).isTriangular, false);
  assert.equal(isTriangular(1).isTriangular, true);
  assert.equal(isTriangular(1).rank, 1);
});

test('triangular 钩子被调用', () => {
  const seq: number[] = [];
  triangularSequence(5, { onTerm: (_i, v) => seq.push(v) });
  assert.deepEqual(seq, [1, 3, 6, 10, 15]);
});
