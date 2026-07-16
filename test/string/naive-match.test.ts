import { test } from 'node:test';
import assert from 'node:assert/strict';
import { naiveMatch } from '../../src/algorithms/string/naive-match/impl.ts';

test('naive-match 基本行为', () => {
  assert.deepEqual(naiveMatch('ABC', ''), []); // 空模式
  assert.deepEqual(naiveMatch('ABC', 'ABCDE'), []); // pat 比 text 长
  assert.deepEqual(naiveMatch('A', 'A'), [0]);
  assert.deepEqual(naiveMatch('ABCDEF', 'CD'), [2]);
});

test('naive-match 多处匹配（含重叠）', () => {
  // 经典重叠：text="AAAAA" pat="AA" → 起点 0,1,2,3
  assert.deepEqual(naiveMatch('AAAAA', 'AA'), [0, 1, 2, 3]);
  // AABAACAADAABAABA 中 AABA 出现 3 次：0, 9, 12
  assert.deepEqual(naiveMatch('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  // 无匹配
  assert.deepEqual(naiveMatch('HELLO WORLD', 'XYZ'), []);
});

test('naive-match 与 slice 朴素一致', () => {
  const text = 'abcababcabcaabcabcab';
  const pat = 'abcab';
  const ref: number[] = [];
  for (let i = 0; i + pat.length <= text.length; i++) {
    if (text.slice(i, i + pat.length) === pat) ref.push(i);
  }
  assert.deepEqual(naiveMatch(text, pat), ref);
});

test('naive-match 钩子被调用', () => {
  let align = 0;
  let compare = 0;
  let found = 0;
  naiveMatch('AABAACAADAABAABA', 'AABA', {
    onAlign: () => align++,
    onCompare: () => compare++,
    onFound: () => found++,
  });
  // n-m+1 = 13 个起点都会 onAlign
  assert.equal(align, 13);
  assert.ok(compare > 0, '应触发 onCompare');
  assert.equal(found, 3);
});

test('naive-match 失配钩子', () => {
  let mismatch = 0;
  naiveMatch('AABA', 'ABB', {
    onMismatch: () => mismatch++,
  });
  assert.ok(mismatch >= 1, '应触发 onMismatch');
});
