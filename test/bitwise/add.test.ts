import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add } from '../../src/algorithms/bitwise/add/impl.ts';

test('add 基本行为', () => {
  assert.equal(add(0, 0), 0);
  assert.equal(add(1, 1), 2);
  assert.equal(add(13, 29), 42);
  assert.equal(add(100, 200), 300);
});

test('add 含零与负数', () => {
  assert.equal(add(5, 0), 5);
  assert.equal(add(0, 5), 5);
  assert.equal(add(-5, 3), -2);
  assert.equal(add(-5, -3), -8);
  assert.equal(add(-1, 1), 0);
});

test('add 与原生 + 一致（含大数与进位传播）', () => {
  const samples = [
    [123456, 789012],
    [2147483647, 1],
    [-2147483648, -1],
    [1023, 1],
  ];
  for (const [a, b] of samples) assert.equal(add(a!, b!), (a! + b!) | 0);
});

test('add 钩子被调用', () => {
  let rounds = 0;
  const result = add(3, 1, {
    onCarry: (iter, sum, carry) => {
      rounds++;
      if (iter === 0) {
        assert.equal(sum, 2); // 3^1 = 2
        assert.equal(carry, 2); // (3&1)<<1 = 2
      }
    },
  });
  assert.equal(result, 4);
  assert.ok(rounds > 0, '至少一轮进位传播');
});
