import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PolyHash,
  rollingWindows,
  substringsEqual,
  DEFAULT_BASE,
  DEFAULT_PRIME,
} from '../../src/algorithms/hashing/polynomial-rolling-hash-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/polynomial-rolling-hash-impl/trace.ts';

test('PolyHash 子串哈希确定性', () => {
  const h = new PolyHash('abcdef');
  assert.equal(h.hashOf(0, 3), h.hashOf(0, 3));
});

test('PolyHash 相同子串哈希相等', () => {
  const h = new PolyHash('abcabc');
  assert.equal(h.hashOf(0, 3), h.hashOf(3, 6));
});

test('PolyHash 不同子串哈希大概率不同', () => {
  const h = new PolyHash('abcdef');
  assert.notEqual(h.hashOf(0, 3), h.hashOf(1, 4));
});

test('PolyHash 全串哈希 = hashOf(0,n)', () => {
  const h = new PolyHash('hello');
  assert.equal(h.hashOf(0, 5), h.hashPrefix(5));
});

test('PolyHash 哈希在 [0,P) 范围内', () => {
  const h = new PolyHash('The quick brown fox jumps over the lazy dog');
  const v = h.hashOf(0, 10);
  assert.ok(v >= 0 && v < DEFAULT_PRIME);
});

test('PolyHash 非法区间抛错', () => {
  const h = new PolyHash('abc');
  assert.throws(() => h.hashOf(-1, 2));
  assert.throws(() => h.hashOf(2, 2));
  assert.throws(() => h.hashOf(0, 5));
});

test('rollingWindows 长度正确', () => {
  const r = rollingWindows('abcabcabc', 3);
  assert.equal(r.length, 7);
});

test('rollingWindows 重复子串哈希相同', () => {
  const r = rollingWindows('abcabcabc', 3);
  // abc 在 0,3,6
  assert.equal(r[0], r[3]);
  assert.equal(r[0], r[6]);
});

test('rollingWindows 不同窗口哈希不同', () => {
  const r = rollingWindows('abcdef', 3);
  assert.notEqual(r[0], r[1]);
});

test('substringsEqual 真子串相等', () => {
  assert.equal(substringsEqual('abcabc', 0, 3, 'abcabc', 3, 6), true);
  assert.equal(substringsEqual('hello', 0, 2, 'world', 0, 2), false);
  assert.equal(substringsEqual('test', 1, 4, 'best', 1, 4), true); // 'est' == 'est'
});

test('substringsEqual 长度不同返回 false', () => {
  assert.equal(substringsEqual('abc', 0, 2, 'abc', 0, 3), false);
});

test('rollingWindows 非法窗口抛错', () => {
  assert.throws(() => rollingWindows('ab', 0));
  assert.throws(() => rollingWindows('ab', 5));
});

test('rollingWindows 钩子触发 onRoll', () => {
  let rolls = 0;
  rollingWindows('abcabc', 3, DEFAULT_BASE, DEFAULT_PRIME, { onRoll: () => rolls++ });
  assert.equal(rolls, 3); // n-w = 6-3 = 3 次滚动
});

test('PolyHash 字节数组输入', () => {
  const h = new PolyHash([97, 98, 99]); // 'abc'
  assert.ok(h.hashOf(0, 3) >= 0);
});

test('buildTrace 含 array 与 aux，末帧含不同哈希数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '不同哈希数');
  assert.ok(c, '末帧应含不同哈希数');
});
