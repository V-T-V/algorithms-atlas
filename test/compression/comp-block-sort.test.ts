import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bwtForward,
  bwtInverse,
  blockSortForward,
  blockSortInverse,
} from '../../src/algorithms/compression/comp-block-sort/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-block-sort/trace.ts';

test('block-sort 单块往返', () => {
  const r = bwtForward('banana');
  assert.equal(bwtInverse(r.lastColumn, r.primaryIndex), 'banana');
});

test('block-sort 空串', () => {
  const r = bwtForward('');
  assert.equal(r.lastColumn, '');
  assert.equal(bwtInverse('', 0), '');
});

test('block-sort 单字符', () => {
  const r = bwtForward('a');
  assert.equal(bwtInverse(r.lastColumn, r.primaryIndex), 'a');
});

test('block-sort 分块往返', () => {
  const rs = blockSortForward('bananaabracadabra', 8);
  assert.equal(blockSortInverse(rs), 'bananaabracadabra');
});

test('block-sort DEFAULT_INPUT 往返', () => {
  const rs = blockSortForward(DEFAULT_INPUT, 8);
  assert.equal(blockSortInverse(rs), DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
