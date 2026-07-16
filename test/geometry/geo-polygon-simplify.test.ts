import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simplify,
  pointSegDist,
  type Point,
} from '../../src/algorithms/geometry/geo-polygon-simplify/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('simplify 首末点必保留', () => {
  const pts = [P(0, 0), P(2, 0.001), P(8, 0)];
  const r = simplify(pts, 0.1);
  assert.deepEqual(r[0], P(0, 0));
  assert.deepEqual(r[r.length - 1], P(8, 0));
});

test('simplify 大 ε 几乎只留端点', () => {
  const pts = [P(0, 0), P(1, 0.1), P(2, -0.1), P(3, 0.05)];
  const r = simplify(pts, 100);
  assert.equal(r.length, 2);
});

test('simplify 保留显著顶点', () => {
  // 中间点 (4,5) 离基线很远，必须保留
  const pts = [P(0, 0), P(2, 0), P(4, 5), P(6, 0), P(8, 0)];
  const r = simplify(pts, 0.5);
  assert.ok(
    r.some((p) => p.x === 4 && p.y === 5),
    '尖峰点应保留',
  );
});

test('pointSegDist 已知值', () => {
  assert.equal(pointSegDist(P(1, 1), P(0, 0), P(2, 0)), 1); // 到 x 轴上 [0,0]-[2,0] 的距离
  assert.equal(pointSegDist(P(0, 0), P(0, 0), P(2, 0)), 0);
  assert.equal(pointSegDist(P(3, 0), P(0, 0), P(2, 0)), 1); // 投影夹紧到端点
});

test('simplify 至少 2 点原样返回', () => {
  const pts = [P(0, 0), P(1, 1)];
  assert.equal(simplify(pts, 0.1).length, 2);
  assert.equal(simplify([P(0, 0)], 0.1).length, 1);
});
