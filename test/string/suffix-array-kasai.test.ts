import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suffixArrayKasai } from '../../src/algorithms/string/suffix-array-kasai/impl.ts';

test('suffixArrayKasai banana', () => {
  // banana 后缀排序：a, ana, anana, banana, na, nana
  // 起点：5,3,1,0,4,2
  const { sa, height } = suffixArrayKasai('banana');
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
  // height[0]=0; height[i]=LCP(SA[i-1],SA[i])
  // $ vs a:0, a vs ana:1, ana vs anana:3, anana vs banana:0, banana vs na:0
  assert.deepEqual(height, [0, 0, 1, 3, 0, 0]);
});

test('suffixArrayKasai 一致性 rank[sa[i]]=i', () => {
  const { sa, rank } = suffixArrayKasai('mississippi');
  for (let i = 0; i < sa.length; i++) assert.equal(rank[sa[i]!], i);
});

test('suffixArrayKasai height 满足 LCP 定义', () => {
  const s = 'abracadabra';
  const { sa, height } = suffixArrayKasai(s);
  const n = s.length;
  for (let i = 1; i < n; i++) {
    const a = sa[i - 1]!;
    const b = sa[i]!;
    let lcp = 0;
    while (a + lcp < n && b + lcp < n && s[a + lcp] === s[b + lcp]) lcp++;
    assert.equal(height[i], lcp, `height[${i}]`);
  }
});

test('suffixArrayKasai 单字符', () => {
  const { sa, height } = suffixArrayKasai('a');
  assert.deepEqual(sa, [0]);
  assert.deepEqual(height, [0]);
});

test('suffixArrayKasai 全相同字符', () => {
  const { sa, height } = suffixArrayKasai('aaaa');
  assert.deepEqual(sa, [3, 2, 1, 0]);
  assert.deepEqual(height, [0, 1, 2, 3]);
});
