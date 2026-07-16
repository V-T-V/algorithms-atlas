import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fnv1a,
  fnv1aBatch,
  FNV_OFFSET_BASIS_32,
  FNV_PRIME_32,
} from '../../src/algorithms/hashing/fnv-hash/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/fnv-hash/trace.ts';

test('fnv-hash 空字符串返回 offset basis', () => {
  // 空输入不进入循环，hash 保持初值
  assert.equal(fnv1a(''), FNV_OFFSET_BASIS_32);
});

test('fnv-hash 已知向量 foobar', () => {
  // 经典 FNV-1a 32-bit 测试向量
  assert.equal(fnv1a('foobar'), 0xbf9cf968);
  assert.equal(fnv1a('foobar'), 3214735720);
});

test('fnv-hash 已知向量 a', () => {
  assert.equal(fnv1a('a'), 0xe40c292c);
});

test('fnv-hash 已知向量 hello', () => {
  assert.equal(fnv1a('hello'), 0x4f9f2cab);
});

test('fnv-hash 确定性', () => {
  assert.equal(fnv1a('foobar'), fnv1a('foobar'));
  assert.equal(fnv1a('test123'), fnv1a('test123'));
});

test('fnv-hash 雪崩：相近输入哈希大不同', () => {
  const h1 = fnv1a('hello');
  const h2 = fnv1a('Hello'); // 仅首字母大小写不同
  assert.notEqual(h1, h2);
  // 32 位差异应较大（至少 8 位不同）
  const diff = (h1 ^ h2) >>> 0;
  assert.ok(diff > 0xffff, '差异位应足够多');
});

test('fnv-hash 字节数组与字符串一致', () => {
  // "ab" -> bytes [97, 98]
  assert.equal(fnv1a('ab'), fnv1a([97, 98]));
});

test('fnv-hash 字节数组已知向量', () => {
  // "foobar" = [102,111,111,98,97,114]
  assert.equal(fnv1a([102, 111, 111, 98, 97, 114]), 0xbf9cf968);
});

test('fnv-hash 范围合法 (32-bit unsigned)', () => {
  for (const s of ['', 'x', 'hello', 'foobar', 'a longer string input']) {
    const h = fnv1a(s);
    assert.ok(h >= 0 && h <= 0xffffffff, `${s}: ${h} 应在 [0, 2^32)`);
    assert.equal(h, h >>> 0);
  }
});

test('fnv-hash FNV 常量正确', () => {
  assert.equal(FNV_OFFSET_BASIS_32, 0x811c9dc5);
  assert.equal(FNV_OFFSET_BASIS_32, 2166136261);
  assert.equal(FNV_PRIME_32, 0x01000193);
  assert.equal(FNV_PRIME_32, 16777619);
});

test('fnv-hash 批量', () => {
  const results = fnv1aBatch(['a', 'b', 'c']);
  assert.equal(results.length, 3);
  assert.equal(results[0], fnv1a('a'));
  assert.notEqual(results[0], results[1]);
});

test('fnv-hash 钩子被调用', () => {
  let octets = 0;
  let results = 0;
  let lastHash = -1;
  fnv1a('foo', {
    onOctet: (_i, _b, hash) => {
      octets++;
      lastHash = hash;
    },
    onResult: (h) => {
      results++;
      assert.equal(h, lastHash);
    },
  });
  assert.equal(octets, 3);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace('foo');
  // 初始 + 3 字节 + 终态 = 至少 5 帧
  assert.ok(frames.length >= 5);
  for (const f of frames) assert.ok(f.aux, '每帧应有 aux');
  const last = frames[frames.length - 1]!;
  const finalHash = last.aux!.find((e) => e.label === '最终 hash');
  assert.ok(finalHash, '终帧应有最终 hash');
  // "foo" 的 FNV-1a 32-bit = 0xa9f37ed7
  assert.equal(finalHash!.value, '0xa9f37ed7');
});
