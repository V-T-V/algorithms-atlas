import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alienOrder } from '../../src/algorithms/graph/graph-alien-dictionary/impl.ts';

test('alien-dictionary 基本例', () => {
  // ["wrt","wrf","er","ett","rftt"] -> 任一合法序如 "wertf"
  const order = alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']);
  assert.equal(order.length, 5);
  assert.ok(order.indexOf('w') < order.indexOf('e'));
  assert.ok(order.indexOf('e') < order.indexOf('r'));
  assert.ok(order.indexOf('r') < order.indexOf('t'));
  assert.ok(order.indexOf('t') < order.indexOf('f'));
});

test('alien-dictionary 单词', () => {
  const order = alienOrder(['z', 'x']);
  assert.ok(order.indexOf('z') < order.indexOf('x'));
});

test('alien-dictionary 环返回空', () => {
  // a→b 且 b→a
  assert.equal(alienOrder(['ab', 'ba', 'ab']), '');
});

test('alien-dictionary 非法前缀', () => {
  assert.equal(alienOrder(['abc', 'ab']), '');
});

test('alien-dictionary 全不同字母', () => {
  const order = alienOrder(['a', 'b', 'c']);
  assert.equal(order, 'abc');
});
