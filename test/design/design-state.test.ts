import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VendingContext, IdleState } from '../../src/algorithms/design/design-state/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-state/trace.ts';

test('state idle 投币进入 hasCoin', () => {
  const ctx = new VendingContext(new IdleState());
  ctx.insertCoin();
  assert.equal(ctx.state.name, 'hasCoin');
  assert.equal(ctx.coins, 1);
});
test('state hasCoin 出货后回 idle', () => {
  const ctx = new VendingContext(new IdleState());
  ctx.insertCoin();
  ctx.dispense();
  assert.equal(ctx.state.name, 'idle');
  assert.equal(ctx.coins, 0);
});
test('state idle 出货被拒', () => {
  const ctx = new VendingContext(new IdleState());
  assert.equal(ctx.dispense(), '请先投币');
});
test('state 退币清零', () => {
  const ctx = new VendingContext(new IdleState());
  ctx.insertCoin();
  ctx.insertCoin();
  const r = ctx.refund();
  assert.equal(ctx.coins, 0);
  assert.equal(r, '退币 2');
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
