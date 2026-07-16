import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyReorganize2 } from '../../src/algorithms/greedy/greedy-reorganize-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-reorganize-2/trace.ts';

test('reorganize "aab" 可行', () => {
  const r = greedyReorganize2('aab');
  assert.equal(r.ok, true);
  for (let i = 1; i < r.value.length; i++) assert.notEqual(r.value[i], r.value[i - 1]);
});

test('reorganize "aaab" 不可行', () => {
  const r = greedyReorganize2('aaab');
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
