import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bezierDeCasteljau,
  cubicBezierBernstein,
  type Point,
} from '../../src/algorithms/geometry/geo-bezier-curve-2/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('bezier 端点 = 首末控制点', () => {
  const ctrl = [P(0, 0), P(1, 2), P(3, 2), P(4, 0)];
  assert.deepEqual(bezierDeCasteljau(ctrl, 0), P(0, 0));
  assert.deepEqual(bezierDeCasteljau(ctrl, 1), P(4, 0));
});

test('bezier 与伯恩斯坦多项式一致（三次）', () => {
  const p0 = P(0, 0),
    p1 = P(1, 3),
    p2 = P(5, 3),
    p3 = P(7, 0);
  const ctrl = [p0, p1, p2, p3];
  for (const t of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
    const a = bezierDeCasteljau(ctrl, t);
    const b = cubicBezierBernstein(p0, p1, p2, p3, t);
    assert.ok(Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9);
  }
});

test('bezier 二次（3 控制点）', () => {
  // 二次：B(0.5) 应为 0.25*P0 + 0.5*P1 + 0.25*P2
  const ctrl = [P(0, 0), P(2, 4), P(4, 0)];
  const b = bezierDeCasteljau(ctrl, 0.5);
  assert.ok(Math.abs(b.x - 2) < 1e-9 && Math.abs(b.y - 2) < 1e-9);
});

test('bezier 拒绝控制点不足', () => {
  assert.throws(() => bezierDeCasteljau([P(0, 0)], 0.5), RangeError);
});
