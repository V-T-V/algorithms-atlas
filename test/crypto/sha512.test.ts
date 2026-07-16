import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha512 } from '../../src/algorithms/crypto/sha512/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/sha512/trace.ts';

test('sha512 输出 64 字节', () => {
  const { digest } = sha512([72, 101, 108, 108, 111]);
  assert.equal(digest.length, 64);
  assert.ok(digest.every((b) => b >= 0 && b < 256));
});

test('sha512 确定性', () => {
  assert.deepEqual(sha512([1, 2, 3]).digest, sha512([1, 2, 3]).digest);
});

test('sha512 雪崩效应', () => {
  const a = sha512([0]).digest;
  const b = sha512([1]).digest;
  let diff = 0;
  for (let i = 0; i < 64; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff > 30);
});

test('sha512 钩子触发 80 次', () => {
  let n = 0;
  sha512([1], { onStep: () => n++ });
  assert.equal(n, 80);
});

test('buildTrace 末帧含摘要', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.ok(last.map!.some((e) => e.key === 'SHA-512'));
});
