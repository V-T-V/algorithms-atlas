import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  arrangeCoins,
  arrangeCoinsSimulate,
} from '../../src/algorithms/misc/misc-arrange-coins/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-arrange-coins/trace.ts';

test('arrange-coins n=5 = 2', () => {
  assert.equal(arrangeCoins(5), 2);
});

test('arrange-coins n=8 = 3', () => {
  assert.equal(arrangeCoins(8), 3);
});

test('arrange-coins n=1 = 1', () => {
  assert.equal(arrangeCoins(1), 1);
});

test('arrange-coins n=0 = 0', () => {
  assert.equal(arrangeCoins(0), 0);
});

test('arrange-coins 数学 == 模拟', () => {
  for (let n = 0; n <= 1000; n++) {
    assert.equal(arrangeCoins(n), arrangeCoinsSimulate(n), `n=${n}`);
  }
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
