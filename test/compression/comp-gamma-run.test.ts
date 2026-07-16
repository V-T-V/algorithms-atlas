import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rle,
  gammaRunEncode,
  gammaRunDecode,
} from '../../src/algorithms/compression/comp-gamma-run/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-gamma-run/trace.ts';

function roundtrip(data: number[]): void {
  const bits = gammaRunEncode(data);
  assert.deepEqual(gammaRunDecode(bits), data);
}

test('gamma-run RLE 正确', () => {
  assert.deepEqual(rle([0, 0, 0, 1, 1]), [
    { sym: 0, length: 3 },
    { sym: 1, length: 2 },
  ]);
});

test('gamma-run 往返一致', () => {
  roundtrip([0, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 3, 3]);
});

test('gamma-run 长游程往返', () => {
  roundtrip(Array.from({ length: 50 }, (_, i) => i % 2));
});

test('gamma-run 空输入', () => {
  assert.equal(gammaRunEncode([]), '');
  assert.deepEqual(gammaRunDecode(''), []);
});

test('gamma-run 单元素', () => {
  roundtrip([7]);
});

test('gamma-run DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
