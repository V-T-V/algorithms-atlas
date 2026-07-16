import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  weightedBlossom,
  type WbEdge,
} from '../../src/algorithms/network/weighted-blossom/impl.ts';

test('weighted-blossom 单边返回该边', () => {
  const r = weightedBlossom(2, [{ from: 0, to: 1, weight: 5 }]);
  assert.equal(r.totalWeight, 5);
  assert.equal(r.matching.length, 1);
});

test('weighted-blossom 两条边选权重大的', () => {
  // 0-1(w=3), 0-2(w=10): 0 只能与一个匹配
  const edges: WbEdge[] = [
    { from: 0, to: 1, weight: 3 },
    { from: 0, to: 2, weight: 10 },
  ];
  const r = weightedBlossom(3, edges);
  assert.equal(r.totalWeight, 10);
});

test('weighted-blossom 完全图 K4 最大权匹配 = 2 对', () => {
  // K4: 0-1, 0-2, 0-3, 1-2, 1-3, 2-3
  const edges: WbEdge[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 0, to: 2, weight: 2 },
    { from: 0, to: 3, weight: 3 },
    { from: 1, to: 2, weight: 4 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 6 },
  ];
  const r = weightedBlossom(4, edges);
  assert.equal(r.matching.length, 2);
  // 最大权 = 6 + max(剩余) = 6 + 3 = 9
  assert.equal(r.totalWeight, 9);
});

test('weighted-blossom 路径 P4', () => {
  // 0-1-2-3
  const edges: WbEdge[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 1, to: 2, weight: 10 },
    { from: 2, to: 3, weight: 1 },
  ];
  const r = weightedBlossom(4, edges);
  // 最优：取 1-2 + 0 或 3 单独 → 权 10
  assert.equal(r.totalWeight, 10);
});

test('weighted-blossom 空图返回 0', () => {
  const r = weightedBlossom(3, []);
  assert.equal(r.totalWeight, 0);
  assert.equal(r.matching.length, 0);
});

test('weighted-blossom 钩子被调用', () => {
  let improves = 0;
  let done = false;
  weightedBlossom(
    4,
    [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 },
      { from: 2, to: 3, weight: 3 },
    ],
    {
      onImprove: () => improves++,
      onDone: () => (done = true),
    },
  );
  assert.ok(improves > 0);
  assert.ok(done);
});

test('weighted-blossom 结果是合法匹配', () => {
  const edges: WbEdge[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 1, to: 2, weight: 2 },
    { from: 2, to: 3, weight: 3 },
    { from: 3, to: 4, weight: 4 },
  ];
  const r = weightedBlossom(5, edges);
  const seen = new Set<number>();
  for (const [a, b] of r.matching) {
    assert.ok(!seen.has(a));
    assert.ok(!seen.has(b));
    seen.add(a);
    seen.add(b);
  }
});
