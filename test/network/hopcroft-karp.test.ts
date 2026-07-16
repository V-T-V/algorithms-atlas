import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hopcroftKarp,
  type BipartiteEdge,
} from '../../src/algorithms/network/hopcroft-karp/impl.ts';

test('hopcroftKarp 完全二分图 K_3,3', () => {
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
  assert.equal(hopcroftKarp(3, 3, edges), 3);
});

test('hopcroftKarp 简单链', () => {
  // L0-R0, L1-R0, L1-R1 => 最大匹配 2
  const edges: BipartiteEdge[] = [
    [0, 0],
    [1, 0],
    [1, 1],
  ];
  assert.equal(hopcroftKarp(2, 2, edges), 2);
});

test('hopcroftKarp 无边返回 0', () => {
  assert.equal(hopcroftKarp(3, 3, []), 0);
});

test('hopcroftKarp 一侧为空返回 0', () => {
  assert.equal(hopcroftKarp(0, 3, []), 0);
  assert.equal(hopcroftKarp(3, 0, []), 0);
});

test('hopcroftKarp 经典示例 = 4', () => {
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
  assert.equal(hopcroftKarp(4, 4, edges), 4);
});

test('hopcroftKarp 左多于右', () => {
  // 4 左 2 右，最大匹配 = 2
  const edges: BipartiteEdge[] = [
    [0, 0],
    [1, 1],
    [2, 0],
    [3, 1],
  ];
  assert.equal(hopcroftKarp(4, 2, edges), 2);
});

test('hopcroftKarp 钩子被调用', () => {
  let rounds = 0;
  let done = -1;
  hopcroftKarp(
    3,
    3,
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    {
      onRound: () => rounds++,
      onDone: (m) => (done = m),
    },
  );
  assert.ok(rounds >= 1, '应有轮次事件');
  assert.equal(done, 3);
});
