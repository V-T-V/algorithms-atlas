import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  splitMix64,
  splitMixStream,
} from '../../src/algorithms/randomized/rand-hash-mixer/impl.ts';

test('splitMix64 确定性', () => {
  const a = splitMix64(1n);
  const b = splitMix64(1n);
  assert.equal(a, b);
});

test('splitMix64 不同输入产生不同输出', () => {
  const a = splitMix64(1n);
  const b = splitMix64(2n);
  assert.notEqual(a, b);
});

test('splitMix64 在 64 位范围内', () => {
  const MASK = (1n << 64n) - 1n;
  for (let i = 0; i < 100; i++) {
    const v = splitMix64(BigInt(i));
    assert.ok(v >= 0n && v <= MASK);
  }
});

test('splitMixStream 长度正确', () => {
  const s = splitMixStream(42n, 10);
  assert.equal(s.length, 10);
});

test('splitMixStream 相邻值不同', () => {
  const s = splitMixStream(0n, 5);
  for (let i = 1; i < s.length; i++) {
    assert.notEqual(s[i - 1], s[i]);
  }
});

test('splitMix64 已知向量（splitmix64 规范）', () => {
  // splitmix64 种子 0 → 第一个输出 0xE220A8397B1DCDAFn
  const s = splitMixStream(0n, 1);
  assert.equal(s[0], 0xe220a8397b1dcdafn);
});
