import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bpeTrain, bpeDecode } from '../../src/algorithms/compression/comp-pairs/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/comp-pairs/trace.ts';

function roundtrip(data: number[], rounds: number): void {
  const r = bpeTrain(data, rounds);
  assert.deepEqual(bpeDecode(r.tokens, r.merges), data);
}

test('bpe 往返一致', () => {
  roundtrip([97, 97, 98, 97, 97, 98, 97, 97, 98, 99, 99, 99], 4);
});

test('bpe 合并减少 token 数', () => {
  const r = bpeTrain([97, 97, 97, 97, 97, 97], 3);
  assert.ok(r.tokens.length < 6);
});

test('bpe 无重复不合并', () => {
  const r = bpeTrain([1, 2, 3, 4, 5], 3);
  assert.equal(r.merges.length, 0);
  assert.deepEqual(r.tokens, [1, 2, 3, 4, 5]);
});

test('bpe 空输入', () => {
  const r = bpeTrain([], 3);
  assert.deepEqual(r.tokens, []);
  assert.deepEqual(r.merges, []);
});

test('bpe DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT, 4);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
