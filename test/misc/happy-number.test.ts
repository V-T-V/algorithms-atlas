import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isHappyNumber,
  sumOfSquaresOfDigits,
} from '../../src/algorithms/misc/happy-number/impl.ts';

test('happy-number 19 是快乐数', () => {
  // 19 → 82 → 68 → 100 → 1
  assert.equal(isHappyNumber(19), true);
});

test('happy-number 2 不是快乐数', () => {
  // 2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4（环）
  assert.equal(isHappyNumber(2), false);
});

test('happy-number 1 是快乐数（平凡）', () => {
  assert.equal(isHappyNumber(1), true);
});

test('happy-number 7 是快乐数', () => {
  // 7 → 49 → 97 → 130 → 10 → 1
  assert.equal(isHappyNumber(7), true);
});

test('happy-number sumOfSquaresOfDigits 正确', () => {
  assert.equal(sumOfSquaresOfDigits(19), 82);
  assert.equal(sumOfSquaresOfDigits(82), 68);
  assert.equal(sumOfSquaresOfDigits(100), 1);
  assert.equal(sumOfSquaresOfDigits(0), 0);
});

test('happy-number 已知快乐数集合', () => {
  // 前 20 个快乐数：1,7,10,13,19,23,28,31,32,44,49,68,70,79,82,86,91,94,97,100
  const happy = new Set([
    1, 7, 10, 13, 19, 23, 28, 31, 32, 44, 49, 68, 70, 79, 82, 86, 91, 94, 97, 100,
  ]);
  for (let i = 1; i <= 100; i++) {
    assert.equal(isHappyNumber(i), happy.has(i), `i=${i}`);
  }
});

test('happy-number 钩子被调用（19）', () => {
  const seq: Array<[number, number]> = [];
  let happy = false;
  isHappyNumber(19, {
    onStep: (n, sum) => seq.push([n, sum]),
    onHappy: () => {
      happy = true;
    },
  });
  // 19→82, 82→68, 68→100, 100→1
  assert.deepEqual(seq, [
    [19, 82],
    [82, 68],
    [68, 100],
    [100, 1],
  ]);
  assert.equal(happy, true);
});

test('happy-number 钩子被调用（2，环）', () => {
  let cycled = false;
  let cycleValue = -1;
  isHappyNumber(2, {
    onCycle: (seen) => {
      cycled = true;
      cycleValue = seen;
    },
  });
  assert.equal(cycled, true);
  // 环的入口点应为 4
  assert.equal(cycleValue, 4);
});

test('happy-number 非正整数返回 false', () => {
  assert.equal(isHappyNumber(0), false);
  assert.equal(isHappyNumber(-5), false);
});
