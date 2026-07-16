import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectorArea, sectorAreaFromArc } from '../../src/algorithms/geometry/sector-area/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('sectorArea: 基本公式 A = ½·r²·θ', () => {
  assert.ok(close(sectorArea(Math.PI / 2, 4), (0.5 * 16 * Math.PI) / 2));
});

test('sectorArea: 整圆 θ=2π → πr²', () => {
  assert.ok(close(sectorArea(2 * Math.PI, 3), Math.PI * 9));
});

test('sectorArea: 零角 → 0', () => {
  assert.ok(close(sectorArea(0, 5), 0));
});

test('sectorArea: 半圆 θ=π → ½πr²', () => {
  assert.ok(close(sectorArea(Math.PI, 2), 0.5 * Math.PI * 4));
});

test('sectorAreaFromArc: A = ½·r·L', () => {
  // r=3, L=3π/2 (90° 弧) → A = ½·3·1.5π = 2.25π
  assert.ok(close(sectorAreaFromArc((3 * Math.PI) / 2, 3), (9 * Math.PI) / 4));
});

test('sectorAreaFromArc: 与角度公式一致', () => {
  const r = 5;
  const theta = 1.2;
  const L = r * theta;
  assert.ok(close(sectorAreaFromArc(L, r), sectorArea(theta, r)));
});

test('sectorArea: hooks 正确回调', () => {
  let got: { t: number; a: number } | null = null;
  sectorArea(1, 2, { onSectorArea: (t, a) => (got = { t, a }) });
  assert.equal(got!.t, 1);
  assert.ok(close(got!.a, 2));
});

test('sectorArea: 非法入参抛错', () => {
  assert.throws(() => sectorArea(1, -1), RangeError);
  assert.throws(() => sectorArea(-1, 1), RangeError);
  assert.throws(() => sectorAreaFromArc(-1, 2), RangeError);
});
