import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md5 } from '../../src/algorithms/crypto/md5/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/md5/trace.ts';

test('md5 输出 16 字节', () => {
  const { digest } = md5([72, 101, 108, 108, 111]);
  assert.equal(digest.length, 16);
  assert.ok(digest.every((b) => b >= 0 && b < 256));
});

test('md5 确定性（相同输入相同输出）', () => {
  assert.deepEqual(md5([1, 2, 3]).digest, md5([1, 2, 3]).digest);
});

test('md5 雪崩效应（单比特变化 → 摘要大变）', () => {
  const a = md5([0]).digest;
  const b = md5([1]).digest;
  let diff = 0;
  for (let i = 0; i < 16; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff > 8, '至少一半字节不同');
});

test('md5 空输入也产生有效摘要', () => {
  const { digest } = md5([]);
  assert.equal(digest.length, 16);
});

test('md5 钩子触发 64 次', () => {
  let n = 0;
  md5([1], { onStep: () => n++ });
  assert.equal(n, 64);
});

test('buildTrace 含四轮帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.ok(last.map!.some((e) => e.key === 'MD5'));
});
