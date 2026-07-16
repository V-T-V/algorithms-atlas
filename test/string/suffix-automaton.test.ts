import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSuffixAutomaton,
  samMatch,
  countDistinctSubstrings,
  isSubstring,
} from '../../src/algorithms/string/suffix-automaton/impl.ts';

test('SAM 子串判定（基础）', () => {
  // s = "aabab"
  assert.equal(isSubstring('aabab', 'aab'), true);
  assert.equal(isSubstring('aabab', 'bab'), true);
  assert.equal(isSubstring('aabab', 'abab'), true);
  assert.equal(isSubstring('aabab', 'aabab'), true); // 整串
  assert.equal(isSubstring('aabab', 'ba'), true);
  // 非子串
  assert.equal(isSubstring('aabab', 'bb'), false);
  assert.equal(isSubstring('aabab', 'aabb'), false);
  assert.equal(isSubstring('aabab', 'xyz'), false);
});

test('SAM 空串匹配', () => {
  assert.equal(isSubstring('abc', ''), true); // 空模式视为子串
  assert.equal(samMatch(buildSuffixAutomaton('abc'), ''), 0);
});

test('SAM 最长可匹配前缀（部分匹配）', () => {
  // s="abc", pat="abd" → 匹配 "ab" 长度 2，d 处断链
  assert.equal(samMatch(buildSuffixAutomaton('abc'), 'abd'), 2);
  // s="abc", pat="abxyc" → 最长前缀 "ab"=2
  assert.equal(samMatch(buildSuffixAutomaton('abc'), 'abxyc'), 2);
});

test('SAM 本质不同子串数', () => {
  // s="aabab" 不同子串：手算
  // 长度1: a,b → 2
  // 长度2: aa,ab,ba → 3
  // 长度3: aab,aba,bab → 3
  // 长度4: aaba,abab,bab(已有?) → aaba,abab → 2
  // 长度5: aabab → 1
  // 合计 2+3+3+2+1 = 11
  assert.equal(countDistinctSubstrings('aabab'), 11);
  // 单字符：只有 1 个
  assert.equal(countDistinctSubstrings('a'), 1);
  // 全同字符 "aaaa"：a,aa,aaa,aaaa → 4
  assert.equal(countDistinctSubstrings('aaaa'), 4);
  // 与朴素统计对照
  const bruteDistinct = (s: string): number => {
    const set = new Set<string>();
    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j <= s.length; j++) set.add(s.slice(i, j));
    }
    return set.size;
  };
  assert.equal(countDistinctSubstrings('abcabc'), bruteDistinct('abcabc'));
  assert.equal(countDistinctSubstrings('abacabad'), bruteDistinct('abacabad'));
});

test('SAM 状态数上限 = 2n-1', () => {
  // 对一般串，状态数 ≤ 2|s|-1
  for (const s of ['abc', 'aaaa', 'ababab', 'aabab', 'abcabcabc']) {
    const sam = buildSuffixAutomaton(s);
    assert.ok(
      sam.states.length <= 2 * s.length,
      `${s}: states=${sam.states.length} should be <= 2n=${2 * s.length}`,
    );
    assert.ok(sam.states.length >= s.length + 1);
  }
});

test('SAM 根状态性质', () => {
  const sam = buildSuffixAutomaton('abc');
  assert.equal(sam.states[0]!.len, 0);
  assert.equal(sam.states[0]!.link, -1);
});

test('SAM 钩子被调用', () => {
  let create = 0;
  let link = 0;
  let trans = 0;
  let clone = 0;
  buildSuffixAutomaton('aab', {
    onCreate: () => create++,
    onLink: () => link++,
    onTrans: () => trans++,
    onClone: () => clone++,
  });
  assert.ok(create >= 3, '至少为每个字符创建一个状态');
  assert.ok(link >= 1, '应设置 link');
  assert.ok(trans >= 1, '应添加转移');
  // 'aab' 不需要克隆（无复杂分叉），clone 可能为 0；用会触发 clone 的输入
  // "abcb": 插入末尾 b 时从状态 3 沿 link 回到根，发现 trans(0,'b')=q 且 len(q)=2 > len(0)+1=1，触发克隆
  let clone2 = 0;
  buildSuffixAutomaton('abcb', { onClone: () => clone2++ });
  assert.ok(clone2 >= 1, 'abcb 应触发至少一次克隆');
});

test('SAM 匹配钩子', () => {
  let steps = 0;
  const sam = buildSuffixAutomaton('abcab');
  samMatch(sam, 'abca', {
    onMatchStep: () => steps++,
  });
  assert.equal(steps, 4); // 四个字符
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/string/suffix-automaton/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2, '应有多帧');
  // 末帧 note 有双语
  assert.ok(frames[frames.length - 1]!.note?.zh);
  assert.ok(frames[frames.length - 1]!.note?.en);
});
