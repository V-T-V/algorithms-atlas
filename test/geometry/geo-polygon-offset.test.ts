import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  polygonOffset,
  type Point,
} from '../../src/algorithms/geometry/geo-polygon-offset/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });
// 顶点 (0,0),(4,0),(4,4),(0,4) 在数学坐标系下为 CCW（有向面积 +8>0）。
// 法向 (-dy,dx) 是数学 CCW 多边形的内侧法向，故 d>0 向内收缩。

test('polygonOffset 正方向（CCW）d=1 向内收缩', () => {
  const sq = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)];
  const r = polygonOffset(sq, 1);
  assert.deepEqual(r, [P(1, 1), P(3, 1), P(3, 3), P(1, 3)]);
});

test('polygonOffset d=-1 向外扩张', () => {
  const sq = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)];
  const r = polygonOffset(sq, -1);
  assert.deepEqual(r, [P(-1, -1), P(5, -1), P(5, 5), P(-1, 5)]);
});

test('polygonOffset d=0 原样返回', () => {
  const sq = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)];
  const r = polygonOffset(sq, 0);
  assert.deepEqual(r, sq);
});

test('polygonOffset 大幅收缩产生交叉（仍返回数值结果）', () => {
  const sq = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)];
  // d=3 接近半边长，结果会自交但不抛错
  const r = polygonOffset(sq, 3);
  assert.equal(r.length, 4);
});

test('polygonOffset 拒绝顶点不足', () => {
  assert.throws(() => polygonOffset([P(0, 0), P(1, 1)], 1), RangeError);
});
