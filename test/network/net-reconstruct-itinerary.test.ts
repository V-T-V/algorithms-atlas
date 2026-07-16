import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findItinerary } from '../../src/algorithms/network/net-reconstruct-itinerary/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-reconstruct-itinerary/trace.ts';
test('findItinerary 正确', () => {
  assert.deepEqual(
    findItinerary([
      ['MUC', 'LHR'],
      ['JFK', 'MUC'],
      ['SFO', 'SJC'],
      ['LHR', 'SFO'],
    ]),
    ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
