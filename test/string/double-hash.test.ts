import { test } from 'node:test';
import assert from 'node:assert/strict';
import { doubleHash, subHashDouble } from '../../src/algorithms/string/double-hash/impl.ts';

test('doubleHash 双哈希相等性', () => {
  const s = 'abababab';
  const res = doubleHash(s);
  // 'ab' 在 0,2,4,6 处
  const h0 = subHashDouble(res, 0, 1);
  const h2 = subHashDouble(res, 2, 3);
  const h4 = subHashDouble(res, 4, 5);
  assert.deepEqual(h0, h2);
  assert.deepEqual(h2, h4);
  // 不同子串
  const hAb = subHashDouble(res, 0, 1);
  const hBa = subHashDouble(res, 1, 2);
  assert.notDeepEqual(hAb, hBa);
});

test('doubleHash 空串与长度', () => {
  const res = doubleHash('');
  assert.equal(res.n, 0);
  assert.equal(res.prefix1.length, 1);
  assert.equal(res.prefix1[0], 0);
  assert.equal(res.prefix2[0], 0);
});

test('doubleHash 钩子被调用', () => {
  let steps = 0;
  let done = 0;
  doubleHash('abc', {
    onStep: () => steps++,
    onDone: () => done++,
  });
  assert.equal(steps, 3);
  assert.equal(done, 1);
});

test('doubleHash 两套哈希不同（独立基数）', () => {
  const res = doubleHash('abc');
  // prefix1[3] 与 prefix2[3] 通常不同（不同 BASE/MOD）
  assert.notEqual(res.prefix1[3], res.prefix2[3]);
});
