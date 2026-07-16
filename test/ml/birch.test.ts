import { test } from 'node:test';
import assert from 'node:assert/strict';
import { birch, type Point } from '../../src/algorithms/ml/birch/impl.ts';

const CLUSTER_A: Point[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0 },
  { x: 0, y: 0.1 },
  { x: 0.1, y: 0.1 },
  { x: 0.05, y: 0.05 },
];
const CLUSTER_B: Point[] = [
  { x: 5, y: 5 },
  { x: 5.1, y: 5 },
  { x: 5, y: 5.1 },
  { x: 5.1, y: 5.1 },
  { x: 5.05, y: 5.05 },
];

test('birch: 紧簇 + 大阈值 → 单个叶条目', () => {
  const r = birch(CLUSTER_A, 1);
  assert.equal(r.entries.length, 1);
  assert.equal(r.entries[0]!.cf.n, 5);
});

test('birch: 两簇分离 → 至少 2 个叶条目', () => {
  const r = birch([...CLUSTER_A, ...CLUSTER_B], 0.2);
  assert.ok(r.entries.length >= 2, `expected >=2 entries, got ${r.entries.length}`);
});

test('birch: 阈值越小 → 叶条目越多', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const smallT = birch(points, 0.05);
  const largeT = birch(points, 0.5);
  assert.ok(smallT.entries.length >= largeT.entries.length);
});

test('birch: CF 可推导质心', () => {
  const r = birch(CLUSTER_A, 1);
  const e = r.entries[0]!;
  assert.ok(Math.abs(e.centroid.x - 0.05) < 1e-9);
  assert.ok(Math.abs(e.centroid.y - 0.05) < 1e-9);
});

test('birch: 标签覆盖所有点', () => {
  const r = birch([...CLUSTER_A, ...CLUSTER_B], 0.2);
  assert.equal(r.labels.length, 10);
  for (const l of r.labels) assert.ok(l >= 0);
});

test('birch: 同簇点尽量同标签', () => {
  const r = birch([...CLUSTER_A, ...CLUSTER_B], 0.2);
  // 簇 A 的前几个点应在同一或相邻条目（紧簇内）
  assert.equal(r.labels[0], r.labels[1]);
  // 簇 A 与簇 B 标签不同
  assert.notEqual(r.labels[0], r.labels[5]);
});

test('birch: members 与 CF.n 一致', () => {
  const r = birch([...CLUSTER_A, ...CLUSTER_B], 0.2);
  for (const e of r.entries) assert.equal(e.members.length, e.cf.n);
});

test('birch: hooks 正确回调', () => {
  let inserts = 0;
  let creates = 0;
  let done: unknown = null;
  birch([...CLUSTER_A, ...CLUSTER_B], 0.2, {
    onInsert: () => inserts++,
    onCreateEntry: () => creates++,
    onDone: (r) => (done = r),
  });
  assert.equal(inserts, 10);
  assert.ok(creates >= 1);
  assert.ok(done !== null);
});

test('birch: 非法阈值抛错', () => {
  assert.throws(() => birch([...CLUSTER_A], -1), RangeError);
});

test('birch: 空点集', () => {
  assert.deepEqual(birch([], 1), { entries: [], labels: [] });
});
