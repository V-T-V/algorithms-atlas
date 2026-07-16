import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanShift, type Point } from '../../src/algorithms/ml/mean-shift/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/mean-shift/trace.ts';

const CLUSTERS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.1 },
  { x: -0.1, y: 0.05 },
  { x: 10, y: 10 },
  { x: 10.2, y: 9.8 },
  { x: 9.9, y: 10.1 },
];

test('mean-shift 识别出两个簇', () => {
  const r = meanShift(CLUSTERS, { bandwidth: 2 });
  assert.equal(r.modes.length, 2);
  const g0 = r.assignments[0]!;
  assert.equal(r.assignments[1], g0);
  assert.equal(r.assignments[2], g0);
  const g1 = r.assignments[3]!;
  assert.notEqual(g1, g0);
});

test('mean-shift 漂移后点向 mode 收敛', () => {
  const r = meanShift(CLUSTERS, { bandwidth: 2 });
  for (let i = 0; i < CLUSTERS.length; i++) {
    const mode = r.modes[r.assignments[i]!]!;
    const shifted = r.shifted[i]!;
    assert.ok(Math.hypot(mode.x - shifted.x, mode.y - shifted.y) < 1);
  }
});

test('mean-shift 收敛', () => {
  const r = meanShift(CLUSTERS, { bandwidth: 2, maxIterations: 50 });
  assert.ok(r.converged);
});

test('mean-shift 簇数随带宽变化', () => {
  const tight = meanShift(CLUSTERS, { bandwidth: 0.5 });
  const wide = meanShift(CLUSTERS, { bandwidth: 50 });
  // 极大带宽 → 全部合并为 1 簇
  assert.equal(wide.modes.length, 1);
  // 小带宽更可能得到更多簇
  assert.ok(tight.modes.length >= 1);
});

test('mean-shift 边界：空数据', () => {
  const r = meanShift([], { bandwidth: 1 });
  assert.deepEqual(r.shifted, []);
  assert.deepEqual(r.modes, []);
});

test('mean-shift 单点收敛到自身', () => {
  const r = meanShift([{ x: 5, y: 5 }], { bandwidth: 1 });
  assert.equal(r.modes.length, 1);
  assert.ok(Math.abs(r.modes[0]!.x - 5) < 1e-6);
});

test('mean-shift 钩子被调用', () => {
  let iters = 0;
  let shifts = 0;
  meanShift(
    CLUSTERS,
    { bandwidth: 2, maxIterations: 10 },
    {
      onIteration: () => iters++,
      onShift: () => shifts++,
    },
  );
  assert.ok(iters >= 1);
  assert.ok(shifts >= CLUSTERS.length);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  const last = frames[frames.length - 1]!;
  const modeNodes = last.graph!.nodes.filter((n) => n.id.startsWith('mode'));
  assert.ok(modeNodes.length >= 1, '末帧应含 mode 节点');
});
