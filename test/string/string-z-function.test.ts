import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeZ,
  zPatternSearch,
  distinctSubstrings,
} from '../../src/algorithms/string/string-z-function/impl.ts';

test('computeZ 基本', () => {
  // "aabcaabxaaz": Z = [0,1,0,0,3,1,0,0,2,1,0]（标准例）
  // 实际：Z[1]=1 (a), Z[4]=3 (aab), Z[8]=2 (aa)
  const z = computeZ('aabcaabxaaz');
  assert.equal(z[0], 0);
  assert.equal(z[1], 1);
  assert.equal(z[4], 3);
  assert.equal(z[8], 2);
});

test('computeZ 全相同', () => {
  const z = computeZ('aaaa');
  assert.deepEqual(z, [0, 3, 2, 1]);
});

test('computeZ 全不同', () => {
  const z = computeZ('abcd');
  assert.deepEqual(z, [0, 0, 0, 0]);
});

test('computeZ 空串与单字符', () => {
  assert.deepEqual(computeZ(''), []);
  assert.deepEqual(computeZ('a'), [0]);
});

test('computeZ 与朴素对照', () => {
  const naive = (s: string): number[] => {
    const n = s.length;
    const z = new Array<number>(n).fill(0);
    for (let i = 1; i < n; i++) {
      while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) z[i]!++;
    }
    return z;
  };
  for (const s of ['banana', 'abababab', 'xyzxyz', 'aaaaab', 'mississippi']) {
    assert.deepEqual(computeZ(s), naive(s), s);
  }
});

test('zPatternSearch', () => {
  assert.deepEqual(zPatternSearch('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  assert.deepEqual(
    zPatternSearch('aaaa', 'aa').sort((a, b) => a - b),
    [0, 1, 2],
  );
  assert.deepEqual(zPatternSearch('hello', 'world'), []);
  assert.deepEqual(zPatternSearch('hello', ''), [0]);
});

test('distinctSubstrings', () => {
  // "abc": a,b,c,ab,bc,abc = 6
  assert.equal(distinctSubstrings('abc'), 6);
  // "aaa": a,aa,aaa = 3
  assert.equal(distinctSubstrings('aaa'), 3);
  // "aba": a,b,ab,ba,aba = 5
  assert.equal(distinctSubstrings('aba'), 5);
});
