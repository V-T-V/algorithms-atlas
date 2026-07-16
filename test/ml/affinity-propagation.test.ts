import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  affinityPropagation,
  type Point,
} from '../../src/algorithms/ml/affinity-propagation/impl.ts';

// 三个清晰簇
const POINTS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.5, y: 0 },
  { x: 0, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 10, y: 10 },
  { x: 10.5, y: 10 },
  { x: 10, y: 10.5 },
  { x: 10.5, y: 10.5 },
  { x: 20, y: 0 },
  { x: 20.5, y: 0 },
  { x: 20, y: 0.5 },
  { x: 20.5, y: 0.5 },
];

test('affinityPropagation: 标签数 = 点数', () => {
  const r = affinityPropagation(POINTS, undefined, 0.5, 200, 15);
  assert.equal(r.labels.length, POINTS.length);
});

test('affinityPropagation: 代表点数为正且 <= 点数', () => {
  const r = affinityPropagation(POINTS, undefined, 0.5, 200, 15);
  assert.ok(r.exemplars.length >= 1);
  assert.ok(r.exemplars.length <= POINTS.length);
});

test('affinityPropagation: 同簇点同标签', () => {
  const r = affinityPropagation(POINTS, undefined, 0.5, 200, 15);
  // 前 4 个点（簇 A）应同标签
  assert.equal(r.labels[0], r.labels[1]);
  assert.equal(r.labels[0], r.labels[3]);
});

test('affinityPropagation: 高 preference → 更多代表点', () => {
  const low = affinityPropagation(POINTS, -100, 0.5, 200, 10);
  const high = affinityPropagation(POINTS, 0, 0.5, 200, 10);
  // preference 越高（接近 0）代表点越多
  assert.ok(high.exemplars.length >= low.exemplars.length);
});

test('affinityPropagation: 代表点是有效下标', () => {
  const r = affinityPropagation(POINTS, undefined, 0.5, 200, 15);
  for (const ex of r.exemplars) {
    assert.ok(ex >= 0 && ex < POINTS.length);
  }
});

test('affinityPropagation: hooks 正确回调', () => {
  let iters = 0;
  let done: unknown = null;
  affinityPropagation(POINTS, undefined, 0.5, 50, 10, {
    onIteration: () => iters++,
    onDone: (r) => (done = r),
  });
  assert.ok(iters > 0);
  assert.ok(done !== null);
});

test('affinityPropagation: 单点 → 1 个代表点', () => {
  const r = affinityPropagation([{ x: 1, y: 1 }], 0, 0.5, 50, 5);
  assert.equal(r.exemplars.length, 1);
  assert.equal(r.labels[0], 0);
});

test('affinityPropagation: 非法 damping 抛错', () => {
  assert.throws(() => affinityPropagation(POINTS, undefined, 1), RangeError);
  assert.throws(() => affinityPropagation(POINTS, undefined, -0.1), RangeError);
});

test('affinityPropagation: 空点集', () => {
  const r = affinityPropagation([], undefined, 0.5);
  assert.deepEqual(r.labels, []);
  assert.deepEqual(r.exemplars, []);
});
