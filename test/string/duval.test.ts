import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duval } from '../../src/algorithms/string/duval/impl.ts';

test('duval 基本 Lyndon 分解', () => {
  // 'abcabcab' → ['abc', 'abc', 'ab']
  const f = duval('abcabcab');
  assert.deepEqual(
    f.map((x) => x.text),
    ['abc', 'abc', 'ab'],
  );
  // 因子字典序非递增
  for (let i = 1; i < f.length; i++) assert.ok(f[i - 1]!.text >= f[i]!.text);
});

test('duval 全相同', () => {
  // 'aaaa' → ['a','a','a','a']（每个单字符都是 Lyndon）
  const f = duval('aaaa');
  assert.equal(f.length, 4);
  assert.deepEqual(
    f.map((x) => x.text),
    ['a', 'a', 'a', 'a'],
  );
});

test('duval 区间正确', () => {
  const f = duval('abcabcab');
  // 区间连续覆盖 [0,8)
  assert.equal(f[0]!.start, 0);
  assert.equal(f[f.length - 1]!.end, 8);
});

test('duval 边界', () => {
  assert.deepEqual(duval(''), []);
  assert.deepEqual(
    duval('a').map((x) => x.text),
    ['a'],
  );
});

test('duval 钩子', () => {
  let factors = 0;
  duval('abcabcab', { onFactor: () => factors++ });
  assert.equal(factors, 3);
});
