import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trapezoidal } from '../../src/algorithms/numerical/trapezoidal/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/numerical/trapezoidal/trace.ts';

test('trapezoidal 对线性函数精确', () => {
  // ∫₀² (3x + 1) dx = 8，任意 n 都精确
  const r = trapezoidal((x) => 3 * x + 1, 0, 2, 4);
  assert.ok(Math.abs(r.integral - 8) < 1e-12);
});

test('trapezoidal 对二次函数有误差 O(h²)', () => {
  // ∫₀¹ x² dx = 1/3
  const exact = 1 / 3;
  const e2 = Math.abs(trapezoidal((x) => x * x, 0, 1, 2).integral - exact);
  const e8 = Math.abs(trapezoidal((x) => x * x, 0, 1, 8).integral - exact);
  assert.ok(e8 < e2, 'n 更大误差更小');
  assert.ok(e8 < 1e-2);
});

test('trapezoidal 近似 π', () => {
  // ∫₀¹ 4/(1+x²) dx = π
  const r = trapezoidal((x) => 4 / (1 + x * x), 0, 1, 100);
  assert.ok(Math.abs(r.integral - Math.PI) < 1e-4, `got ${r.integral}`);
});

test('trapezoidal 对常数函数精确', () => {
  // ∫₀⁵ 7 dx = 35
  const r = trapezoidal(() => 7, 0, 5, 10);
  assert.ok(Math.abs(r.integral - 35) < 1e-12);
});

test('trapezoidal n=1 单梯形正确', () => {
  // ∫₀¹ x dx = 0.5，n=1 时为一个梯形：(1/2)·(0+1) = 0.5
  const r = trapezoidal((x) => x, 0, 1, 1);
  assert.ok(Math.abs(r.integral - 0.5) < 1e-12);
  assert.equal(r.xs.length, 2);
});

test('trapezoidal 误差随 n 翻倍约缩小到 1/4（二阶收敛）', () => {
  const exact = 1 / 3;
  const e10 = Math.abs(trapezoidal((x) => x * x, 0, 1, 10).integral - exact);
  const e20 = Math.abs(trapezoidal((x) => x * x, 0, 1, 20).integral - exact);
  const ratio = e20 / e10;
  assert.ok(ratio < 0.35 && ratio > 0.2, `ratio ${ratio} 应接近 0.25`);
});

test('trapezoidal 返回采样点与步长', () => {
  const r = trapezoidal((x) => x, 0, 3, 6);
  assert.equal(r.xs.length, 7);
  assert.equal(r.fs.length, 7);
  assert.ok(Math.abs(r.h - 0.5) < 1e-12);
});

test('trapezoidal 钩子按条带触发且累计等于最终积分', () => {
  const areas: number[] = [];
  const r = trapezoidal((x) => x * x, 0, 2, 5, {
    onStrip: (s) => areas.push(s.cumulative),
  });
  assert.equal(areas.length, 5);
  assert.ok(Math.abs(areas[areas.length - 1]! - r.integral) < 1e-12);
});

test('buildTrace 生成有序帧且末帧为 final', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(
    frames.some((f) => f.bars && f.bars.length > 0),
    '有采样点 bars 帧',
  );
  assert.ok(
    frames.some((f) => f.aux && f.aux.length > 0),
    '有 aux 帧',
  );
  const last = frames[frames.length - 1]!;
  const integralEntry = last.aux!.find((e) => e.label === '积分值');
  assert.ok(integralEntry);
  assert.ok(integralEntry!.role === 'final');
  assert.ok(Math.abs(parseFloat(integralEntry!.value) - Math.PI) < 1e-2);
});
