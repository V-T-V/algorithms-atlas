import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convexHullTrick, type Line } from '../../src/algorithms/dp/convex-hull-trick/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/convex-hull-trick/trace.ts';

const brute = (lines: Line[], x: number) => Math.min(...lines.map((l) => l.m * x + l.b));

test('convex-hull-trick 与暴力一致', () => {
  const lines: Line[] = [
    { m: 3, b: 2, j: 0 },
    { m: 2, b: 5, j: 1 },
    { m: 1, b: 3, j: 2 },
    { m: 0, b: 9, j: 3 },
  ];
  const xs = [0, 1, 2, 3, 4, 5];
  const res = convexHullTrick(lines, xs);
  assert.deepEqual(
    res.map((r) => r.val),
    xs.map((x) => brute(lines, x)),
  );
});

test('convex-hull-trick 单条直线', () => {
  const lines: Line[] = [{ m: 2, b: 1, j: 0 }];
  const res = convexHullTrick(lines, [0, 3]);
  assert.deepEqual(
    res.map((r) => r.val),
    [1, 7],
  );
});

test('convex-hull-trick 空查询', () => {
  const lines: Line[] = [{ m: 1, b: 0, j: 0 }];
  const res = convexHullTrick(lines, []);
  assert.equal(res.length, 0);
});

test('convex-hull-trick 钩子被调用', () => {
  let adds = 0;
  let queries = 0;
  convexHullTrick(
    [
      { m: 3, b: 2, j: 0 },
      { m: 1, b: 3, j: 1 },
    ],
    [1, 2],
    {
      onAddLine: () => adds++,
      onQuery: () => queries++,
    },
  );
  assert.equal(adds, 2);
  assert.equal(queries, 2);
});

test('convex-hull-trick buildTrace 产出帧且末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
