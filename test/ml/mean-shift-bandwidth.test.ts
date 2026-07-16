import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanShift, type Point } from '../../src/algorithms/ml/mean-shift-bandwidth/impl.ts';

const CLUSTER_A: Point[] = [
  { x: 0, y: 0 },
  { x: 0.3, y: 0 },
  { x: 0, y: 0.3 },
  { x: 0.3, y: 0.3 },
  { x: 0.15, y: 0.15 },
];
const CLUSTER_B: Point[] = [
  { x: 5, y: 5 },
  { x: 5.3, y: 5 },
  { x: 5, y: 5.3 },
  { x: 5.3, y: 5.3 },
  { x: 5.15, y: 5.15 },
];

test('meanShift: 两簇分离数据 → 2 个模式点', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const r = meanShift(points, 1, 100, 1e-4, 0.5);
  assert.equal(r.modes.length, 2);
});

test('meanShift: 同簇点同标签', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const r = meanShift(points, 1, 100, 1e-4, 0.5);
  assert.equal(r.labels[0], r.labels[1]);
  assert.equal(r.labels[0], r.labels[4]);
  assert.notEqual(r.labels[0], r.labels[5]);
});

test('meanShift: 模式点接近簇中心', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const r = meanShift(points, 1, 100, 1e-4, 0.5);
  // 模式点应在簇 A (中心 ≈(0.15,0.15)) 与簇 B (中心 ≈(5.15,5.15)) 附近
  const nearA = r.modes.some((m) => Math.abs(m.x - 0.15) < 0.5 && Math.abs(m.y - 0.15) < 0.5);
  const nearB = r.modes.some((m) => Math.abs(m.x - 5.15) < 0.5 && Math.abs(m.y - 5.15) < 0.5);
  assert.ok(nearA, `应有模式点近 A，模式点：${JSON.stringify(r.modes)}`);
  assert.ok(nearB);
});

test('meanShift: 大带宽 → 更少簇', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const small = meanShift(points, 0.5, 100, 1e-4, 0.2);
  const large = meanShift(points, 5, 100, 1e-4, 1);
  assert.ok(large.modes.length <= small.modes.length);
});

test('meanShift: 单点 → 1 个模式', () => {
  const r = meanShift([{ x: 3, y: 3 }], 1);
  assert.equal(r.modes.length, 1);
});

test('meanShift: 标签数 = 点数', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const r = meanShift(points, 1);
  assert.equal(r.labels.length, points.length);
});

test('meanShift: hooks 正确回调', () => {
  let shifts = 0;
  let done: unknown = null;
  meanShift([...CLUSTER_A, ...CLUSTER_B], 1, 50, 1e-4, 0.5, {
    onShift: () => shifts++,
    onDone: (r) => (done = r),
  });
  assert.ok(shifts >= 0);
  assert.ok(done !== null);
});

test('meanShift: 非法带宽抛错', () => {
  assert.throws(() => meanShift([...CLUSTER_A], 0), RangeError);
  assert.throws(() => meanShift([...CLUSTER_A], -1), RangeError);
});

test('meanShift: 空点集', () => {
  const r = meanShift([], 1);
  assert.deepEqual(r.labels, []);
  assert.deepEqual(r.modes, []);
});
