import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eulerStep,
  integrateEuler,
  eulerRichardson,
  trajectory,
} from '../../src/algorithms/numerical/num-euler-richardson/impl.ts';

test('eulerStep 基本一阶步', () => {
  const f = (_t: number, y: number): number => y;
  // y' = y, y(0)=1, h=0.1 → y = 1.1
  assert.ok(Math.abs(eulerStep(f, 0, 1, 0.1) - 1.1) < 1e-9);
});

test("integrateEuler y'=y 逼近 e^t", () => {
  const f = (_t: number, y: number): number => y;
  const y = integrateEuler(f, 0, 1, 1, 1000);
  assert.ok(Math.abs(y - Math.E) < 0.01);
});

test('Richardson 外推比 Euler 更精确', () => {
  const f = (_t: number, y: number): number => y;
  const { coarse, fine, extrapolated } = eulerRichardson(f, 0, 1, 1, 4);
  const exact = Math.E;
  const errC = Math.abs(coarse - exact);
  const errF = Math.abs(fine - exact);
  const errE = Math.abs(extrapolated - exact);
  assert.ok(errE < errC);
  assert.ok(errE < errF);
});

test('trajectory 长度 = steps + 1', () => {
  const f = (_t: number, _y: number): number => 1;
  const tr = trajectory(f, 0, 0, 1, 5);
  assert.equal(tr.length, 6);
  assert.equal(tr[0]!.t, 0);
  assert.ok(Math.abs(tr[5]!.t - 1) < 1e-9);
});

test('integrateEuler 步数非正抛错', () => {
  assert.throws(() => integrateEuler((_t, _y) => 0, 0, 0, 1, 0), RangeError);
});
