import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  monteCarloIntegrate2d,
  makeRng,
} from '../../src/algorithms/randomized/rand-monte-carlo-integration-2d/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-monte-carlo-integration-2d/trace.ts';

test('rand-monte-carlo-integration-2d 单位圆面积≈π', () => {
  const f = (x: number, y: number): boolean => x * x + y * y <= 1;
  const est = monteCarloIntegrate2d(f, { x0: -1, x1: 1, y0: -1, y1: 1 }, 20000, makeRng(3));
  assert.ok(Math.abs(est - Math.PI) < 0.2, `est=${est}`);
});

test('rand-monte-carlo-integration-2d 矩形面积准确', () => {
  const f = (): boolean => true; // 全命中
  const est = monteCarloIntegrate2d(f, { x0: 0, x1: 2, y0: 0, y1: 3 }, 1000, makeRng(1));
  assert.ok(Math.abs(est - 6) < 0.01);
});

test('rand-monte-carlo-integration-2d 空集为零', () => {
  const f = (): boolean => false;
  const est = monteCarloIntegrate2d(f, { x0: 0, x1: 1, y0: 0, y1: 1 }, 100, makeRng(1));
  assert.equal(est, 0);
});

test('rand-monte-carlo-integration-2d trace', () => {
  assert.ok(buildTrace().length > 2);
});
