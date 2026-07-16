import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberOfDice } from '../../src/algorithms/dp/number-of-dice/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/number-of-dice/trace.ts';

test('number-of-dice 经典值', () => {
  assert.equal(numberOfDice(2, 6, 7), 6); // 1+6..6+1
  assert.equal(numberOfDice(1, 6, 3), 1);
  assert.equal(numberOfDice(3, 6, 10), 27);
});

test('number-of-dice 不可能的情况返回 0', () => {
  assert.equal(numberOfDice(2, 6, 1), 0); // 最小和为 2
  assert.equal(numberOfDice(2, 6, 13), 0); // 最大和为 12
});

test('number-of-dice 边界', () => {
  assert.equal(numberOfDice(0, 6, 0), 1);
  assert.equal(numberOfDice(0, 6, 1), 0);
});

test('number-of-dice 钩子被调用', () => {
  let fills = 0;
  numberOfDice(2, 6, 7, { onFill: () => fills++ });
  assert.ok(fills > 0);
});

test('number-of-dice buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
