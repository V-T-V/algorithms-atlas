import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSuffixArray,
  longestCommonPrefix,
} from '../../src/algorithms/dp/longest-common-prefix/impl.ts';

// 暴力：直接计算两个后缀的 LCP
function lcpOf(s: string, a: number, b: number): number {
  let h = 0;
  while (a + h < s.length && b + h < s.length && s[a + h] === s[b + h]) h++;
  return h;
}

test('longest-common-prefix 基本行为', () => {
  assert.deepEqual(longestCommonPrefix(''), []);
  assert.deepEqual(longestCommonPrefix('a'), [0]);
});

test('longest-common-prefix banana 经典', () => {
  // banana 的后缀按字典序：
  //   a, ana, anana, banana, na, nana
  // 对应 SA = [5,3,1,0,4,2]
  // LCP(相邻)：lcp[0]=0, a vs ana=1, ana vs anana=3, anana vs banana=0, banana vs na=0, na vs nana=2
  // → [0,1,3,0,0,2]
  const sa = buildSuffixArray('banana');
  assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
  const lcp = longestCommonPrefix('banana', sa);
  assert.deepEqual(lcp, [0, 1, 3, 0, 0, 2]);
});

test('longest-common-prefix 与暴力一致', () => {
  const samples = ['abracadabra', 'mississippi', 'aaaa', 'abcd', 'abababab', 'x'];
  for (const s of samples) {
    const sa = buildSuffixArray(s);
    const lcp = longestCommonPrefix(s, sa);
    assert.equal(lcp.length, s.length, `${s}: 长度应为 n`);
    assert.equal(lcp[0], 0, `${s}: lcp[0]=0`);
    for (let k = 1; k < s.length; k++) {
      const expect = lcpOf(s, sa[k - 1]!, sa[k]!);
      assert.equal(lcp[k], expect, `${s}: lcp[${k}] 期望 ${expect} 实得 ${lcp[k]}`);
    }
  }
});

test('longest-common-prefix 全相同字符', () => {
  // "aaaa"：SA=[3,2,1,0]，LCP=[0,1,2,3]
  const lcp = longestCommonPrefix('aaaa');
  assert.deepEqual(lcp, [0, 1, 2, 3]);
});

test('longest-common-prefix 钩子被调用', () => {
  let visit = 0;
  let fill = 0;
  let maxLcp = -1;
  longestCommonPrefix('banana', buildSuffixArray('banana'), {
    onVisit: () => visit++,
    onFillCell: () => fill++,
    onDone: (_l, m) => {
      maxLcp = m;
    },
  });
  assert.ok(visit >= 1, '应触发 onVisit');
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.equal(maxLcp, 3);
});
