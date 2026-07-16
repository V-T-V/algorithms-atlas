import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  palindromeList,
  type PalindromeListHooks,
} from '../../src/algorithms/list/palindrome-list/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/list/palindrome-list/trace.ts';
import { meta } from '../../src/algorithms/list/palindrome-list/meta.ts';

test('palindrome-list 回文判定正确', () => {
  assert.equal(palindromeList(buildList([])), true);
  assert.equal(palindromeList(buildList([1])), true);
  assert.equal(palindromeList(buildList([1, 1])), true);
  assert.equal(palindromeList(buildList([1, 2])), false);
  assert.equal(palindromeList(buildList(DEFAULT_INPUT)), true); // [1,2,3,2,1]
  assert.equal(palindromeList(buildList([1, 2, 2, 1])), true);
  assert.equal(palindromeList(buildList([1, 2, 3, 4, 5])), false);
  assert.equal(palindromeList(buildList([1, 2, 3, 2, 2])), false);
});

test('palindrome-list 钩子被调用', () => {
  let steps = 0;
  let compares = 0;
  let result: boolean | null = null;
  const hooks: PalindromeListHooks = {
    onStep: () => steps++,
    onCompare: () => compares++,
    onResult: (r) => {
      result = r;
    },
  };
  palindromeList(buildList([1, 2, 3, 2, 1]), hooks);
  assert.ok(steps > 0, '快慢指针应走步');
  assert.ok(compares > 0, '应有比较');
  assert.equal(result, true);
});

test('palindrome-list 奇偶长度均正确', () => {
  assert.equal(palindromeList(buildList([1, 2, 1])), true); // 奇
  assert.equal(palindromeList(buildList([1, 2, 2, 1])), true); // 偶
  assert.equal(palindromeList(buildList([1, 2, 3])), false);
  assert.equal(palindromeList(buildList([1, 2, 3, 4])), false);
});

test('palindrome-list trace 末帧含判定结果', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 1);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array, '末帧应有数组');
  assert.ok(last.aux, '末帧应有 aux');
  const verdict = last.aux!.find((e) => e.label === '判定');
  assert.ok(verdict, '应有判定条目');
  assert.ok(verdict!.value.includes('回文'), '判定值应含「回文」');
});

test('palindrome-list meta 信息真实', () => {
  assert.equal(meta.id, 'palindrome-list');
  assert.equal(meta.categoryId, 'list');
  assert.ok(!meta.summary.zh.includes('待补充'));
  assert.ok(!meta.tags.includes('todo'));
  assert.equal(meta.complexity.time, 'O(n)');
  assert.equal(meta.complexity.space, 'O(1)');
});
