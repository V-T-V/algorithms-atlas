import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  blockingFlow,
  blockingFlowTracked,
  type BlockGraph,
  type BlockEdge,
} from '../../src/algorithms/network/net-blocking-flow/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-blocking-flow/trace.ts';

const graph: BlockGraph = new Map<number, BlockEdge[]>([
  [
    0,
    [
      { to: 1, cap: 3 },
      { to: 2, cap: 2 },
    ],
  ],
  [
    1,
    [
      { to: 3, cap: 2 },
      { to: 2, cap: 1 },
    ],
  ],
  [2, [{ to: 3, cap: 3 }]],
  [3, [{ to: 4, cap: 4 }]],
  [4, []],
]);

function clone(g: BlockGraph): BlockGraph {
  const c: BlockGraph = new Map();
  for (const [k, v] of g)
    c.set(
      k,
      v.map((a) => ({ ...a })),
    );
  return c;
}

test('net-blocking-flow 推送总流量', () => {
  const total = blockingFlow(clone(graph), 5, 0, 4);
  // 0->1->3->4(2) + 0->2->3->4(2) + 0->1->2->3->4... 受 3->4 容 4 限制，总 4
  assert.equal(total, 4);
});

test('net-blocking-flow 阻塞后无路', () => {
  const g = clone(graph);
  blockingFlow(g, 5, 0, 4);
  // 阻塞后从 0 应无法到 4（3->4 已饱和）
  const sinkOut = g.get(3)!.reduce((s, a) => s + a.cap, 0);
  assert.equal(sinkOut, 0); // 3->4 容量用尽
});

test('net-blocking-flow 跟踪路径', () => {
  const { total, paths } = blockingFlowTracked(clone(graph), 5, 0, 4);
  assert.equal(total, 4);
  assert.ok(paths.length >= 1);
  for (const p of paths) {
    assert.equal(p.path[0], 0);
    assert.equal(p.path[p.path.length - 1], 4);
  }
});

test('net-blocking-flow 直连', () => {
  const g: BlockGraph = new Map([
    [0, [{ to: 1, cap: 5 }]],
    [1, []],
  ]);
  assert.equal(blockingFlow(g, 2, 0, 1), 5);
});

test('net-blocking-flow 不连通返回 0', () => {
  const g: BlockGraph = new Map([
    [0, []],
    [1, []],
  ]);
  assert.equal(blockingFlow(g, 2, 0, 1), 0);
});

test('net-blocking-flow trace', () => {
  assert.ok(buildTrace().length >= 2);
});
