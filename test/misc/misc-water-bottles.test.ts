import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  numWaterBottles,
  numWaterBottlesFormula,
} from '../../src/algorithms/misc/misc-water-bottles/impl.ts';
import {
  buildTrace,
  DEFAULT_BOTTLES,
  DEFAULT_EXCHANGE,
} from '../../src/algorithms/misc/misc-water-bottles/trace.ts';

test('water-bottles 9,3 = 13', () => {
  assert.equal(numWaterBottles(9, 3), 13);
});

test('water-bottles 15,4 = 19', () => {
  assert.equal(numWaterBottles(15, 4), 19);
});

test('water-bottles 5,5 = 6', () => {
  assert.equal(numWaterBottles(5, 5), 6);
});

test('water-bottles 1,2 = 1', () => {
  assert.equal(numWaterBottles(1, 2), 1);
});

test('water-bottles 模拟 == 公式', () => {
  for (let n = 1; n <= 100; n++) {
    for (const e of [2, 3, 5, 7]) {
      assert.equal(numWaterBottles(n, e), numWaterBottlesFormula(n, e), `n=${n},e=${e}`);
    }
  }
});

test('water-bottles 非法抛错', () => {
  assert.throws(() => numWaterBottles(5, 1));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_BOTTLES, DEFAULT_EXCHANGE);
  assert.ok(frames.length >= 3);
});
