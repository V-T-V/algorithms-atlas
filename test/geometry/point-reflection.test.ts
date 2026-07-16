import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reflectPoint,
  reflectPoints,
} from '../../src/algorithms/geometry/point-reflection/impl.ts';

test('reflectPoint: 基本用例 (4,5) 关于 (2,2) → (0,-1)', () => {
  assert.deepEqual(reflectPoint({ x: 4, y: 5 }, { x: 2, y: 2 }), { x: 0, y: -1 });
});

test('reflectPoint: 关于原点 = 取相反数', () => {
  assert.deepEqual(reflectPoint({ x: 3, y: -7 }, { x: 0, y: 0 }), { x: -3, y: 7 });
});

test('reflectPoint: 关于自身 = 自身', () => {
  assert.deepEqual(reflectPoint({ x: 5, y: 5 }, { x: 5, y: 5 }), { x: 5, y: 5 });
});

test('reflectPoint: 自反性（反射两次还原）', () => {
  const p = { x: 3.5, y: -2.5 };
  const c = { x: 1, y: 1 };
  const once = reflectPoint(p, c);
  const twice = reflectPoint(once, c);
  assert.deepEqual(twice, p);
});

test("reflectPoint: C 是 PP' 中点", () => {
  const p = { x: 4, y: 5 };
  const c = { x: 2, y: 2 };
  const r = reflectPoint(p, c);
  const mid = { x: (p.x + r.x) / 2, y: (p.y + r.y) / 2 };
  assert.equal(mid.x, c.x);
  assert.equal(mid.y, c.y);
});

test('reflectPoints: 批量反射', () => {
  const pts = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 2, y: 2 },
  ];
  const c = { x: 0, y: 0 };
  assert.deepEqual(reflectPoints(pts, c), [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: -2, y: -2 },
  ]);
});

test('reflectPoint: hooks 正确回调', () => {
  let got: { p: unknown; c: unknown; r: unknown } | null = null;
  reflectPoint(
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    {
      onReflect: (p, c, r) => (got = { p, c, r }),
    },
  );
  assert.deepEqual(got!.r, { x: -1, y: -1 });
});
