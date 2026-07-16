import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuntingYard, tokenize } from '../../src/algorithms/parsing/shunting-yard/impl.ts';

test('shunting-yard 简单加减', () => {
  assert.deepEqual(shuntingYard(['a', '+', 'b']), ['a', 'b', '+']);
  assert.deepEqual(shuntingYard(['a', '-', 'b', '+', 'c']), ['a', 'b', '-', 'c', '+']);
});

test('shunting-yard 优先级', () => {
  // a + b * c → a b c * +
  assert.deepEqual(shuntingYard(['a', '+', 'b', '*', 'c']), ['a', 'b', 'c', '*', '+']);
});

test('shunting-yard 括号', () => {
  // (a + b) * c → a b + c *
  assert.deepEqual(shuntingYard(['(', 'a', '+', 'b', ')', '*', 'c']), ['a', 'b', '+', 'c', '*']);
});

test('shunting-yard 完整表达式', () => {
  // 3 + 4 * 2 / (1 - 5) ^ 2 → 3 4 2 * 1 5 - 2 ^ / +
  assert.deepEqual(
    shuntingYard(['3', '+', '4', '*', '2', '/', '(', '1', '-', '5', ')', '^', '2']),
    ['3', '4', '2', '*', '1', '5', '-', '2', '^', '/', '+'],
  );
});

test('shunting-yard 右结合（幂）', () => {
  // a ^ b ^ c → a b c ^ ^（右结合）
  assert.deepEqual(shuntingYard(['a', '^', 'b', '^', 'c']), ['a', 'b', 'c', '^', '^']);
});

test('shunting-yard tokenize 工具', () => {
  assert.deepEqual(tokenize('3 + 4 * 2'), ['3', '+', '4', '*', '2']);
  assert.deepEqual(tokenize('(1+2)*3'), ['(', '1', '+', '2', ')', '*', '3']);
});

test('shunting-yard 钩子被调用', () => {
  let reads = 0;
  let emits = 0;
  shuntingYard(['a', '+', 'b'], {
    onRead: () => reads++,
    onEmit: () => emits++,
  });
  assert.equal(reads, 3);
  assert.equal(emits, 3);
});
