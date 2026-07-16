import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mapReduceWordCount,
  mapWordCount,
  reduceWordCount,
} from '../../src/algorithms/concurrency/conc-map-reduce-wordcount/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-map-reduce-wordcount/trace.ts';

test('conc-map-reduce-wordcount 基本统计', () => {
  const r = mapReduceWordCount('a b a c a b', 2);
  assert.equal(r.total.get('a'), 3);
  assert.equal(r.total.get('b'), 2);
  assert.equal(r.total.get('c'), 1);
});

test('conc-map-reduce-wordcount 分片数正确', () => {
  const r = mapReduceWordCount('one two three four', 3);
  assert.equal(r.perShard.length, 3);
});

test('conc-map-reduce-wordcount map+reduce 一致', () => {
  const m1 = mapWordCount(0, 'a a b');
  const m2 = mapWordCount(1, 'b c');
  const total = reduceWordCount([m1, m2]);
  assert.equal(total.get('a'), 2);
  assert.equal(total.get('b'), 2);
  assert.equal(total.get('c'), 1);
});

test('conc-map-reduce-wordcount 大小写无关', () => {
  const r = mapReduceWordCount('The the THE', 1);
  assert.equal(r.total.get('the'), 3);
});

test('conc-map-reduce-wordcount trace', () => {
  assert.ok(buildTrace().length > 2);
});
