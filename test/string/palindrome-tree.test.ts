import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPalindromeTree,
  countDistinctPalindromes,
  longestPalindromeLength,
} from '../../src/algorithms/string/palindrome-tree/impl.ts';

test('回文树本质不同回文数（基本）', () => {
  // "abacaba": 回文有 a,b,c,aba,aca,bacab,abacaba → 7
  assert.equal(countDistinctPalindromes('abacaba'), 7);
  // 单字符
  assert.equal(countDistinctPalindromes('a'), 1);
  // "aa": a, aa → 2
  assert.equal(countDistinctPalindromes('aa'), 2);
  // "aba": a, b, aba → 3
  assert.equal(countDistinctPalindromes('aba'), 3);
  // 全不同字符 abc → a,b,c → 3
  assert.equal(countDistinctPalindromes('abc'), 3);
});

test('回文树与朴素集合一致', () => {
  const brute = (s: string): number => {
    const set = new Set<string>();
    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j <= s.length; j++) {
        const sub = s.slice(i, j);
        if (sub === [...sub].reverse().join('')) set.add(sub);
      }
    }
    return set.size;
  };
  for (const s of ['abacaba', 'aaaa', 'abcba', 'aabbaa', 'xabay', 'eertree']) {
    assert.equal(countDistinctPalindromes(s), brute(s), `${s}`);
  }
});

test('最长回文子串长度', () => {
  assert.equal(longestPalindromeLength('abacaba'), 7);
  assert.equal(longestPalindromeLength('a'), 1);
  assert.equal(longestPalindromeLength('abc'), 1);
  assert.equal(longestPalindromeLength('aabbaa'), 6);
  assert.equal(longestPalindromeLength('babad'), 3); // bab 或 aba
});

test('回文树根结构', () => {
  const tree = buildPalindromeTree('ab');
  assert.equal(tree.nodes[0]!.len, -1); // 奇根
  assert.equal(tree.nodes[1]!.len, 0); // 偶根
  assert.equal(tree.nodes[0]!.fail, 0); // 奇根 fail 自指
  assert.equal(tree.nodes[1]!.fail, 0); // 偶根 fail 指向奇根
});

test('回文树出现次数（count 传播）', () => {
  // "aaaa": 节点应为 奇根,偶根, "a"(len1), "aa"(len2), "aaa"(len3), "aaaa"(len4)
  const tree = buildPalindromeTree('aaaa');
  // 出现次数："a"=4, "aa"=3, "aaa"=2, "aaaa"=1
  const byLen = new Map<number, number>();
  for (const n of tree.nodes) if (n.len > 0) byLen.set(n.len, n.count);
  assert.equal(byLen.get(1), 4);
  assert.equal(byLen.get(2), 3);
  assert.equal(byLen.get(3), 2);
  assert.equal(byLen.get(4), 1);
});

test('回文树钩子被调用', () => {
  let create = 0;
  let step = 0;
  let done = 0;
  let lastDistinct = -1;
  buildPalindromeTree('abacaba', {
    onCreate: () => create++,
    onStep: () => step++,
    onDone: (d) => {
      done++;
      lastDistinct = d;
    },
  });
  assert.ok(create >= 3, '至少创建若干节点');
  assert.equal(step, 7); // 7 个字符
  assert.equal(done, 1);
  assert.equal(lastDistinct, 7);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/string/palindrome-tree/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
});
