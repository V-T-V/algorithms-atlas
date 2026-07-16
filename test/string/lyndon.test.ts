import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lyndon, isLyndon, minRotation } from '../../src/algorithms/string/lyndon/impl.ts';

test('isLyndon 判定', () => {
  assert.equal(isLyndon('abc'), true);
  assert.equal(isLyndon('a'), true);
  assert.equal(isLyndon('aab'), true);
  assert.equal(isLyndon('ba'), false);
  assert.equal(isLyndon('aa'), false); // 非严格（aa 是其自身循环移位）
  assert.equal(isLyndon('bac'), false);
});

test('lyndon 分解', () => {
  const f = lyndon('abcabcab');
  assert.equal(f.length, 3); // abc abc ab
  assert.deepEqual(f, [
    [0, 3],
    [3, 6],
    [6, 8],
  ]);
});

test('minRotation 最小循环移位', () => {
  assert.equal(minRotation('abc'), 0);
  assert.equal(minRotation('bca'), 2); // abc 起点在 index 2
  assert.equal(minRotation('cab'), 1); // abc 起点在 index 1
  // 'dacba' → 最小是 'acbad' 起点 1
  const s = 'dacba';
  const i = minRotation(s);
  assert.equal(s.slice(i) + s.slice(0, i), 'acbad');
});

test('lyndon 钩子', () => {
  let factors = 0;
  lyndon('abcabcab', { onFactor: () => factors++ });
  assert.equal(factors, 3);
});
