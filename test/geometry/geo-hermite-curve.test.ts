import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hermite,
  sampleHermite,
  type Point,
} from '../../src/algorithms/geometry/geo-hermite-curve/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('hermite 端点正确', () => {
  const p0 = P(0, 0),
    p1 = P(4, 0),
    m0 = P(5, 0),
    m1 = P(0, -5);
  assert.deepEqual(hermite(p0, p1, m0, m1, 0), P(0, 0));
  assert.deepEqual(hermite(p0, p1, m0, m1, 1), P(4, 0));
});

test('hermite 端点切向正确', () => {
  // H\'(t) 导数在 t=0 应等于 m0
  const p0 = P(0, 0),
    p1 = P(4, 0),
    m0 = P(3, 3),
    m1 = P(1, -2);
  const h = 1e-6;
  const d0x = (hermite(p0, p1, m0, m1, h).x - hermite(p0, p1, m0, m1, 0).x) / h;
  const d0y = (hermite(p0, p1, m0, m1, h).y - hermite(p0, p1, m0, m1, 0).y) / h;
  assert.ok(Math.abs(d0x - m0.x) < 1e-4 && Math.abs(d0y - m0.y) < 1e-4);
});

test('sampleHermite 采样数', () => {
  const out = sampleHermite(P(0, 0), P(4, 0), P(1, 1), P(1, -1), 10);
  assert.equal(out.length, 10);
  assert.deepEqual(out[0], P(0, 0));
  assert.deepEqual(out[9], P(4, 0));
});

test('sampleHermite 拒绝采样数 < 2', () => {
  assert.throws(() => sampleHermite(P(0, 0), P(1, 1), P(0, 0), P(0, 0), 1), RangeError);
});
