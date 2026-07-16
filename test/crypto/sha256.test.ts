import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from '../../src/algorithms/crypto/sha256/impl.ts';

test('SHA-256 空串', () => {
  assert.equal(sha256(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

test('SHA-256 "abc"', () => {
  assert.equal(sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('SHA-256 输出长度 64 hex', () => {
  assert.equal(sha256('hello world').length, 64);
  assert.match(sha256('test'), /^[0-9a-f]{64}$/);
});

test('SHA-256 雪崩效应（微小改变 → 完全不同）', () => {
  const a = sha256('message');
  const b = sha256('messagf'); // 改 1 字符
  assert.notEqual(a, b);
});

test('SHA-256 确定性', () => {
  assert.equal(sha256('same'), sha256('same'));
});

test('SHA-256 钩子被调用', () => {
  let blocks = 0;
  sha256('abc', { onBlock: () => blocks++ });
  assert.ok(blocks >= 1);
});
