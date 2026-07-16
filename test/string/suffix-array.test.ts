import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suffixArray, buildHeight } from '../../src/algorithms/string/suffix-array/impl.ts';

test('suffixArray 空串', () => {
  const { sa, rank } = suffixArray('');
  assert.deepEqual(sa, []);
  assert.deepEqual(rank, []);
});

test('suffixArray banana 经典', () => {
  // "banana" 的后缀按字典序：
  // a, ana, anana, banana, na, nana → 起点 5,3,1,0,4,2
  const { sa, rank } = suffixArray('banana');
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
  // sa 与 rank 互逆
  for (let i = 0; i < sa.length; i++) {
    assert.equal(rank[sa[i]!], i);
  }
});

test('suffixArray SA 有序', () => {
  for (const s of ['banana', 'mississippi', 'abracadabra', 'aaaa', 'abababab']) {
    const { sa } = suffixArray(s);
    // 相邻后缀字典序非降
    for (let r = 1; r < sa.length; r++) {
      assert.ok(s.slice(sa[r - 1]!) <= s.slice(sa[r]!), `"${s}" SA 在 ${r} 处乱序`);
    }
  }
});

test('suffixArray 与朴素排序一致', () => {
  const s = 'abracadabra';
  const naive = s
    .split('')
    .map((_, i) => i)
    .sort((a, b) => {
      const sa = s.slice(a);
      const sb = s.slice(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
  const { sa } = suffixArray(s);
  assert.deepEqual(sa, naive);
});

test('suffixArray 重复字符', () => {
  // "aaaa" 后缀：起点 3,2,1,0（最短的排最前）
  assert.deepEqual(suffixArray('aaaa').sa, [3, 2, 1, 0]);
});

test('buildHeight Kasai 正确', () => {
  // banana: SA=[5,3,1,0,4,2], rank 互逆
  const { sa, rank } = suffixArray('banana');
  const height = buildHeight('banana', sa, rank);
  // height[0]=0；其后依次为相邻后缀 LCP
  // 已知 banana 的 LCP 数组为 [0,1,3,0,0,2]
  assert.deepEqual(height, [0, 1, 3, 0, 0, 2]);
});

test('suffixArray 钩子被调用', () => {
  let rounds = 0;
  let sorts = 0;
  let done = 0;
  suffixArray('mississippi', {
    onRound: () => rounds++,
    onSort: () => sorts++,
    onDone: () => done++,
  });
  assert.ok(rounds >= 1, '至少一轮倍增');
  assert.ok(sorts >= 1);
  assert.equal(done, 1);
});
