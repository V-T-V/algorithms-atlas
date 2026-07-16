import { test } from 'node:test';
import assert from 'node:assert/strict';
import { superPow } from '../../src/algorithms/misc/misc-super-pow/impl.ts';
import {
  buildTrace,
  DEFAULT_A,
  DEFAULT_B,
} from '../../src/algorithms/misc/misc-super-pow/trace.ts';

test('super-pow 2^[10] = 1024', () => {
  assert.equal(superPow(2, [1, 0]), 1024);
});

test('super-pow 2^[1] = 2', () => {
  assert.equal(superPow(2, [1]), 2);
});

test('super-pow a=1 恒为 1', () => {
  assert.equal(superPow(1, [9, 9, 9]), 1);
});

test('super-pow 空指数 = 1', () => {
  assert.equal(superPow(5, []), 1);
});

test('super-pow 2^[3] = 8', () => {
  assert.equal(superPow(2, [3]), 8);
});

test('super-pow mod 1337 验证', () => {
  // 2^10 = 1024 < 1337
  assert.ok(superPow(2, [1, 0]) < 1337);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_A, DEFAULT_B);
  assert.ok(frames.length >= 3);
});
