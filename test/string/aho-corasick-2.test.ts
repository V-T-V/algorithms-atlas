import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ahoCorasick2 } from '../../src/algorithms/string/aho-corasick-2/impl.ts';

test('ahoCorasick2 多模式匹配', () => {
  const res = ahoCorasick2('ushers', ['he', 'she', 'his', 'hers']);
  // 'she' @1, 'he' @2, 'hers' @2
  const got = res.map((r) => [r.start, r.pattern]).sort();
  assert.deepEqual(got, [
    [1, 'she'],
    [2, 'he'],
    [2, 'hers'],
  ]);
});

test('ahoCorasick2 重叠模式', () => {
  const res = ahoCorasick2('aaaa', ['a', 'aa', 'aaa']);
  // 每个位置都命中多个模式
  assert.ok(res.length > 0);
  // 'a' 命中 4 次
  const aHits = res.filter((r) => r.pattern === 'a');
  assert.equal(aHits.length, 4);
});

test('ahoCorasick2 无匹配', () => {
  const res = ahoCorasick2('xyz', ['abc', 'def']);
  assert.equal(res.length, 0);
});

test('ahoCorasick2 边界', () => {
  assert.deepEqual(ahoCorasick2('', ['a']), []);
  assert.deepEqual(ahoCorasick2('abc', []), []);
});

test('ahoCorasick2 钩子被调用', () => {
  let transfers = 0;
  let founds = 0;
  ahoCorasick2('ushers', ['he', 'she', 'hers'], {
    onTransfer: () => transfers++,
    onFound: () => founds++,
  });
  assert.ok(transfers > 0);
  assert.equal(founds, 3);
});
