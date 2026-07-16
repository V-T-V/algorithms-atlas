import { test } from 'node:test';
import assert from 'node:assert/strict';
import { triangleArea } from '../../src/algorithms/geometry/triangle-area/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/triangle-area/trace.ts';

test('triangle-area 直角三角形', () => {
  const { area, signedArea } = triangleArea([
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 0, y: 4 },
  ]);
  assert.equal(area, 12);
  assert.equal(signedArea, 12); // 逆时针
});

test('triangle-area 顺时针给出负号', () => {
  const { signedArea, area } = triangleArea([
    { x: 0, y: 0 },
    { x: 0, y: 4 },
    { x: 6, y: 0 },
  ]);
  assert.equal(area, 12);
  assert.ok(signedArea < 0);
});

test('triangle-area 共线面积为 0', () => {
  const { area } = triangleArea([
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ]);
  assert.equal(area, 0);
});

test('triangle-area 钩子触发', () => {
  let got = -1;
  triangleArea(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ],
    { onResult: (a) => (got = a) },
  );
  assert.equal(got, 2);
});

test('buildTrace 含面积', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
});
