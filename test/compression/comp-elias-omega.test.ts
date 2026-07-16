import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eliasOmegaEncode,
  eliasOmegaEncodeAll,
  eliasOmegaDecodeAll,
} from '../../src/algorithms/compression/comp-elias-omega/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-elias-omega/trace.ts';

test('elias omega n=1 编码', () => {
  assert.equal(eliasOmegaEncode(1), '0');
});

test('elias omega n=2 编码', () => {
  assert.equal(eliasOmegaEncode(2), '100');
});

test('elias omega 批量往返', () => {
  const nums = [1, 2, 3, 5, 8, 13];
  const bits = eliasOmegaEncodeAll(nums);
  assert.deepEqual(eliasOmegaDecodeAll(bits), nums);
});

test('elias omega 大数往返', () => {
  const nums = [1, 100, 500];
  const bits = eliasOmegaEncodeAll(nums);
  assert.deepEqual(eliasOmegaDecodeAll(bits), nums);
});

test('elias omega 非法输入抛错', () => {
  assert.throws(() => eliasOmegaEncode(0));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
