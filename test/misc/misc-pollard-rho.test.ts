import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pollardRho } from '../../src/algorithms/misc/misc-pollard-rho/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-pollard-rho/trace.ts';
test('8051 = 83 * 97', () => {
  const f = pollardRho(8051);
  assert.equal(8051 % f, 0);
  assert.ok(f > 1 && f < 8051);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
