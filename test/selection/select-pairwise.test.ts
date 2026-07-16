import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tournamentMin,
  tournamentSecond,
} from '../../src/algorithms/selection/select-pairwise/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/select-pairwise/trace.ts';

test('tournamentMin 找最小', () => {
  const r = tournamentMin([7, 2, 9, 4, 1, 8, 5, 3]);
  assert.equal(r.minimum, 1);
});

test('tournamentMin 恰好用 n-1 次比较', () => {
  const arr = [7, 2, 9, 4, 1, 8, 5, 3];
  const r = tournamentMin(arr);
  assert.equal(r.comparisons, arr.length - 1);
});

test('tournamentMin 2 个元素 1 次比较', () => {
  const r = tournamentMin([5, 3]);
  assert.equal(r.minimum, 3);
  assert.equal(r.comparisons, 1);
});

test('tournamentMin 奇数个元素', () => {
  const r = tournamentMin([4, 9, 2]);
  assert.equal(r.minimum, 2);
  assert.equal(r.comparisons, 2);
});

test('tournamentMin 单元素', () => {
  const r = tournamentMin([42]);
  assert.equal(r.minimum, 42);
  assert.equal(r.comparisons, 0);
});

test('tournamentMin 空数组抛错', () => {
  assert.throws(() => tournamentMin([]));
});

test('tournamentSecond 找次小', () => {
  const r = tournamentSecond([7, 2, 9, 4, 1, 8, 5, 3]);
  assert.equal(r.minimum, 1);
  assert.equal(r.second, 2);
});

test('tournamentSecond 重复值', () => {
  const r = tournamentSecond([5, 5, 5]);
  assert.equal(r.minimum, 5);
  assert.equal(r.second, 5);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
