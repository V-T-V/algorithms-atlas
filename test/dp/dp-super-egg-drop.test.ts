import { test } from 'node:test';
import assert from 'node:assert/strict';
import { superEggDrop } from '../../src/algorithms/dp/dp-super-egg-drop/impl.ts';

test('super-egg-drop 1 蛋 N 层需 N 次', () => {
  assert.equal(superEggDrop(1, 10).answer, 10);
});

test('super-egg-drop 经典 K=2 N=6 = 3', () => {
  assert.equal(superEggDrop(2, 6).answer, 3);
});

test('super-egg-drop K=2 N=1 = 1', () => {
  assert.equal(superEggDrop(2, 1).answer, 1);
});

test('super-egg-drop K=3 N=14 = 4', () => {
  assert.equal(superEggDrop(3, 14).answer, 4);
});

test('super-egg-drop 蛋足够多退化为 log', () => {
  // 蛋多到任意时，N=100 需 ceil(log2(101))=7
  assert.equal(superEggDrop(7, 100).answer, 7);
});

test('super-egg-drop 边界 0', () => {
  assert.equal(superEggDrop(0, 5).answer, 0);
  assert.equal(superEggDrop(3, 0).answer, 0);
});

test('super-egg-drop 钩子被调用', () => {
  let cells = 0;
  superEggDrop(2, 6, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
