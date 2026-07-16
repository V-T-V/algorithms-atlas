import { test } from 'node:test';
import assert from 'node:assert/strict';
import { manhattan, euclidean } from '../../src/algorithms/geometry/manhattan/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/manhattan/trace.ts';

test('manhattan 基本', () => {
  assert.equal(manhattan({ x: 0, y: 0 }, { x: 3, y: 4 }).distance, 7);
  assert.equal(manhattan({ x: 1, y: 1 }, { x: 1, y: 1 }).distance, 0);
});

test('manhattan 非负且 ≥ 欧氏', () => {
  const d = manhattan({ x: -2, y: 5 }, { x: 4, y: -3 }).distance;
  assert.ok(d >= 0);
  assert.ok(d >= euclidean({ x: -2, y: 5 }, { x: 4, y: -3 }));
});

test('manhattan 钩子触发', () => {
  const axes: string[] = [];
  manhattan({ x: 0, y: 0 }, { x: 2, y: 3 }, { onAxis: (a) => axes.push(a) });
  assert.deepEqual(axes, ['x', 'y']);
});

test('buildTrace 含距离', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
});
