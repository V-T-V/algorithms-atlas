import { test } from 'node:test';
import assert from 'node:assert/strict';
import { angleSort } from '../../src/algorithms/geometry/angle-sort/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/angle-sort/trace.ts';

test('angleSort 按极角升序', () => {
  // anchor = 最下/最左点 = (0,0)；其余按极角逆时针
  const pts = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
  ];
  const { order } = angleSort(pts);
  assert.deepEqual(order, [1, 2, 3]);
});

test('angleSort 同角按距离', () => {
  // anchor = (0,0)；(1,0) 与 (2,0) 同角，近者在前
  const pts = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 0 },
  ];
  const { order } = angleSort(pts);
  assert.equal(order[0], 2); // (1,0) 距离更近
});

test('angleSort 空集', () => {
  assert.deepEqual(angleSort([]).sorted, []);
});

test('angleSort 钩子触发', () => {
  let anchored = false;
  let sorted = false;
  angleSort(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    undefined,
    {
      onAnchor: () => (anchored = true),
      onSorted: () => (sorted = true),
    },
  );
  assert.ok(anchored && sorted);
});

test('buildTrace 含图帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  assert.ok(frames[0]!.graph);
});
