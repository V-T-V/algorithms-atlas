import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha1 } from '../../src/algorithms/crypto/sha1/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/sha1/trace.ts';

test('sha1 输出 20 字节', () => {
  const { digest } = sha1([72, 101, 108, 108, 111]);
  assert.equal(digest.length, 20);
  assert.ok(digest.every((b) => b >= 0 && b < 256));
});

test('sha1 确定性', () => {
  assert.deepEqual(sha1([1, 2, 3]).digest, sha1([1, 2, 3]).digest);
});

test('sha1 雪崩效应', () => {
  const a = sha1([0]).digest;
  const b = sha1([1]).digest;
  let diff = 0;
  for (let i = 0; i < 20; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff > 10);
});

test('sha1 钩子触发 80 次', () => {
  let n = 0;
  sha1([1], { onStep: () => n++ });
  assert.equal(n, 80);
});

test('buildTrace 末帧含摘要', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  const entry = last.map!.find((e) => e.key === 'SHA-1');
  assert.ok(entry && entry.value.length > 0);
});
