import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wallsAndGates, INF } from '../../src/algorithms/graph/graph-wall-and-gates/impl.ts';

test('wall-and-gates LeetCode 286 例', () => {
  const rooms = [
    [INF, -1, 0, INF],
    [INF, INF, INF, -1],
    [INF, -1, INF, -1],
    [0, -1, INF, INF],
  ];
  wallsAndGates(rooms);
  assert.deepEqual(rooms, [
    [3, -1, 0, 1],
    [2, 2, 1, -1],
    [1, -1, 2, -1],
    [0, -1, 3, 4],
  ]);
});

test('wall-and-gates 全墙', () => {
  const rooms = [
    [-1, -1],
    [-1, -1],
  ];
  wallsAndGates(rooms);
  assert.deepEqual(rooms, [
    [-1, -1],
    [-1, -1],
  ]);
});

test('wall-and-gates 单门', () => {
  const rooms = [[INF, INF, 0]];
  wallsAndGates(rooms);
  assert.deepEqual(rooms, [[2, 1, 0]]);
});

test('wall-and-gates 空', () => {
  const rooms: number[][] = [];
  wallsAndGates(rooms);
  assert.deepEqual(rooms, []);
});
