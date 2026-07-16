import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mpm, type MpmEdgeInput } from '../../src/algorithms/network/mpm/impl.ts';

test('MPM 经典图最大流 = 18', () => {
  const edges: MpmEdgeInput[] = [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ];
  assert.equal(mpm(5, edges, 0, 4), 18);
});

test('MPM CLRS 经典示例 = 23', () => {
  const edges: MpmEdgeInput[] = [
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
  assert.equal(mpm(6, edges, 0, 5), 23);
});

test('MPM 平行边', () => {
  const edges: MpmEdgeInput[] = [
    { from: 0, to: 1, cap: 3 },
    { from: 0, to: 1, cap: 5 },
  ];
  assert.equal(mpm(2, edges, 0, 1), 8);
});

test('MPM 不连通返回 0', () => {
  const edges: MpmEdgeInput[] = [{ from: 0, to: 1, cap: 5 }];
  assert.equal(mpm(3, edges, 0, 2), 0);
});

test('MPM 钩子被调用', () => {
  let potentials = 0;
  let phases = 0;
  let done = -1;
  mpm(
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
      onPotential: () => potentials++,
      onPhase: () => phases++,
      onDone: (t) => (done = t),
    },
  );
  assert.ok(potentials > 0);
  assert.ok(phases > 0);
  assert.equal(done, 18);
});

test('MPM 源等于汇返回 0', () => {
  assert.equal(mpm(3, [{ from: 0, to: 1, cap: 5 }], 1, 1), 0);
});
