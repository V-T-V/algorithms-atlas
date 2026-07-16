import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AhoCorasick } from '../../src/algorithms/parsing/parse-aho-corasick/impl.ts';

test('aho-corasick 多模式', () => {
  const ac = new AhoCorasick(['he', 'she', 'his', 'hers']);
  const got = ac
    .search('ushers')
    .map((h) => `${h.pattern}@${h.at}`)
    .sort();
  assert.deepEqual(got, ['he@2', 'hers@2', 'she@1']);
});
