import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarpSearch, polyHash } from '../../src/algorithms/string/rabin-karp-rolling/impl.ts';

test('RK 基本命中', () => {
  assert.deepEqual(
    rabinKarpSearch('AABAACAADAABAABA', 'AABA').sort((a, b) => a - b),
    [0, 9, 12],
  );
  assert.deepEqual(rabinKarpSearch('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
});

test('RK 多次命中', () => {
  assert.deepEqual(
    rabinKarpSearch('aaaa', 'aa').sort((a, b) => a - b),
    [0, 1, 2],
  );
  assert.deepEqual(
    rabinKarpSearch('ababab', 'ab').sort((a, b) => a - b),
    [0, 2, 4],
  );
});

test('RK 不命中', () => {
  assert.deepEqual(rabinKarpSearch('hello', 'world'), []);
  assert.deepEqual(rabinKarpSearch('abcdef', 'xyz'), []);
});

test('RK 空模式', () => {
  assert.deepEqual(rabinKarpSearch('abc', ''), [0]);
});

test('RK 模式比文本长', () => {
  assert.deepEqual(rabinKarpSearch('ab', 'abc'), []);
});

test('polyHash 相同串同哈希', () => {
  assert.equal(polyHash('hello'), polyHash('hello'));
  assert.notEqual(polyHash('hello'), polyHash('hellp'));
});

test('RK 与 indexOf 对照', () => {
  const text = 'the quick brown fox the quick';
  const positions: number[] = [];
  let idx = text.indexOf('quick');
  while (idx >= 0) {
    positions.push(idx);
    idx = text.indexOf('quick', idx + 1);
  }
  assert.deepEqual(
    rabinKarpSearch(text, 'quick').sort((a, b) => a - b),
    positions,
  );
});

test('RK 单字符匹配', () => {
  assert.deepEqual(
    rabinKarpSearch('abcabc', 'c').sort((a, b) => a - b),
    [2, 5],
  );
});

test('RK 全相同长串', () => {
  const text = 'a'.repeat(100);
  const res = rabinKarpSearch(text, 'a'.repeat(10));
  assert.equal(res.length, 91);
});
