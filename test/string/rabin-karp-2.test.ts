import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarp2 } from '../../src/algorithms/string/rabin-karp-2/impl.ts';

test('rabinKarp2 二维匹配', () => {
  const text = ['ABCABC', 'DEFDEF', 'ABCABC'];
  const pat = ['ABC', 'DEF'];
  assert.deepEqual(rabinKarp2(text, pat), [
    [0, 0],
    [0, 3],
  ]);
});

test('rabinKarp2 无匹配', () => {
  const text = ['ABCD', 'EFGH'];
  assert.deepEqual(rabinKarp2(text, ['XYZ']), []);
});

test('rabinKarp2 单格', () => {
  const text = ['AB', 'CD'];
  assert.deepEqual(rabinKarp2(text, ['A']), [[0, 0]]);
  assert.deepEqual(rabinKarp2(text, ['D']), [[1, 1]]);
});

test('rabinKarp2 钩子被调用', () => {
  let verifies = 0;
  let founds = 0;
  rabinKarp2(['ABCABC', 'DEFDEF', 'ABCABC'], ['ABC', 'DEF'], {
    onVerify: () => verifies++,
    onFound: () => founds++,
  });
  assert.ok(verifies >= 2, '应至少校验两次');
  assert.equal(founds, 2);
});
