import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boyerMoore,
  buildBadCharTable,
  buildGoodSuffixTable,
} from '../../src/algorithms/string/boyer-moore/impl.ts';

test('boyerMoore 基本行为', () => {
  assert.deepEqual(boyerMoore('ABC', ''), []);
  assert.deepEqual(boyerMoore('ABC', 'ABCDE'), []); // pat 比 text 长
  assert.deepEqual(boyerMoore('A', 'A'), [0]);
  assert.deepEqual(boyerMoore('ABCDEF', 'CD'), [2]);
});

test('boyerMoore Wikipedia 经典 EXAMPLE', () => {
  assert.deepEqual(boyerMoore('HERE IS A SIMPLE EXAMPLE', 'EXAMPLE'), [17]);
});

test('boyerMoore 多处匹配（含重叠）', () => {
  assert.deepEqual(boyerMoore('AAAAA', 'AA'), [0, 1, 2, 3]);
  assert.deepEqual(boyerMoore('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  assert.deepEqual(boyerMoore('HELLO WORLD', 'XYZ'), []);
});

test('boyerMoore 与朴素结果一致（随机对照）', () => {
  const text = 'abcababcabcaabcabcabababcababcabab';
  for (const pat of ['ab', 'cab', 'abcab', 'x', 'abcabcabab']) {
    const naive: number[] = [];
    for (let i = 0; i + pat.length <= text.length; i++) {
      if (text.slice(i, i + pat.length) === pat) naive.push(i);
    }
    assert.deepEqual(boyerMoore(text, pat), naive, `pat="${pat}"`);
  }
});

test('boyerMoore 与朴素一致（模糊对照多组）', () => {
  const text = 'abracadabracadabraabracadabra';
  const pats = ['abra', 'cad', 'a', 'racad', 'zzz'];
  for (const pat of pats) {
    const naive: number[] = [];
    for (let i = 0; i + pat.length <= text.length; i++) {
      if (text.slice(i, i + pat.length) === pat) naive.push(i);
    }
    assert.deepEqual(boyerMoore(text, pat), naive);
  }
});

test('buildBadCharTable 最右出现位置', () => {
  const bc = buildBadCharTable('EXAMPLE');
  // E 在 EXAMPLE 中出现于位置 0 和 6，最右 = 6
  assert.equal(bc.get('E'), 6);
  assert.equal(bc.get('X'), 1);
  assert.equal(bc.get('L'), 5);
  // 重复字符取最右
  const bc2 = buildBadCharTable('ABCA');
  assert.equal(bc2.get('A'), 3);
  assert.equal(bc2.get('B'), 1);
});

test('buildGoodSuffixTable 长度等于模式', () => {
  const gs = buildGoodSuffixTable('EXAMPLE');
  assert.equal(gs.length, 7);
  // 失配在末位时（无好后缀），坏字符主导，gs[6] 应为 1
  assert.equal(gs[6], 1);
});

test('boyerMoore 钩子被调用', () => {
  let align = 0;
  let compares = 0;
  let shifts = 0;
  let found = 0;
  boyerMoore('HERE IS A SIMPLE EXAMPLE', 'EXAMPLE', {
    onAlign: () => align++,
    onCompare: () => compares++,
    onShift: () => shifts++,
    onFound: () => found++,
  });
  assert.ok(align >= 1, '至少对齐一次');
  assert.ok(compares >= 1, '至少比较一次');
  assert.ok(shifts >= 1, '至少跳跃一次');
  assert.equal(found, 1);
});
