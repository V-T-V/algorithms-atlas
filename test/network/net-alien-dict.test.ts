import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alienOrder } from '../../src/algorithms/network/net-alien-dict/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-alien-dict/trace.ts';
test('alienOrder 正确', () => {
  const o = alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']);
  assert.equal(o.length, 5);
  assert.ok(o.indexOf('w') < o.indexOf('e'));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
