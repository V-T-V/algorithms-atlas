import { test } from 'node:test';
import assert from 'node:assert/strict';
import { romberg } from '../../src/algorithms/numerical/romberg-integral/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/romberg-integral/trace.ts';

test('romberg 常数积分精确', () => {
  const { value } = romberg((_x) => 5, 0, 3, 4);
  assert.ok(Math.abs(value - 15) < 1e-12);
});

test('romberg 线性积分精确', () => {
  // ∫₀² x dx = 2
  const { value } = romberg((x) => x, 0, 2, 4);
  assert.ok(Math.abs(value - 2) < 1e-12);
});

test('romberg 4/(1+x²) ≈ π', () => {
  const { value } = romberg((x) => 4 / (1 + x * x), 0, 1, 6);
  assert.ok(Math.abs(value - Math.PI) < 1e-10, `误差过大: ${Math.abs(value - Math.PI)}`);
});

test('romberg 收敛快（高阶层误差远小于低阶）', () => {
  const { table } = romberg((x) => 4 / (1 + x * x), 0, 1, 5);
  const err0 = Math.abs(table[0]![0]! - Math.PI);
  const errLast = Math.abs(table[table.length - 1]!.slice(-1)[0]! - Math.PI);
  assert.ok(errLast < err0 * 1e-6, `外推未收敛: ${errLast} vs ${err0}`);
});

test('romberg levels < 1 报错', () => {
  assert.throws(() => romberg((_x) => 1, 0, 1, 0));
});

test('romberg 钩子被调用', () => {
  const rows: number[] = [];
  romberg((_x) => 1, 0, 1, 3, { onRow: (i) => rows.push(i) });
  assert.deepEqual(rows, [0, 1, 2, 3]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
