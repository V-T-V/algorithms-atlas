import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  integerReplacement,
  integerReplacementBrute,
} from '../../src/algorithms/misc/misc-integer-replacement/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/misc-integer-replacement/trace.ts';

test('int-repl 8 -> 3', () => {
  assert.equal(integerReplacement(8), 3);
});

test('int-repl 7 -> 4', () => {
  assert.equal(integerReplacement(7), 4);
});

test('int-repl 1 -> 0', () => {
  assert.equal(integerReplacement(1), 0);
});

test('int-repl 3 -> 2', () => {
  assert.equal(integerReplacement(3), 2);
});

test('int-repl 贪心 == 暴力（小范围）', () => {
  for (let n = 1; n <= 200; n++) {
    assert.equal(integerReplacement(n), integerReplacementBrute(n), `n=${n}`);
  }
});

test('int-repl 非法抛错', () => {
  assert.throws(() => integerReplacement(0));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
