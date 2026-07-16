import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LfPool } from '../../src/algorithms/design/design-leader-followers/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-leader-followers/trace.ts';
test('lf promote 轮转', () => {
  const p = new LfPool();
  p.setSize(3);
  assert.equal(p.currentLeader(), 0);
  assert.equal(p.promote(), 1);
  assert.equal(p.promote(), 2);
  assert.equal(p.promote(), 0);
});
test('lf trace 非空', () => assert.ok(buildTrace().length > 0));
