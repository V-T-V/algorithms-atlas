import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  relabelToFront,
  type RtfEdgeInput,
} from '../../src/algorithms/network/relabel-to-front/impl.ts';

test('relabel-to-front 经典图最大流 = 18', () => {
  const edges: RtfEdgeInput[] = [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ];
  assert.equal(relabelToFront(5, edges, 0, 4), 18);
});

test('relabel-to-front CLRS 经典示例 = 23', () => {
  const edges: RtfEdgeInput[] = [
    { from: 0, to: 1, cap: 16 },
    { from: 0, to: 2, cap: 13 },
    { from: 1, to: 3, cap: 12 },
    { from: 2, to: 1, cap: 4 },
    { from: 2, to: 4, cap: 14 },
    { from: 3, to: 2, cap: 9 },
    { from: 3, to: 5, cap: 20 },
    { from: 4, to: 3, cap: 7 },
    { from: 4, to: 5, cap: 4 },
  ];
  assert.equal(relabelToFront(6, edges, 0, 5), 23);
});

test('relabel-to-front 平行边', () => {
  const edges: RtfEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 1, cap: 5 },
  ];
  assert.equal(relabelToFront(2, edges, 0, 1), 8);
});

test('relabel-to-front 不连通返回 0', () => {
  const edges: RtfEdgeInput[] = [{ from: 0, to: 1, cap: 5 }];
  assert.equal(relabelToFront(3, edges, 0, 2), 0);
});

test('relabel-to-front 钩子被调用', () => {
  let pushes = 0;
  let relabels = 0;
  let done = -1;
  relabelToFront(
    5,
    [
      { from: 0, to: 1, cap: 10 },
      { from: 0, to: 2, cap: 10 },
      { from: 1, to: 2, cap: 2 },
      { from: 1, to: 3, cap: 4 },
      { from: 1, to: 4, cap: 8 },
      { from: 2, to: 3, cap: 9 },
      { from: 3, to: 4, cap: 10 },
    ],
    0,
    4,
    {
      onPush: () => pushes++,
      onRelabel: () => relabels++,
      onDone: (t) => (done = t),
    },
  );
  assert.ok(pushes > 0);
  assert.ok(relabels >= 0);
  assert.equal(done, 18);
});

test('relabel-to-front 源等于汇返回 0', () => {
  assert.equal(relabelToFront(3, [{ from: 0, to: 1, cap: 5 }], 1, 1), 0);
});
