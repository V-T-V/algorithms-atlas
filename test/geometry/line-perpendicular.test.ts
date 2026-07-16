import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  perpendicularLine,
  evaluateLine,
} from '../../src/algorithms/geometry/line-perpendicular/impl.ts';

test('perpendicularLine: 法向量 = AB 方向', () => {
  const line = perpendicularLine({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 });
  assert.equal(line.nx, 4);
  assert.equal(line.ny, 0);
  assert.equal(line.px, 2);
  assert.equal(line.py, 3);
});

test('perpendicularLine: P 在垂线上（代入方程 = 0）', () => {
  const line = perpendicularLine({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 });
  assert.equal(evaluateLine(line, 2, 3), 0);
});

test('perpendicularLine: 垂足落在 AB 上', () => {
  let foot: { x: number; y: number } | null = null;
  perpendicularLine(
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 3 },
    {
      onFoot: (h) => (foot = h),
    },
  );
  assert.deepEqual(foot, { x: 2, y: 0 });
});

test('perpendicularLine: 斜线 AB 的垂线方向垂直于 AB', () => {
  // AB 方向 (1,1)，垂线方向应满足 d·(1,1)=0
  const line = perpendicularLine({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 0 });
  // 垂线上的另一点：从 P 沿 (1,-1) 方向走 1 步应在垂线上
  const qx = line.px + 1;
  const qy = line.py - 1;
  assert.ok(Math.abs(evaluateLine(line, qx, qy)) < 1e-9);
});

test('perpendicularLine: 垂足 H 的投影参数 t 正确', () => {
  let foot: { x: number; y: number } | null = null;
  perpendicularLine(
    { x: 0, y: 0 },
    { x: 4, y: 4 },
    { x: 2, y: 0 },
    {
      onFoot: (h) => (foot = h),
    },
  );
  // 投影到 y=x 直线：t = (2*1 + 0*1)/2 = 1 → H = (1,1)
  assert.deepEqual(foot, { x: 1, y: 1 });
});

test('perpendicularLine: hooks 正确回调', () => {
  let lineSeen: unknown = null;
  let footSeen: unknown = null;
  perpendicularLine(
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 5 },
    {
      onPerpLine: (l) => (lineSeen = l),
      onFoot: (h) => (footSeen = h),
    },
  );
  assert.ok(lineSeen !== null);
  assert.ok(footSeen !== null);
});
