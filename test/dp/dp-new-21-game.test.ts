import { test } from 'node:test';
import assert from 'node:assert/strict';
import { new21Game } from '../../src/algorithms/dp/dp-new-21-game/impl.ts';

const close = (a: number, b: number, eps = 1e-6): boolean => Math.abs(a - b) < eps;

test('new-21 LeetCode 837 例', () => {
  assert.ok(close(new21Game(10, 1, 10), 1.0));
  assert.ok(close(new21Game(6, 1, 10), 0.6));
  assert.ok(close(new21Game(21, 17, 10), 0.73278));
});

test('new-21 K=0 必赢', () => {
  // K=0 时立即停止，分数=0 ≤ N（N>=0）→ 概率 1
  assert.equal(new21Game(5, 0, 10), 1);
});

test('new-21 N 足够大概率 1', () => {
  // 最大可能分数 K-1+W，N >= 该值时概率为 1
  assert.equal(new21Game(100, 5, 3), 1); // K-1+W = 4+3=7 <= 100
});

test('new-21 单步 W=1 退化', () => {
  // W=1：每次必抽 1 分；从 0 抽到 K，最终分数恰为 K
  // 若 K <= N 则概率 1，否则 0
  assert.equal(new21Game(5, 3, 1), 1);
  assert.equal(new21Game(2, 3, 1), 0);
});

test('new-21 钩子', () => {
  let cells = 0;
  new21Game(6, 1, 10, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
