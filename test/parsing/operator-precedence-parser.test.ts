import { test } from 'node:test';
import assert from 'node:assert/strict';
import { operatorPrecedenceParse } from '../../src/algorithms/parsing/operator-precedence-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/operator-precedence-parser/trace.ts';

test('operatorPrecedenceParse 加减', () => {
  assert.equal(operatorPrecedenceParse('3 + 4'), 7);
  assert.equal(operatorPrecedenceParse('10 - 4 - 3'), 3); // 左结合
});

test('operatorPrecedenceParse 乘除优先', () => {
  assert.equal(operatorPrecedenceParse('3 + 4 * 2'), 11);
  assert.equal(operatorPrecedenceParse('2 * 3 + 4'), 10);
});

test('operatorPrecedenceParse 幂右结合', () => {
  assert.equal(operatorPrecedenceParse('2 ^ 3 ^ 2'), 512); // 2^(3^2)=2^9
});

test('operatorPrecedenceParse 括号', () => {
  assert.equal(operatorPrecedenceParse('(3 + 4) * 2'), 14);
  assert.equal(operatorPrecedenceParse('2 * (3 + 4)'), 14);
});

test('operatorPrecedenceParse 混合', () => {
  assert.equal(operatorPrecedenceParse('3 + 4 * 2 ^ 2'), 19); // 3+4*4
});

test('operatorPrecedenceParse 单数字', () => {
  assert.equal(operatorPrecedenceParse('42'), 42);
});

test('operatorPrecedenceParse 除法', () => {
  assert.equal(operatorPrecedenceParse('8 / 2 / 2'), 2); // 左结合
});

test('operatorPrecedenceParse 钩子触发', () => {
  let reduces = 0;
  operatorPrecedenceParse('1 + 2 * 3', { onReduce: () => reduces++ });
  assert.equal(reduces, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
