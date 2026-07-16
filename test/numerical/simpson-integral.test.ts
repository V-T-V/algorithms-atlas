import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simpsonIntegral } from '../../src/algorithms/numerical/simpson-integral/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/numerical/simpson-integral/trace.ts';

test('simpson 对线性函数精确', () => {
  // ∫₀² (2x + 1) dx = 6，任意偶数 n 都精确
  const r = simpsonIntegral((x) => 2 * x + 1, 0, 2, 4);
  assert.ok(Math.abs(r.integral - 6) < 1e-12);
});

test('simpson 对三次函数精确（代数精度 3）', () => {
  // ∫₀² x³ dx = 4
  const r = simpsonIntegral((x) => x * x * x, 0, 2, 2);
  assert.ok(Math.abs(r.integral - 4) < 1e-12);
});

test('simpson 对四次函数有误差 O(h⁴)', () => {
  // ∫₀¹ x⁴ dx = 0.2；n=2 时不精确，但误差随 n 增大快速减小
  const exact = 0.2;
  const e2 = Math.abs(simpsonIntegral((x) => x ** 4, 0, 1, 2).integral - exact);
  const e8 = Math.abs(simpsonIntegral((x) => x ** 4, 0, 1, 8).integral - exact);
  assert.ok(e8 < e2, 'n 更大误差更小');
  assert.ok(e8 < 1e-4);
});

test('simpson 近似 π', () => {
  // ∫₀¹ 4/(1+x²) dx = π
  const r = simpsonIntegral((x) => 4 / (1 + x * x), 0, 1, 20);
  assert.ok(Math.abs(r.integral - Math.PI) < 1e-6, `got ${r.integral}`);
});

test('simpson 对正弦函数正确', () => {
  // ∫₀^π sin(x) dx = 2，误差随 n 收敛（O(h⁴)）
  const r10 = simpsonIntegral(Math.sin, 0, Math.PI, 10);
  assert.ok(Math.abs(r10.integral - 2) < 2e-4);
  const r80 = simpsonIntegral(Math.sin, 0, Math.PI, 80);
  assert.ok(Math.abs(r80.integral - 2) < 5e-8);
});

test('simpson 奇数 n 自动减一为偶数', () => {
  const r = simpsonIntegral((x) => x, 0, 1, 7);
  assert.equal(r.n, 6);
  assert.equal(r.xs.length, 7);
});

test('simpson 返回采样点与函数值', () => {
  const r = simpsonIntegral((x) => x, 0, 2, 4);
  assert.equal(r.xs.length, 5);
  assert.equal(r.fs.length, 5);
  assert.ok(Math.abs(r.h - 0.5) < 1e-12);
  assert.ok(Math.abs(r.xs[0]! - 0) < 1e-12);
  assert.ok(Math.abs(r.xs[4]! - 2) < 1e-12);
});

test('simpson 钩子按三元组触发且累计等于最终积分', () => {
  const panels: number[] = [];
  const r = simpsonIntegral((x) => x * x, 0, 2, 4, {
    onPanel: (p) => panels.push(p.cumulative),
  });
  assert.equal(panels.length, 2); // n/2 个三元组
  // 最后一次累计 = 总积分
  assert.ok(Math.abs(panels[panels.length - 1]! - r.integral) < 1e-12);
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
  assert.ok(integralEntry, '末帧含积分值');
  assert.ok(integralEntry!.role === 'final');
  // 积分值应接近 π
  assert.ok(Math.abs(parseFloat(integralEntry!.value) - Math.PI) < 1e-3);
});
