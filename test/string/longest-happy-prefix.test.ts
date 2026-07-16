import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  longestHappyPrefix,
  longestHappyPrefixLength,
  buildLps,
} from '../../src/algorithms/string/longest-happy-prefix/impl.ts';

test('level 最长快乐前缀', () => {
  assert.equal(longestHappyPrefix('level'), 'l');
  assert.equal(longestHappyPrefixLength('level'), 1);
});

test('ababab', () => {
  assert.equal(longestHappyPrefix('ababab'), 'abab');
  assert.equal(longestHappyPrefixLength('ababab'), 4);
});

test('a 长度 1（无真前缀）', () => {
  assert.equal(longestHappyPrefix('a'), '');
  assert.equal(longestHappyPrefixLength('a'), 0);
});

test('aa', () => {
  assert.equal(longestHappyPrefix('aa'), 'a');
});

test('abcabd', () => {
  // 前缀 "ab" 与后缀 "bd" 不同，"a" 与 "d" 不同 → 无快乐前缀
  assert.equal(longestHappyPrefix('abcabd'), '');
});

test('aaaaa', () => {
  assert.equal(longestHappyPrefix('aaaaa'), 'aaaa');
});

test('leetcode', () => {
  // 前缀 le / lee / leet... 后缀 de / ode / code → 无匹配
  assert.equal(longestHappyPrefix('leetcode'), '');
});

test('acccba', () => {
  // 前缀 a / ac ... 后缀 ba / cba / ccba → "a"
  assert.equal(longestHappyPrefix('acccba'), 'a');
});

test('buildLps 完整', () => {
  assert.deepEqual(buildLps('ababab'), [0, 0, 1, 2, 3, 4]);
  assert.deepEqual(buildLps('aaaa'), [0, 1, 2, 3]);
});

test('longestHappyPrefix 与朴素对照', () => {
  const naive = (s: string): string => {
    for (let len = s.length - 1; len >= 1; len--) {
      if (s.slice(0, len) === s.slice(s.length - len)) return s.slice(0, len);
    }
    return '';
  };
  for (const s of ['banana', 'abababab', 'abcabc', 'xyzxyz', 'aabbaa', 'mississippi', 'aabaab']) {
    assert.equal(longestHappyPrefix(s), naive(s), s);
  }
});
