import { test } from 'node:test';
import assert from 'node:assert/strict';
import { networkDelayTime } from '../../src/algorithms/network/net-network-delay/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-network-delay/trace.ts';
test('networkDelayTime 正确', () => {
  assert.equal(
    networkDelayTime(
      [
        [2, 1, 1],
        [2, 3, 1],
        [3, 4, 1],
      ],
      4,
      2,
    ),
    2,
  );
  assert.equal(networkDelayTime([[1, 2, 1]], 2, 2), -1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
