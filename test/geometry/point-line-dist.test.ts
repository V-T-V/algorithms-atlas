import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pointLineDist,
  pointSegmentDist,
} from '../../src/algorithms/geometry/point-line-dist/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/point-line-dist/trace.ts';

test('pointLineDist 基本垂直', () => {
  const d = pointLineDist({ a: { x: 0, y: 0 }, b: { x: 5, y: 0 } }, { x: 2, y: 3 }).distance;
  assert.equal(d, 3);
});

test('pointLineDist 点在直线上', () => {
  const d = pointLineDist({ a: { x: 0, y: 0 }, b: { x: 5, y: 0 } }, { x: 2, y: 0 }).distance;
  assert.equal(d, 0);
});

test('pointSegmentDist 投影夹取', () => {
  // 点投影在线段延长线上，应取端点距离
  const d = pointSegmentDist({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 5, y: 0 });
  assert.equal(d, 4);
});

test('pointLineDist 钩子触发', () => {
  let got = -1;
  pointLineDist(
    { a: { x: 0, y: 0 }, b: { x: 4, y: 0 } },
    { x: 1, y: 2 },
    { onResult: (d) => (got = d) },
  );
  assert.equal(got, 2);
});

test('buildTrace 含距离', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
