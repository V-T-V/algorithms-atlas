import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fnv1a64 } from '../../src/algorithms/hashing/hash-fowler-noll-vo/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/hash-fowler-noll-vo/trace.ts';

test('hash-fowler-noll-vo 确定性', () => {
  assert.equal(fnv1a64('hello'), fnv1a64('hello'));
});
test('hash-fowler-noll-vo 不同输入不同', () => {
  assert.notEqual(fnv1a64('hello'), fnv1a64('world'));
});
test('hash-fowler-noll-vo 64 位无符号', () => {
  assert.ok(fnv1a64('abc') >= 0n);
});
test('hash-fowler-noll-vo 空输入', () => {
  assert.ok(fnv1a64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
