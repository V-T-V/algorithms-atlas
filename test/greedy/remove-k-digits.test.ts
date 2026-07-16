import { test } from 'node:test';
import assert from 'node:assert/strict';
import { removeKDigits } from '../../src/algorithms/greedy/remove-k-digits/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/remove-k-digits/trace.ts';

test('removeKDigits 已知值', () => {
  assert.equal(removeKDigits('1432219', 3).value, '1219');
  assert.equal(removeKDigits('10200', 1).value, '200');
  assert.equal(removeKDigits('10', 2).value, '0');
  assert.equal(removeKDigits('9', 1).value, '0');
});

test('removeKDigits 全删返回 0', () => {
  assert.equal(removeKDigits('12345', 5).value, '0');
});

test('removeKDigits 单调不降删尾部', () => {
  assert.equal(removeKDigits('112', 1).value, '11');
});

test('buildTrace 含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
