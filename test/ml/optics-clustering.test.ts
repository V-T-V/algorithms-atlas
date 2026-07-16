import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optics,
  extractDBSCAN,
  type Point,
} from '../../src/algorithms/ml/optics-clustering/impl.ts';

// 两个清晰簇 + 一个离群点
const POINTS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.2, y: 0 },
  { x: 0, y: 0.2 },
  { x: 0.2, y: 0.2 },
  { x: 5, y: 5 },
  { x: 5.2, y: 5 },
  { x: 5, y: 5.2 },
  { x: 5.2, y: 5.2 },
  { x: 20, y: 20 },
];

test('optics: 排序包含所有点且不重复', () => {
  const r = optics(POINTS, 1.5, 3);
  assert.equal(r.order.length, POINTS.length);
  const seen = new Set<number>();
  for (const e of r.order) {
    assert.ok(!seen.has(e.index), `点 ${e.index} 重复`);
    seen.add(e.index);
  }
  assert.equal(seen.size, POINTS.length);
});

test('optics: 起点的可达距离为 ∞', () => {
  const r = optics(POINTS, 1.5, 3);
  assert.equal(r.order[0]!.reachability, Infinity);
});

test('optics: 同簇点在排序中相邻', () => {
  const r = optics(POINTS, 1.5, 3);
  const idxs = r.order.map((e) => e.index);
  // 第一簇（0..3）应连续出现
  const firstClusterPositions = idxs.map((idx, pos) => (idx <= 3 ? pos : -1)).filter((p) => p >= 0);
  const max = Math.max(...firstClusterPositions);
  const min = Math.min(...firstClusterPositions);
  assert.equal(max - min, 3); // 4 个点连续
});

test('optics: 核心点有有限核心距离，离群点为 ∞', () => {
  const r = optics(POINTS, 1.5, 3);
  // 簇内点（如 0）核心距离有限
  assert.ok(Number.isFinite(r.coreDistances[0]!));
  // 离群点 8 核心距离为 ∞
  assert.equal(r.coreDistances[8], Infinity);
});

test('optics: hooks 正确回调', () => {
  const processed: number[] = [];
  let done: unknown = null;
  optics(POINTS, 1.5, 3, {
    onProcess: (i) => processed.push(i),
    onDone: (r) => (done = r),
  });
  assert.equal(processed.length, POINTS.length);
  assert.ok(done !== null);
});

test('optics: 非法入参抛错', () => {
  assert.throws(() => optics(POINTS, 0, 3), RangeError);
  assert.throws(() => optics(POINTS, 1.5, 0), RangeError);
});

test('optics: 空点集', () => {
  assert.deepEqual(optics([], 1, 3), { order: [], coreDistances: [] });
});

test('extractDBSCAN: 两簇被识别，离群点为噪声', () => {
  const r = optics(POINTS, 1.5, 3);
  const labels = extractDBSCAN(r.order, 0.5);
  assert.equal(labels.length, POINTS.length);
  // 簇内点（原 0..3 与 4..7）应有非 -1 标签，离群 8 应为 -1
  // labels 是按 order 顺序；用 order.index 映射回原下标
  const origLabels = new Array(POINTS.length).fill(-1);
  r.order.forEach((e, i) => {
    origLabels[e.index] = labels[i]!;
  });
  assert.notEqual(origLabels[0], origLabels[4]); // 两簇不同
  assert.equal(origLabels[0], origLabels[3]); // 同簇同标签
  assert.equal(origLabels[8], -1); // 离群为噪声
});
