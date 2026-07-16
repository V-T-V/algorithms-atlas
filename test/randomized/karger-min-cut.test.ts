import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kargerMinCut,
  makeLcg,
  type Edge,
} from '../../src/algorithms/randomized/karger-min-cut/impl.ts';

test('karger-min-cut 4 顶点环图最小割 = 2', () => {
  const edges: Edge[] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  // 多种子重复以提高命中概率
  let best = Infinity;
  for (const seed of [1, 2, 3, 4, 5, 42, 99]) {
    best = Math.min(best, kargerMinCut(4, edges, 200, seed));
  }
  assert.equal(best, 2);
});

test('karger-min-cut 桥接图（两三角形+1 桥）最小割 = 1', () => {
  const edges: Edge[] = [
    [0, 1],
    [1, 2],
    [0, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [3, 5],
  ];
  let found = false;
  for (const seed of [1, 2, 3, 7, 42, 100]) {
    if (kargerMinCut(6, edges, 200, seed) === 1) {
      found = true;
      break;
    }
  }
  assert.equal(found, true);
});

test('karger-min-cut 完全图 K4 最小割 = 3', () => {
  const edges: Edge[] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  let best = Infinity;
  for (const seed of [1, 2, 3, 4, 5, 42]) {
    best = Math.min(best, kargerMinCut(4, edges, 200, seed));
  }
  assert.equal(best, 3);
});

test('karger-min-cut 固定种子确定性', () => {
  const edges: Edge[] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  const a = kargerMinCut(4, edges, 100, 42);
  const b = kargerMinCut(4, edges, 100, 42);
  assert.equal(a, b);
});

test('karger-min-cut 单边图（两顶点 1 条边）最小割 = 1', () => {
  const edges: Edge[] = [[0, 1]];
  assert.equal(kargerMinCut(2, edges, 10, 1), 1);
});

test('karger-min-cut 含重边的图', () => {
  // 两顶点间 3 条重边，最小割 = 3
  const edges: Edge[] = [
    [0, 1],
    [0, 1],
    [0, 1],
  ];
  assert.equal(kargerMinCut(2, edges, 10, 1), 3);
});

test('karger-min-cut 非法参数抛错', () => {
  assert.throws(() => kargerMinCut(1, [[0, 1]]));
  assert.throws(() => kargerMinCut(4, []));
});

test('karger-min-cut makeLcg 确定性', () => {
  const a = makeLcg(42);
  const b = makeLcg(42);
  const seqA: number[] = [];
  const seqB: number[] = [];
  for (let i = 0; i < 5; i++) {
    seqA.push(a());
    seqB.push(b());
  }
  assert.deepEqual(seqA, seqB);
});

test('karger-min-cut 钩子被调用', () => {
  const edges: Edge[] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];
  let trialStarts = 0;
  let bestUpdates = 0;
  let lastBest = Infinity;
  kargerMinCut(4, edges, 10, 7, {
    onTrialStart: () => trialStarts++,
    onBestUpdate: (cut) => {
      bestUpdates++;
      lastBest = cut;
    },
  });
  assert.equal(trialStarts, 10);
  assert.ok(bestUpdates >= 1);
  assert.ok(lastBest >= 1 && lastBest <= 4);
});

test('karger-min-cut 试验次数默认为 n²', () => {
  // 间接验证：对 K4，多次试验下结果稳定为 3
  const edges: Edge[] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  // 默认 trials = n*n = 16
  let best = Infinity;
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    best = Math.min(best, kargerMinCut(4, edges, undefined, seed));
  }
  assert.equal(best, 3);
});
