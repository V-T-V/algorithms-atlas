import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDigits, addDigitsFormula } from '../../src/algorithms/misc/misc-add-digits/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-add-digits/trace.ts';

test('add-digits 38 -> 2', () => {
  assert.equal(addDigits(38), 2);
});

test('add-digits 0 -> 0', () => {
  assert.equal(addDigits(0), 0);
});

test('add-digits 单位', () => {
  assert.equal(addDigits(5), 5);
});

test('add-digits 9 的倍数 -> 9', () => {
  assert.equal(addDigits(18), 9);
  assert.equal(addDigits(99), 9);
});

test('add-digits 模拟 == 公式', () => {
  for (let n = 0; n <= 1000; n++) {
    assert.equal(addDigits(n), addDigitsFormula(n), `n=${n}`);
  }
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
