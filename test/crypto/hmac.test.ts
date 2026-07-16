import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hmac } from '../../src/algorithms/crypto/hmac/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/hmac/trace.ts';

test('hmac 输出 4 字节且确定', () => {
  const { digest } = hmac([1, 2, 3], [9, 9, 9]);
  assert.equal(digest.length, 4);
  assert.deepEqual(hmac([1, 2, 3], [9, 9, 9]).digest, hmac([1, 2, 3], [9, 9, 9]).digest);
});

test('hmac 相同消息不同密钥结果不同', () => {
  const a = hmac([1, 2, 3], [1, 2, 3]).digest;
  const b = hmac([1, 2, 3], [9, 9, 9]).digest;
  assert.notDeepEqual(a, b);
});

test('hmac 确定性（RFC 性质）', () => {
  // 同样的消息+密钥应给出同样 MAC
  assert.deepEqual(
    hmac([72, 101], [0x0b, 0x0b, 0x0b, 0x0b]).digest,
    hmac([72, 101], [0x0b, 0x0b, 0x0b, 0x0b]).digest,
  );
});

test('hmac 钩子按序触发', () => {
  const steps: string[] = [];
  hmac([1], [1, 2], {
    onKeyPad: (_k, pad) => steps.push(pad),
    onInner: () => steps.push('inner'),
    onOuter: () => steps.push('outer'),
  });
  assert.deepEqual(steps, ['ipad', 'opad', 'inner', 'outer']);
});

test('buildTrace 含内/外层哈希帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 4);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.ok(last.map!.some((e) => e.key === 'HMAC'));
});
