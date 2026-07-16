import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bezierPoint, bezierCurve } from '../../src/algorithms/geometry/bezier/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;
const ptEq = (p: { x: number; y: number }, q: { x: number; y: number }, eps = 1e-9): boolean =>
  close(p.x, q.x, eps) && close(p.y, q.y, eps);

test('bezierPoint: 线性（2 点）= 线性插值', () => {
  const r = bezierPoint(
    [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
    0.5,
  );
  assert.ok(ptEq(r, { x: 5, y: 0 }));
});

test('bezierPoint: t=0 → 第一个控制点', () => {
  const r = bezierPoint(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ],
    0,
  );
  assert.ok(ptEq(r, { x: 0, y: 0 }));
});

test('bezierPoint: t=1 → 最后一个控制点', () => {
  const r = bezierPoint(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ],
    1,
  );
  assert.ok(ptEq(r, { x: 2, y: 0 }));
});

test('bezierPoint: 二次贝塞尔显式公式一致', () => {
  // B(t) = (1-t)²P0 + 2(1-t)t P1 + t²P2
  const P0 = { x: 0, y: 0 };
  const P1 = { x: 1, y: 2 };
  const P2 = { x: 3, y: 0 };
  for (const t of [0, 0.25, 0.5, 0.75, 1]) {
    const expected = {
      x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
      y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
    };
    const got = bezierPoint([P0, P1, P2], t);
    assert.ok(ptEq(got, expected, 1e-6), `t=${t} mismatch`);
  }
});

test('bezierPoint: 三次贝塞尔显式公式一致', () => {
  const P = [
    { x: 0, y: 0 },
    { x: 1, y: 3 },
    { x: 4, y: 3 },
    { x: 5, y: 0 },
  ];
  for (const t of [0, 0.3, 0.6, 1]) {
    const u = 1 - t;
    const expected = {
      x: u ** 3 * P[0]!.x + 3 * u ** 2 * t * P[1]!.x + 3 * u * t ** 2 * P[2]!.x + t ** 3 * P[3]!.x,
      y: u ** 3 * P[0]!.y + 3 * u ** 2 * t * P[1]!.y + 3 * u * t ** 2 * P[2]!.y + t ** 3 * P[3]!.y,
    };
    const got = bezierPoint(P, t);
    assert.ok(ptEq(got, expected, 1e-6), `t=${t} mismatch`);
  }
});

test('bezierCurve: 端点正确', () => {
  const pts = bezierCurve(
    [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ],
    10,
  );
  assert.ok(ptEq(pts[0]!, { x: 0, y: 0 }));
  assert.ok(ptEq(pts[pts.length - 1]!, { x: 5, y: 5 }));
  assert.equal(pts.length, 11);
});

test('bezierPoint: hooks 正确回调', () => {
  const layers: number[] = [];
  let finalPt: { x: number; y: number } | null = null;
  bezierPoint(
    [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 0 },
    ],
    0.5,
    {
      onLayer: (l) => layers.push(l),
      onPoint: (t, p) => (finalPt = p),
    },
  );
  // 3 控制点 → 2 层：0(初始3点),1(2点),2(1点)
  assert.deepEqual(layers, [0, 1, 2]);
  assert.ok(finalPt !== null);
});

test('bezierPoint: 非法入参抛错', () => {
  assert.throws(() => bezierPoint([], 0.5), RangeError);
  assert.throws(() => bezierPoint([{ x: 0, y: 0 }], -0.1), RangeError);
  assert.throws(() => bezierPoint([{ x: 0, y: 0 }], 1.5), RangeError);
});
