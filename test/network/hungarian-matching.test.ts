import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hungarian,
  type BipartiteEdge,
} from '../../src/algorithms/network/hungarian-matching/impl.ts';
import { hopcroftKarp } from '../../src/algorithms/network/hopcroft-karp/impl.ts';

test('hungarian 完全二分图 K_3,3', () => {
  const edges: BipartiteEdge[] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ];
  assert.equal(hungarian(3, 3, edges), 3);
});

test('hungarian 简单链', () => {
  const edges: BipartiteEdge[] = [
    [0, 0],
    [1, 0],
    [1, 1],
  ];
  assert.equal(hungarian(2, 2, edges), 2);
});

test('hungarian 无边返回 0', () => {
  assert.equal(hungarian(3, 3, []), 0);
});

test('hungarian 一侧为空返回 0', () => {
  assert.equal(hungarian(0, 3, []), 0);
});

test('hungarian 经典示例 = 4', () => {
  const edges: BipartiteEdge[] = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 2],
    [2, 3],
    [3, 0],
    [3, 3],
  ];
  assert.equal(hungarian(4, 4, edges), 4);
});

test('hungarian 与 hopcroft-karp 结果一致', () => {
  const cases: BipartiteEdge[][] = [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 0],
      [3, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
    ],
    [
      [0, 1],
      [1, 0],
      [2, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
    ],
  ];
  for (const edges of cases) {
    const h = hungarian(4, 4, edges);
    const hk = hopcroftKarp(4, 4, edges);
    assert.equal(h, hk, `不一致：edges=${JSON.stringify(edges)}`);
  }
});

test('hungarian 左多于右', () => {
  const edges: BipartiteEdge[] = [
    [0, 0],
    [1, 1],
    [2, 0],
    [3, 1],
  ];
  assert.equal(hungarian(4, 2, edges), 2);
});

test('hungarian 钩子被调用', () => {
  let tries = 0;
  let augs = 0;
  let done = -1;
  hungarian(
    3,
    3,
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    {
      onTryLeft: () => tries++,
      onAugment: () => augs++,
      onDone: (m) => (done = m),
    },
  );
  assert.ok(tries > 0);
  assert.equal(augs, 3);
  assert.equal(done, 3);
});
