import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compress842, decompress842 } from '../../src/algorithms/compression/comp-842/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/comp-842/trace.ts';

function roundtrip(data: number[]): void {
  const ops = compress842(data);
  assert.deepEqual(decompress842(ops), data);
}

test('842 全零块检测', () => {
  const ops = compress842([0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(ops[0]!.type, 'zeros');
});

test('842 重复块检测', () => {
  const ops = compress842([5, 5, 5, 5, 5, 5, 5, 5]);
  assert.equal(ops[0]!.type, 'repeat');
});

test('842 短回引检测', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  const ops = compress842(data);
  assert.ok(ops.some((o) => o.type === 'short-match'));
});

test('842 往返一致', () => {
  roundtrip([0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9]);
});

test('842 DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('842 空输入', () => {
  assert.deepEqual(compress842([]), []);
  assert.deepEqual(decompress842([]), []);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
