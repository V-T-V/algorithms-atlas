import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoerWagner2 } from '../../src/algorithms/network/net-min-cut-stoer-2/impl.ts';

test('stoerWagner2 基本最小割', () => {
  // 两三角形靠一条边相连，最小割=1
  const cut = stoerWagner2({
    n: 6,
    edges: [
      { from: 0, to: 1, w: 5 },
      { from: 1, to: 2, w: 5 },
      { from: 0, to: 2, w: 5 },
      { from: 3, to: 4, w: 5 },
      { from: 4, to: 5, w: 5 },
      { from: 3, to: 5, w: 5 },
      { from: 2, to: 3, w: 1 },
    ],
  });
  assert.equal(cut, 1);
});

test('stoerWagner2 单条桥', () => {
  const cut = stoerWagner2({
    n: 4,
    edges: [
      { from: 0, to: 1, w: 3 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 3, w: 3 },
    ],
  });
  assert.equal(cut, 1);
});

test('stoerWagner2 完全图三节点', () => {
  const cut = stoerWagner2({
    n: 3,
    edges: [
      { from: 0, to: 1, w: 2 },
      { from: 1, to: 2, w: 3 },
      { from: 0, to: 2, w: 4 },
    ],
  });
  // 隔离点 0 切 2+4=6；点1 切 2+3=5；点2 切 3+4=7 -> 最小 5
  assert.equal(cut, 5);
});

test('stoerWagner2 钩子被调用', () => {
  let phases = 0;
  stoerWagner2(
    {
      n: 4,
      edges: [
        { from: 0, to: 1, w: 1 },
        { from: 1, to: 2, w: 1 },
        { from: 2, to: 3, w: 1 },
      ],
    },
    { onPhase: () => phases++ },
  );
  assert.ok(phases >= 1);
});
