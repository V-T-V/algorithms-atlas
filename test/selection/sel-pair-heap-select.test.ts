import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairingHeapSelect } from '../../src/algorithms/selection/sel-pair-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-pair-heap-select/trace.ts';

test('pairing-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(pairingHeapSelect(a, k), k);
});
test('pairing-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
