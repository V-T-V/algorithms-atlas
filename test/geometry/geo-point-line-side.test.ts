import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pointLineSide,
  cross,
  type Point,
} from '../../src/algorithms/geometry/geo-point-line-side/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('pointLineSide 左/右/上', () => {
  const a = P(0, 0),
    b = P(10, 0);
  assert.equal(pointLineSide(a, b, P(0, 1)), 1); // 上方 = 左侧（有向 A→B 逆时针）
  assert.equal(pointLineSide(a, b, P(0, -1)), -1); // 下方 = 右侧
  assert.equal(pointLineSide(a, b, P(5, 0)), 0); // 线上
  assert.equal(pointLineSide(a, b, P(100, 0)), 0); // 延长线上
});

test('pointLineSide 垂直直线', () => {
  const a = P(0, 0),
    b = P(0, 10);
  assert.equal(pointLineSide(a, b, P(1, 0)), -1); // 右侧
  assert.equal(pointLineSide(a, b, P(-1, 0)), 1); // 左侧
});

test('cross 叉积正确', () => {
  assert.equal(cross(P(0, 0), P(1, 0), P(0, 1)), 1);
  assert.equal(cross(P(0, 0), P(1, 0), P(0, -1)), -1);
  assert.equal(cross(P(0, 0), P(1, 0), P(0.5, 0)), 0);
});

test('pointLineSide 钩子触发', () => {
  let called = false;
  pointLineSide(P(0, 0), P(1, 0), P(0, 1), {
    onCross: () => {
      called = true;
    },
  });
  assert.ok(called);
});
