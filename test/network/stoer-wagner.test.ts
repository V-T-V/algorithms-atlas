import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stoerWagner,
  type WeightedEdgeInput,
} from '../../src/algorithms/network/stoer-wagner/impl.ts';

test('stoerWagner 经典示例 = 2', () => {
  const edges: WeightedEdgeInput[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 0, to: 2, weight: 1 },
    { from: 1, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 3 },
    { from: 2, to: 3, weight: 3 },
  ];
  const r = stoerWagner(4, edges);
  assert.equal(r.cutValue, 2);
  // 最小割值为 2 的切法不唯一（{0} 或 {1,2,3}），只校验割值与一侧非空
  assert.ok(r.side.length > 0 && r.side.length < 4, '一侧应是真子集');
  // 校验 side 真的是割值 2：跨边权重之和应等于 cutValue
  const sset = new Set(r.side);
  let cross = 0;
  for (const e of edges) {
    if (sset.has(e.from) !== sset.has(e.to)) cross += e.weight;
  }
  assert.equal(cross, 2);
});

test('stoerWagner 桥图 = 1', () => {
  // 0-1-2 链，最小割是中间边 = 1
  const edges: WeightedEdgeInput[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 1, to: 2, weight: 1 },
  ];
  const r = stoerWagner(3, edges);
  assert.equal(r.cutValue, 1);
});

test('stoerWagner 完全图 K4（每边权 1）= 3', () => {
  const edges: WeightedEdgeInput[] = [
    { from: 0, to: 1, weight: 1 },
    { from: 0, to: 2, weight: 1 },
    { from: 0, to: 3, weight: 1 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 3, weight: 1 },
  ];
  // K4 任取一点割出，跨边 3 条，最小割 = 3
  assert.equal(stoerWagner(4, edges).cutValue, 3);
});

test('stoerWagner 单节点返回 0', () => {
  assert.equal(stoerWagner(1, []).cutValue, 0);
});

test('stoerWagner 两节点', () => {
  const edges: WeightedEdgeInput[] = [{ from: 0, to: 1, weight: 5 }];
  const r = stoerWagner(2, edges);
  assert.equal(r.cutValue, 5);
});

test('stoerWagner 不连通返回 0', () => {
  const edges: WeightedEdgeInput[] = [
    { from: 0, to: 1, weight: 2 },
    // 节点 2 孤立
  ];
  assert.equal(stoerWagner(3, edges).cutValue, 0);
});

test('stoerWagner 钩子被调用', () => {
  let phases = 0;
  let improves = 0;
  let done = -1;
  stoerWagner(
    4,
    [
      { from: 0, to: 1, weight: 1 },
      { from: 0, to: 2, weight: 1 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 3 },
      { from: 2, to: 3, weight: 3 },
    ],
    {
      onPhase: () => phases++,
      onImprove: () => improves++,
      onDone: (c) => (done = c),
    },
  );
  assert.ok(phases > 0);
  assert.ok(improves > 0);
  assert.equal(done, 2);
});
