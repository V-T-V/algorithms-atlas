import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  golombRiceEncode,
  golombRiceEncodeAll,
  golombRiceDecodeAll,
  optimalK,
} from '../../src/algorithms/compression/comp-golomb-rice/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-golomb-rice/trace.ts';

test('golomb-rice k=2 n=0 编码', () => {
  assert.equal(golombRiceEncode(0, 2), '000');
});

test('golomb-rice k=2 n=5 编码', () => {
  // q=1, r=1 -> '10' + '01'
  assert.equal(golombRiceEncode(5, 2), '1001');
});

test('golomb-rice 批量往返', () => {
  const nums = [0, 1, 2, 3, 5, 8, 13];
  const bits = golombRiceEncodeAll(nums, 3);
  assert.deepEqual(golombRiceDecodeAll(bits, 3), nums);
});

test('golomb-rice 非法输入抛错', () => {
  assert.throws(() => golombRiceEncode(-1, 2));
});

test('golomb-rice optimalK 合理', () => {
  const k = optimalK([1, 1, 1, 1, 1]);
  assert.ok(k >= 0);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
