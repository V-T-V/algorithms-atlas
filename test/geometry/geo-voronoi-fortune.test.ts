import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  voronoi,
  circumcenter,
  type Point,
} from '../../src/algorithms/geometry/geo-voronoi-fortune/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('circumcenter 已知值', () => {
  const c = circumcenter(P(0, 0), P(4, 0), P(2, 3))!;
  assert.ok(c);
  assert.ok(Math.abs(c.x - 2) < 1e-9);
  assert.ok(Math.abs(c.y - 0.8333333) < 1e-6);
});

test('circumcenter 共线返回 null', () => {
  assert.equal(circumcenter(P(0, 0), P(1, 1), P(2, 2)), null);
});

test('voronoi 正方形 4 点产生一个顶点', () => {
  // 正方形四点，外心为正方形中心 (2,2)，唯一空圆
  const sites = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)];
  const v = voronoi(sites);
  assert.equal(v.length, 1);
  assert.ok(Math.abs(v[0]!.center.x - 2) < 1e-9);
  assert.ok(Math.abs(v[0]!.center.y - 2) < 1e-9);
});

test('voronoi 共线点无顶点', () => {
  const sites = [P(0, 0), P(1, 0), P(2, 0), P(3, 0)];
  assert.equal(voronoi(sites).length, 0);
});

test('voronoi 顶点的三个 site 确为最近邻等距', () => {
  const sites = [P(0, 0), P(4, 0), P(2, 4), P(6, 2)];
  const v = voronoi(sites);
  assert.ok(v.length >= 1);
  for (const vert of v) {
    const d0 = Math.hypot(
      sites[vert.sites[0]]!.x - vert.center.x,
      sites[vert.sites[0]]!.y - vert.center.y,
    );
    const d1 = Math.hypot(
      sites[vert.sites[1]]!.x - vert.center.x,
      sites[vert.sites[1]]!.y - vert.center.y,
    );
    const d2 = Math.hypot(
      sites[vert.sites[2]]!.x - vert.center.x,
      sites[vert.sites[2]]!.y - vert.center.y,
    );
    assert.ok(Math.abs(d0 - d1) < 1e-6 && Math.abs(d1 - d2) < 1e-6);
  }
});
