import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tdLambda,
  lambdaReturn,
  nStepReturn,
  type Episode,
} from '../../src/algorithms/ai-search/ais-temporal-difference/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-temporal-difference/trace.ts';

const ep: Episode = { states: [0, 1, 2], rewards: [1, 0] }; // 0->1(r=1)->2(终态)

test('ais-temporal-difference n 步回报', () => {
  const V = new Float64Array([0, 0, 0]);
  // n=1 from t=0: r=1 + γ·V(1)=1
  assert.ok(Math.abs(nStepReturn(ep, 0, 1, V, 0.9) - 1) < 1e-9);
  // n=2 from t=0: 1 + γ·0 + γ²·V(2)=1
  assert.ok(Math.abs(nStepReturn(ep, 0, 2, V, 0.9) - 1) < 1e-9);
});

test('ais-temporal-difference λ=0 退化为 TD(0)', () => {
  // λ=0：G_t^λ = G_t^{(1)} = n 步回报
  const V = new Float64Array([0.5, 0.5, 0]);
  const g = lambdaReturn(ep, 0, V, 0.9, 0);
  assert.ok(Math.abs(g - (1 + 0.9 * 0.5)) < 1e-9);
});

test('ais-temporal-difference λ=1 退化为 MC', () => {
  const V = new Float64Array([0, 0, 0]);
  const g = lambdaReturn(ep, 0, V, 0.9, 1);
  // MC：总回报 = 1
  assert.ok(Math.abs(g - 1) < 1e-9);
});

test('ais-temporal-difference 训练收敛', () => {
  // ep: 0->1(r=1)->2(r=0,终止). V(1)=0, V(0)=1+γ·0=1
  const V = tdLambda(3, [ep], { gamma: 0.9, lambda: 0.5, alpha: 0.3, episodes: 500 });
  assert.ok(Math.abs(V[0]! - 1) < 0.1, `V(0)=${V[0]}`);
  assert.ok(Math.abs(V[1]!) < 0.1, `V(1)=${V[1]}`);
});

test('ais-temporal-difference trace', () => {
  assert.ok(buildTrace().length > 2);
});
