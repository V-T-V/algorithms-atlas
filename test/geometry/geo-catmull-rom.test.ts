import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  catmullRom,
  catmullRomSegment,
  type Point,
} from '../../src/algorithms/geometry/geo-catmull-rom/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('catmullRomSegment 端点正确', () => {
  const p0 = P(0, 0),
    p1 = P(1, 2),
    p2 = P(3, 2),
    p3 = P(4, 0);
  assert.deepEqual(catmullRomSegment(p0, p1, p2, p3, 0), p1);
  assert.deepEqual(catmullRomSegment(p0, p1, p2, p3, 1), p2);
});

test('catmullRom 过所有控制点', () => {
  const ctrl = [P(0, 0), P(1, 3), P(3, 0), P(4, 3)];
  const curve = catmullRom(ctrl, 10);
  // 起点 = ctrl[0]，终点 = ctrl[last]
  assert.deepEqual(curve[0], ctrl[0]);
  assert.deepEqual(curve[curve.length - 1], ctrl[ctrl.length - 1]);
  // 每段起点应等于对应控制点
  for (let i = 0; i < ctrl.length - 1; i++) {
    assert.deepEqual(curve[i * 10], ctrl[i]);
  }
});

test('catmullRom 共线点 → 直线', () => {
  const ctrl = [P(0, 0), P(1, 0), P(2, 0), P(3, 0)];
  const curve = catmullRom(ctrl, 5);
  for (const p of curve) {
    assert.ok(Math.abs(p.y) < 1e-9);
  }
});

test('catmullRom 拒绝参数', () => {
  assert.throws(() => catmullRom([P(0, 0)], 5), RangeError);
  assert.throws(() => catmullRom([P(0, 0), P(1, 1)], 1), RangeError);
});
