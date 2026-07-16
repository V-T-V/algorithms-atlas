import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hopcroftKarp } from '../../src/algorithms/network/net-max-bipartite-matching-2/impl.ts';

test('hopcroftKarp 基本最大匹配', () => {
  const m = hopcroftKarp({
    nL: 4,
    nR: 4,
    edges: [
      { u: 0, v: 0 },
      { u: 0, v: 1 },
      { u: 1, v: 0 },
      { u: 1, v: 2 },
      { u: 2, v: 2 },
      { u: 2, v: 3 },
      { u: 3, v: 1 },
    ],
  });
  assert.equal(m.length, 4);
});

test('hopcroftKarp 无边时匹配为 0', () => {
  assert.equal(hopcroftKarp({ nL: 3, nR: 3, edges: [] }).length, 0);
});

test('hopcroftKarp 完全二分图 K_{2,2} 匹配 2', () => {
  assert.equal(
    hopcroftKarp({
      nL: 2,
      nR: 2,
      edges: [
        { u: 0, v: 0 },
        { u: 0, v: 1 },
        { u: 1, v: 0 },
        { u: 1, v: 1 },
      ],
    }).length,
    2,
  );
});

test('hopcroftKarp 每个左侧点最多匹配一次', () => {
  const m = hopcroftKarp({
    nL: 3,
    nR: 2,
    edges: [
      { u: 0, v: 0 },
      { u: 1, v: 0 },
      { u: 2, v: 1 },
    ],
  });
  const us = m.map((x) => x.u);
  assert.equal(new Set(us).size, us.length);
});

test('hopcroftKarp 钩子被调用', () => {
  let augments = 0;
  hopcroftKarp(
    {
      nL: 2,
      nR: 2,
      edges: [
        { u: 0, v: 0 },
        { u: 1, v: 1 },
      ],
    },
    { onAugment: () => augments++ },
  );
  assert.ok(augments >= 1);
});
