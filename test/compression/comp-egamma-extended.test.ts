import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extGammaEncode,
  extGammaEncodeAll,
  extGammaDecodeAll,
} from '../../src/algorithms/compression/comp-egamma-extended/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-egamma-extended/trace.ts';

test('ext-gamma 零编码', () => {
  assert.equal(extGammaEncode(0), '00');
});

test('ext-gamma 正数往返', () => {
  const bits = extGammaEncodeAll([0, 1, 3, 5]);
  assert.deepEqual(extGammaDecodeAll(bits), [0, 1, 3, 5]);
});

test('ext-gamma 含负数往返', () => {
  const bits = extGammaEncodeAll([0, 1, -1, 3, -5, 8]);
  assert.deepEqual(extGammaDecodeAll(bits), [0, 1, -1, 3, -5, 8]);
});

test('ext-gamma DEFAULT_INPUT 往返', () => {
  const bits = extGammaEncodeAll(DEFAULT_INPUT);
  assert.deepEqual(extGammaDecodeAll(bits), DEFAULT_INPUT);
});

test('ext-gamma 大数往返', () => {
  const bits = extGammaEncodeAll([100, -200, 0]);
  assert.deepEqual(extGammaDecodeAll(bits), [100, -200, 0]);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
