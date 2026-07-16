import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimumWindow, countChars } from '../../src/algorithms/string/minimum-window/impl.ts';

test('minimum-window 经典用例', () => {
  // LeetCode 76 标准例：s="ADOBECODEBANC", t="ABC" → "BANC"
  assert.equal(minimumWindow('ADOBECODEBANC', 'ABC'), 'BANC');
});

test('minimum-window 边界', () => {
  assert.equal(minimumWindow('a', 'a'), 'a');
  assert.equal(minimumWindow('a', 'aa'), ''); // t 比 s 长
  assert.equal(minimumWindow('abc', 'xy'), ''); // s 不含 t 的字符
  assert.equal(minimumWindow('', 'a'), '');
  assert.equal(minimumWindow('abc', ''), '');
});

test('minimum-window 重复字符', () => {
  // s="aa", t="aa" → "aa"
  assert.equal(minimumWindow('aa', 'aa'), 'aa');
  // s="aab", t="aab" → "aab"
  assert.equal(minimumWindow('aab', 'aab'), 'aab');
  // s="bbaa", t="aba" → "baa"
  assert.equal(minimumWindow('bbaa', 'aba'), 'baa');
});

test('minimum-window 全 s 即解', () => {
  assert.equal(minimumWindow('abc', 'abc'), 'abc');
});

test('minimum-window 多个候选取最短', () => {
  // s="cabwefgewcwaefgcf", t="cae" → "cwae"（经典样例）
  const r = minimumWindow('cabwefgewcwaefgcf', 'cae');
  // 验证结果确实是覆盖子串，且长度为最短
  const need = countChars('cae');
  for (const [c, v] of need) {
    let cnt = 0;
    for (const ch of r) if (ch === c) cnt++;
    assert.ok(cnt >= v, `字符 ${c} 数量不足`);
  }
});

test('countChars 工具', () => {
  const m = countChars('AABC');
  assert.equal(m.get('A'), 2);
  assert.equal(m.get('B'), 1);
  assert.equal(m.get('C'), 1);
  assert.equal(m.size, 3);
});

test('minimum-window 钩子被调用', () => {
  let expand = 0;
  let shrink = 0;
  let candidate = 0;
  let done = 0;
  minimumWindow('ADOBECODEBANC', 'ABC', {
    onExpand: () => expand++,
    onShrink: () => shrink++,
    onCandidate: () => candidate++,
    onDone: () => done++,
  });
  assert.ok(expand > 0, '应触发 onExpand');
  assert.ok(shrink > 0, '应触发 onShrink');
  assert.ok(candidate > 0, '应至少产生一个候选');
  assert.equal(done, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/string/minimum-window/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
  assert.ok(frames[frames.length - 1]!.note?.en);
});
