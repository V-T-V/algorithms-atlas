import { test } from 'node:test';
import assert from 'node:assert/strict';
import { failureFunction } from '../../src/algorithms/string/failure-function/impl.ts';

test('failureFunction 基本前缀函数', () => {
  // 'ABABCABAB' 的 π 数组：0,0,1,2,0,1,2,3,4
  assert.deepEqual(failureFunction('ABABCABAB'), [0, 0, 1, 2, 0, 1, 2, 3, 4]);
  // 全相同字符：0,1,2,...,m-1
  assert.deepEqual(failureFunction('AAAA'), [0, 1, 2, 3]);
  // 无重复前缀
  assert.deepEqual(failureFunction('ABCDE'), [0, 0, 0, 0, 0]);
});

test('failureFunction 空串与单字符', () => {
  assert.deepEqual(failureFunction(''), []);
  assert.deepEqual(failureFunction('A'), [0]);
});

test('failureFunction 钩子被调用', () => {
  let sets = 0;
  let fallbacks = 0;
  const fail = failureFunction('AABAACAABAA', {
    onSet: () => sets++,
    onFallback: () => fallbacks++,
  });
  assert.ok(sets > 0);
  assert.deepEqual(fail.length, 11);
});

test('failureFunction 周期性', () => {
  // 'ababab' 的 π：0,0,1,2,3,4；最短周期 = 6 - π[5] = 2
  const fail = failureFunction('ababab');
  assert.deepEqual(fail, [0, 0, 1, 2, 3, 4]);
});
