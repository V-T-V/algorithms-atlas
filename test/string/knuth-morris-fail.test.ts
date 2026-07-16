import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLps, buildNext } from '../../src/algorithms/string/knuth-morris-fail/impl.ts';

test('buildLps 基本例', () => {
  // 'aabaabaaa' 经典例：lps = [0,1,0,1,2,3,4,5,2]
  assert.deepEqual(buildLps('aabaabaaa'), [0, 1, 0, 1, 2, 3, 4, 5, 2]);
});

test('buildLps AAAA', () => {
  assert.deepEqual(buildLps('AAAA'), [0, 1, 2, 3]);
});

test('buildLps ABCDE', () => {
  assert.deepEqual(buildLps('ABCDE'), [0, 0, 0, 0, 0]);
});

test('buildLps AABAACAABAA', () => {
  assert.deepEqual(buildLps('AABAACAABAA'), [0, 1, 0, 1, 2, 0, 1, 2, 3, 4, 5]);
});

test('buildLps 单字符与空串', () => {
  assert.deepEqual(buildLps('a'), [0]);
  assert.deepEqual(buildLps(''), []);
});

test('buildLps 与朴素对照', () => {
  const naive = (pat: string): number[] => {
    const m = pat.length;
    const lps = new Array<number>(m).fill(0);
    for (let i = 1; i < m; i++) {
      // 暴力：枚举长度
      for (let len = i; len >= 1; len--) {
        let ok = true;
        for (let k = 0; k < len; k++) {
          if (pat[k] !== pat[i - len + 1 + k]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          lps[i] = len;
          break;
        }
      }
    }
    return lps;
  };
  for (const p of ['abababc', 'aabbaa', 'abacabad', 'mississippi', 'abcabcabc']) {
    assert.deepEqual(buildLps(p), naive(p), p);
  }
});

test('buildNext 约定', () => {
  const next = buildNext('aabaabaaa');
  assert.equal(next[0], -1);
  assert.equal(next[1], 0);
  assert.equal(next[4], 1); // = lps[3]
});

test('buildNext 单字符', () => {
  assert.deepEqual(buildNext('a'), [-1]);
});
