import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aesSbox, AES_SBOX } from '../../src/algorithms/crypto/aes-sbox/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/aes-sbox/trace.ts';

test('aesSbox 已知值', () => {
  // 标准 Rijndael S-Box 已知项
  assert.equal(AES_SBOX[0x00], 0x63);
  assert.equal(AES_SBOX[0x01], 0x7c);
  assert.equal(AES_SBOX[0x53], 0xed);
  assert.equal(AES_SBOX[0xff], 0x16);
});

test('aesSbox 逐字节代换', () => {
  const { bytes } = aesSbox([0x00, 0x01, 0x53, 0xff]);
  assert.deepEqual(bytes, [0x63, 0x7c, 0xed, 0x16]);
});

test('aesSbox 双射：无重复输出', () => {
  const all = aesSbox(Array.from({ length: 256 }, (_, i) => i)).bytes;
  assert.equal(all.length, 256);
  assert.equal(new Set(all).size, 256);
});

test('aesSbox 钩子触发', () => {
  const seen: number[] = [];
  aesSbox([0x00, 0xff], { onSubstitute: (_i, b, r) => seen.push(b, r) });
  assert.deepEqual(seen, [0x00, 0x63, 0xff, 0x16]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars?.every((b) => b.role === 'final'));
});
