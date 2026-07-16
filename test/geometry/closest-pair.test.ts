import { test } from 'node:test';
import assert from 'node:assert/strict';
import { closestPair, type Point } from '../../src/algorithms/geometry/closest-pair/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/closest-pair/trace.ts';

function d(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

test('closest-pair 基本最近对', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 5, y: 5 },
    { x: 1, y: 1 },
    { x: 10, y: 10 },
  ];
  // 最近对应是 (0,0)-(1,1)，距离 √2
  const { pair, distance } = closestPair(pts);
  assert.ok(distance > 1.414 && distance < 1.415);
  assert.equal(d(pair[0], pair[1]), distance);
});

test('closest-pair 距离正确性（对照暴力）', () => {
  const pts: Point[] = DEFAULT_INPUT;
  const { distance } = closestPair(pts);
  // 暴力求最小
  let brute = Infinity;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      brute = Math.min(brute, d(pts[i]!, pts[j]!));
    }
  }
  assert.equal(distance, brute);
});

test('closest-pair 随机对照暴力', () => {
  // 固定种子可复现
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let trial = 0; trial < 20; trial++) {
    const n = 20;
    const pts: Point[] = Array.from({ length: n }, () => ({ x: rand() * 100, y: rand() * 100 }));
    const { distance } = closestPair(pts);
    let brute = Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        brute = Math.min(brute, d(pts[i]!, pts[j]!));
      }
    }
    assert.ok(Math.abs(distance - brute) < 1e-9, `trial ${trial}: ${distance} vs ${brute}`);
  }
});

test('closest-pair 边界：两点', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 3, y: 4 },
  ];
  const { pair, distance } = closestPair(pts);
  assert.equal(distance, 5);
  assert.equal(d(pair[0], pair[1]), 5);
});

test('closest-pair 边界：共线点', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 10, y: 0 },
  ];
  const { distance } = closestPair(pts);
  assert.equal(distance, 1);
});

test('closest-pair 不修改原数组', () => {
  const pts: Point[] = [
    { x: 3, y: 3 },
    { x: 1, y: 1 },
    { x: 2, y: 5 },
  ];
  const snap = pts.map((p) => ({ ...p }));
  closestPair(pts);
  assert.deepEqual(pts, snap);
});

test('closest-pair 钩子被调用', () => {
  let compares = 0;
  let updates = 0;
  closestPair(
    [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    {
      onCompare: () => compares++,
      onUpdate: () => updates++,
    },
  );
  assert.ok(compares > 0, '应触发比较');
  assert.ok(updates >= 1, '至少更新一次最近对');
});

test('closest-pair 结果两点不同', () => {
  const pts: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const { pair } = closestPair(pts);
  assert.notDeepEqual(pair[0], pair[1]);
});

test('buildTrace 含 graph 与 aux，末帧含最近对', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.graph, '首帧含 graph');
  assert.ok(first.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.graph, '末帧含 graph');
  // 末帧应有一条 final 边
  assert.ok(
    last.graph!.edges.some((e) => e.role === 'final'),
    '末帧应含最近对边',
  );
});
