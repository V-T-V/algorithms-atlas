import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boundingBox,
  pointInBBox,
  bboxIntersect,
} from '../../src/algorithms/geometry/bounding-box/impl.ts';

test('boundingBox: 基本用例', () => {
  const s = boundingBox([
    { x: 1, y: 2 },
    { x: 3, y: 5 },
    { x: 6, y: 1 },
    { x: 4, y: 7 },
  ]);
  assert.deepEqual(s.bbox, { minX: 1, minY: 1, maxX: 6, maxY: 7 });
  assert.equal(s.width, 5);
  assert.equal(s.height, 6);
  assert.equal(s.area, 30);
  assert.equal(s.perimeter, 22);
});

test('boundingBox: 单点 → 零面积', () => {
  const s = boundingBox([{ x: 3, y: 4 }]);
  assert.equal(s.width, 0);
  assert.equal(s.height, 0);
  assert.equal(s.area, 0);
  assert.deepEqual(s.center, { x: 3, y: 4 });
});

test('boundingBox: 中心 = (min+max)/2', () => {
  const s = boundingBox([
    { x: 0, y: 0 },
    { x: 10, y: 6 },
  ]);
  assert.deepEqual(s.center, { x: 5, y: 3 });
});

test('boundingBox: 共线点', () => {
  const s = boundingBox([
    { x: 0, y: 5 },
    { x: 2, y: 5 },
    { x: 4, y: 5 },
  ]);
  assert.equal(s.height, 0);
  assert.equal(s.width, 4);
});

test('boundingBox: hooks 正确回调', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 5, y: 5 },
    { x: 2, y: 8 },
  ];
  const visited: number[] = [];
  let done: unknown = null;
  boundingBox(points, {
    onPoint: (i) => visited.push(i),
    onDone: (s) => (done = s),
  });
  assert.deepEqual(visited, [0, 1, 2]);
  assert.ok(done !== null);
});

test('boundingBox: 空点集抛错', () => {
  assert.throws(() => boundingBox([]), RangeError);
});

test('pointInBBox: 含边界', () => {
  const b = { minX: 0, minY: 0, maxX: 4, maxY: 4 };
  assert.equal(pointInBBox(b, { x: 2, y: 2 }), true);
  assert.equal(pointInBBox(b, { x: 0, y: 0 }), true);
  assert.equal(pointInBBox(b, { x: 4, y: 4 }), true);
  assert.equal(pointInBBox(b, { x: 5, y: 2 }), false);
  assert.equal(pointInBBox(b, { x: 2, y: -1 }), false);
});

test('bboxIntersect: 相交判定', () => {
  const a = { minX: 0, minY: 0, maxX: 4, maxY: 4 };
  assert.equal(bboxIntersect(a, { minX: 2, minY: 2, maxX: 6, maxY: 6 }), true);
  assert.equal(bboxIntersect(a, { minX: 5, minY: 5, maxX: 6, maxY: 6 }), false);
  assert.equal(bboxIntersect(a, { minX: 0, minY: 0, maxX: 4, maxY: 4 }), true); // 自身
  assert.equal(bboxIntersect(a, { minX: 4, minY: 0, maxX: 6, maxY: 4 }), true); // 边接触
});
