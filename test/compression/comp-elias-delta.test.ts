import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eliasDeltaEncode,
  eliasDeltaEncodeAll,
  eliasDeltaDecodeAll,
} from '../../src/algorithms/compression/comp-elias-delta/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-elias-delta/trace.ts';

test('elias delta n=1 编码', () => {
  assert.equal(eliasDeltaEncode(1), '1');
});

test('elias delta n=2 编码', () => {
  assert.equal(eliasDeltaEncode(2), '0100');
});

test('elias delta n=3 编码', () => {
  assert.equal(eliasDeltaEncode(3), '0101');
});

test('elias delta 批量往返', () => {
  const nums = [1, 2, 3, 5, 8, 13, 21, 34];
  const bits = eliasDeltaEncodeAll(nums);
  assert.deepEqual(eliasDeltaDecodeAll(bits), nums);
});

test('elias delta 大数往返', () => {
  const nums = [1, 100, 1000];
  const bits = eliasDeltaEncodeAll(nums);
  assert.deepEqual(eliasDeltaDecodeAll(bits), nums);
});

test('elias delta 非法输入抛错', () => {
  assert.throws(() => eliasDeltaEncode(0));
  assert.throws(() => eliasDeltaEncode(-1));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
