import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDota2 } from '../../src/algorithms/greedy/greedy-dota2-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dota2-2/trace.ts';

test('dota2 "RD" → Radiant', () => {
  assert.equal(greedyDota2('RD').winner, 'Radiant');
});

test('dota2 "RDD" → Dire', () => {
  assert.equal(greedyDota2('RDD').winner, 'Dire');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
