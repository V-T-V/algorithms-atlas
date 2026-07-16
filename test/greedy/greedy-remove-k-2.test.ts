import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyRemoveK2 } from '../../src/algorithms/greedy/greedy-remove-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-remove-k-2/trace.ts';

test('removeK "1432219",3 → "1219"', () => {
  assert.equal(greedyRemoveK2('1432219', 3).value, '1219');
});

test('removeK "10200",1 → "200"', () => {
  assert.equal(greedyRemoveK2('10200', 1).value, '200');
});

test('removeK "10",2 → "0"', () => {
  assert.equal(greedyRemoveK2('10', 2).value, '0');
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
