import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyStamping2 } from '../../src/algorithms/greedy/greedy-stamping-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-stamping-2/trace.ts';

test('stamp "abc","ababc" 可行', () => {
  const r = greedyStamping2('abc', 'ababc');
  assert.equal(r.ok, true);
  assert.ok(r.order.length > 0);
});

test('stamp "ab","a" 不可行', () => {
  const r = greedyStamping2('ab', 'a');
  assert.equal(r.ok, false);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
