import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zFunction, exKmp } from '../../src/algorithms/string/ex-kmp/impl.ts';

test('zFunction 基本值', () => {
  assert.deepEqual(zFunction('aaaaa'), [0, 4, 3, 2, 1]);
  assert.deepEqual(zFunction('aaabaab'), [0, 2, 1, 0, 2, 1, 0]);
  assert.deepEqual(zFunction('abacaba'), [0, 0, 1, 0, 3, 0, 1]);
  assert.deepEqual(zFunction(''), []);
  assert.deepEqual(zFunction('a'), [0]);
});

test('exKmp 返回每个文本位置的 LCP', () => {
  // text="aaaaa" pat="aa" -> ext=[2,2,2,2,1]
  assert.deepEqual(exKmp('aaaaa', 'aa'), [2, 2, 2, 2, 1]);
  assert.deepEqual(exKmp('abacaba', 'ab'), [2, 0, 1, 0, 2, 0, 1]);
});

test('exKmp 钩子被调用', () => {
  let sets = 0;
  zFunction('aaaaa', { onSetZ: () => sets++ });
  assert.equal(sets, 4, '应设置 4 个 z 值（z[0] 不设）');
});
