import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleTangent } from '../../src/algorithms/geometry/circle-tangent/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('circleTangent: 切点在圆上（|CP| = r）', () => {
  const res = circleTangent({ x: 0, y: 0 }, 2, { x: 4, y: 0 });
  assert.equal(res.tangentPoints.length, 2);
  for (const p of res.tangentPoints) {
    const d = Math.hypot(p.x, p.y);
    assert.ok(close(d, 2), `切点距圆心应=r，实际 ${d}`);
  }
});

test('circleTangent: 切线 ⊥ 半径（TP · CP = 0）', () => {
  const c = { x: 0, y: 0 };
  const r = 2;
  const t = { x: 4, y: 0 };
  const res = circleTangent(c, r, t);
  for (const p of res.tangentPoints) {
    const tx = t.x - p.x;
    const ty = t.y - p.y;
    const rx = p.x - c.x;
    const ry = p.y - c.y;
    const dot = tx * rx + ty * ry;
    assert.ok(close(dot, 0), `切线应⊥半径，点积=${dot}`);
  }
});

test('circleTangent: 轴上对称切点', () => {
  // T=(4,0), 圆心原点 r=2 → 切点关于 x 轴对称
  const res = circleTangent({ x: 0, y: 0 }, 2, { x: 4, y: 0 });
  const [p1, p2] = res.tangentPoints;
  assert.ok(close(p1!.x, p2!.x));
  assert.ok(close(p1!.y, -p2!.y));
});

test('circleTangent: 切线长度公式 √(d² − r²)', () => {
  const c = { x: 0, y: 0 };
  const r = 3;
  const t = { x: 5, y: 0 };
  const res = circleTangent(c, r, t);
  const d = Math.hypot(t.x - c.x, t.y - c.y);
  const expected = Math.sqrt(d * d - r * r);
  assert.ok(close(res.tangentLength, expected));
  // 切线长度也等于 |TP|
  for (const p of res.tangentPoints) {
    assert.ok(close(Math.hypot(t.x - p.x, t.y - p.y), expected));
  }
});

test('circleTangent: T 在圆内 → 无切点', () => {
  const res = circleTangent({ x: 0, y: 0 }, 5, { x: 1, y: 1 });
  assert.equal(res.tangentPoints.length, 0);
  assert.equal(res.tangentLength, 0);
});

test('circleTangent: T 在圆上 → 单切点退化（这里 d=r 视作无两条切线）', () => {
  const res = circleTangent({ x: 0, y: 0 }, 2, { x: 2, y: 0 });
  // d = r，acos(r/d)=acos(1)=0，两点重合；按本实现 d<=r 返回空
  assert.equal(res.tangentPoints.length, 0);
});

test('circleTangent: hooks 正确回调', () => {
  let bearing: number | null = null;
  let angle: number | null = null;
  let pts: unknown = null;
  circleTangent(
    { x: 0, y: 0 },
    2,
    { x: 4, y: 4 },
    {
      onBearing: (a) => (bearing = a),
      onAngle: (p) => (angle = p),
      onTangentPoints: (p) => (pts = p),
    },
  );
  assert.ok(bearing !== null);
  assert.ok(angle !== null);
  assert.ok(pts !== null);
});

test('circleTangent: 半径非法抛错', () => {
  assert.throws(() => circleTangent({ x: 0, y: 0 }, 0, { x: 5, y: 5 }), RangeError);
  assert.throws(() => circleTangent({ x: 0, y: 0 }, -1, { x: 5, y: 5 }), RangeError);
});
