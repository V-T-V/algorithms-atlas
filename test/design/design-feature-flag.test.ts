import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FeatureFlags } from '../../src/algorithms/design/design-feature-flag/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-feature-flag/trace.ts';

test('flag boolean 开关', () => {
  const ff = new FeatureFlags();
  ff.setBoolean('a', true);
  assert.equal(ff.isEnabled('a'), true);
  ff.setBoolean('a', false);
  assert.equal(ff.isEnabled('a'), false);
});
test('flag 缺省返回 false', () => {
  const ff = new FeatureFlags();
  assert.equal(ff.isEnabled('nope'), false);
});
test('flag 百分比确定性（同用户）', () => {
  const ff = new FeatureFlags();
  ff.setPercent('exp', 50);
  const a = ff.isEnabled('exp', 'user-1');
  const b = ff.isEnabled('exp', 'user-1');
  assert.equal(a, b);
});
test('flag trace 非空', () => assert.ok(buildTrace().length > 0));
