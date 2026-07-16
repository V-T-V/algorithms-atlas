import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minimumFeedbackArc,
  type GraphInput,
} from '../../src/algorithms/graph/minimum-feedback-arc/impl.ts';

// 验证：删去反馈弧集后是 DAG（无环）
const isDagAfterRemoval = (
  g: GraphInput,
  feedback: Array<{ from: string; to: string }>,
): boolean => {
  const remove = new Set(feedback.map((e) => `${e.from}>${e.to}`));
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    if (remove.has(`${e.from}>${e.to}`)) continue;
    adj.get(e.from)!.push(e.to);
  }
  // 检测环：Kahn 拓扑
  const inDeg = new Map<string, number>();
  for (const n of g.nodes) inDeg.set(n, 0);
  for (const [_u, list] of adj) for (const v of list) inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
  const q: string[] = [];
  for (const [n, d] of inDeg) if (d === 0) q.push(n);
  let cnt = 0;
  while (q.length > 0) {
    const u = q.shift()!;
    cnt++;
    for (const v of adj.get(u) ?? []) {
      inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
      if (inDeg.get(v) === 0) q.push(v);
    }
  }
  return cnt === g.nodes.length;
};

test('fba 三元环至少删 1 条', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '0' },
    ],
  };
  const { feedback } = minimumFeedbackArc(g);
  assert.ok(feedback.length >= 1);
  assert.ok(isDagAfterRemoval(g, feedback));
});

test('fba DAG 无反馈弧', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(minimumFeedbackArc(g).feedback.length, 0);
});

test('fba 两个环至少删 2', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4', '5'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '0' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '3' },
    ],
  };
  const { feedback } = minimumFeedbackArc(g);
  assert.ok(feedback.length >= 2);
  assert.ok(isDagAfterRemoval(g, feedback));
});

test('fba 空图', () => {
  const { feedback, order } = minimumFeedbackArc({ nodes: [], edges: [] });
  assert.equal(feedback.length, 0);
  assert.equal(order.length, 0);
});

test('fba 序长度等于节点数', () => {
  const g: GraphInput = { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }] };
  const { order } = minimumFeedbackArc(g);
  assert.equal(order.length, 3);
});

test('fba 钩子', () => {
  let results = 0;
  minimumFeedbackArc(
    { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }] },
    { onResult: () => results++ },
  );
  assert.equal(results, 1);
});
