import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bspline,
  bsplineSegment,
  type Point,
} from '../../src/algorithms/geometry/geo-bspline/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('bsplineSegment 基函数和为 1', () => {
  // 对任意四点、任意 t，基函数和为 1，故结果点是控制点的凸组合（在包围盒内）
  const p0 = P(0, 0),
    p1 = P(1, 1),
    p2 = P(2, 1),
    p3 = P(3, 0);
  const t = 0.37;
  const t2 = t * t,
    t3 = t2 * t;
  const sum =
    (-t3 + 3 * t2 - 3 * t + 1) / 6 +
    (3 * t3 - 6 * t2 + 4) / 6 +
    (-3 * t3 + 3 * t2 + 3 * t + 1) / 6 +
    t3 / 6;
  assert.ok(Math.abs(sum - 1) < 1e-12);
  // 用这四点调用 bsplineSegment，结果应落在 x∈[0,3]、y∈[0,1] 的包围盒内
  const seg = bsplineSegment(p0, p1, p2, p3, t);
  assert.ok(seg.x >= 0 && seg.x <= 3);
  assert.ok(seg.y >= 0 && seg.y <= 1);
  // 同点时结果应等于该点
  const same = bsplineSegment(P(2, 2), P(2, 2), P(2, 2), P(2, 2), t);
  assert.deepEqual(same, P(2, 2));
});

test('bspline 采样点数', () => {
  const ctrl = [P(0, 0), P(1, 2), P(3, 3), P(5, 1), P(6, 3)];
  const out = bspline(ctrl, 8);
  // 段数 = ext.length - 3 = (5+2) - 3 = 4；每段 8 采样 → 32
  assert.equal(out.length, 4 * 8);
});

test('bspline 曲线不经过中间控制点（一般情形）', () => {
  const ctrl = [P(0, 0), P(2, 5), P(4, 0), P(6, 5), P(8, 0)];
  const out = bspline(ctrl, 8);
  // 控制点 (2,5) 不应在曲线上（B 样条近似性质）
  assert.ok(!out.some((p) => Math.abs(p.x - 2) < 1e-9 && Math.abs(p.y - 5) < 1e-9));
});

test('bspline 拒绝参数', () => {
  assert.throws(() => bspline([P(0, 0), P(1, 1)], 5), RangeError);
  assert.throws(() => bspline([P(0, 0), P(1, 1), P(2, 2), P(3, 3)], 1), RangeError);
});
