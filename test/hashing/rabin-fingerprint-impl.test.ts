import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rabinFingerprint,
  rabinKarpSearch,
  modPow,
  DEFAULT_BASE,
  DEFAULT_PRIME,
} from '../../src/algorithms/hashing/rabin-fingerprint-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/rabin-fingerprint-impl/trace.ts';

test('rabinFingerprint 确定性', () => {
  assert.equal(rabinFingerprint('hello'), rabinFingerprint('hello'));
});

test('rabinFingerprint 不同输入大概率不同', () => {
  assert.notEqual(rabinFingerprint('hello'), rabinFingerprint('world'));
});

test('rabinFingerprint 在 [0, P) 范围内', () => {
  const h = rabinFingerprint('The quick brown fox');
  assert.ok(h >= 0 && h < DEFAULT_PRIME);
});

test('modPow 正确（费马小性验证）', () => {
  // 2^(P-1) mod P == 1 when P prime and gcd(2,P)=1
  const r = modPow(2, DEFAULT_PRIME - 1, DEFAULT_PRIME);
  assert.equal(r, 1);
});

test('modPow 朴幂一致', () => {
  // 3^5 = 243
  assert.equal(modPow(3, 5, 1_000_000_007), 243);
});

test('rabinKarpSearch 单次匹配', () => {
  const m = rabinKarpSearch('hello world', 'world');
  assert.deepEqual(m, [6]);
});

test('rabinKarpSearch 多次匹配', () => {
  const m = rabinKarpSearch('abracadabra', 'abra');
  assert.deepEqual(m, [0, 7]);
});

test('rabinKarpSearch 无匹配', () => {
  const m = rabinKarpSearch('abcdefg', 'xyz');
  assert.deepEqual(m, []);
});

test('rabinKarpSearch 模式长于文本', () => {
  assert.deepEqual(rabinKarpSearch('ab', 'abc'), []);
});

test('rabinKarpSearch 空模式', () => {
  assert.deepEqual(rabinKarpSearch('abc', ''), []);
});

test('rabinKarpSearch 与朴素搜索结果一致（随机对照）', () => {
  const alpha = 'abc';
  let text = '';
  for (let i = 0; i < 200; i++) text += alpha[Math.floor(Math.random() * 3)];
  for (const pat of ['a', 'ab', 'abc', 'ca', 'aa', 'cab']) {
    const naive: number[] = [];
    for (let i = 0; i + pat.length <= text.length; i++) {
      if (text.slice(i, i + pat.length) === pat) naive.push(i);
    }
    const got = rabinKarpSearch(text, pat);
    assert.deepEqual(got, naive, `pat="${pat}" mismatch`);
  }
});

test('rabinKarpSearch 钩子：onMatch 触发', () => {
  let hits = 0;
  rabinKarpSearch('aaaa', 'aa', DEFAULT_BASE, DEFAULT_PRIME, { onMatch: () => hits++ });
  // 'aaaa' 中 'aa' 出现在 0,1,2
  assert.equal(hits, 3);
});

test('rabinKarpSearch 字节数组输入', () => {
  const text = [0x61, 0x62, 0x63]; // 'abc'
  const m = rabinKarpSearch(text, 'b');
  assert.deepEqual(m, [1]);
});

test('buildTrace 含 array 与 aux，末帧含命中数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '命中数');
  assert.ok(c, '末帧应含命中数');
});
