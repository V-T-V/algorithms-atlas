import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cross2D, turn } from '../../src/algorithms/geometry/geo-vector-cross-2d/impl.ts';
test('叉积 单位向量', () => {
  assert.equal(cross2D({ x: 1, y: 0 }, { x: 0, y: 1 }), 1);
});
test('叉积 反向为负', () => {
  assert.equal(cross2D({ x: 0, y: 1 }, { x: 1, y: 0 }), -1);
});
test('turn 左转', () => {
  assert.equal(turn({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }), 'left');
});
test('turn 共线', () => {
  assert.equal(turn({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 'collinear');
});
