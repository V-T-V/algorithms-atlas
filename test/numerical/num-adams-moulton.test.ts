import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integrateAdamsMoulton } from '../../src/algorithms/numerical/num-adams-moulton/impl.ts';

test("integrateAdamsMoulton y'=y 精确到 e", () => {
  const f = (_t: number, y: number): number => y;
  const out = integrateAdamsMoulton(f, 0, 1, 1, 100);
  const yEnd = out[out.length - 1]!.y;
  assert.ok(Math.abs(yEnd - Math.E) < 1e-4);
});

test("integrateAdamsMoulton y'=cos(t) 到 sin", () => {
  const f = (t: number): number => Math.cos(t);
  const out = integrateAdamsMoulton(f, 0, 0, 1, 100);
  const yEnd = out[out.length - 1]!.y;
  assert.ok(Math.abs(yEnd - Math.sin(1)) < 1e-5);
});

test('步数 < 4 抛错', () => {
  assert.throws(() => integrateAdamsMoulton((_t, _y) => 0, 0, 0, 1, 3), RangeError);
});

test('步数非正抛错', () => {
  assert.throws(() => integrateAdamsMoulton((_t, _y) => 0, 0, 0, 1, 0), RangeError);
});

test('输出长度 = steps + 1', () => {
  const out = integrateAdamsMoulton((_t, y) => y, 0, 1, 1, 10);
  assert.equal(out.length, 11);
});
