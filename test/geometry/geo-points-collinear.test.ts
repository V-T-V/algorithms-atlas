import { test } from 'node:test';
import assert from 'node:assert/strict';
import { areCollinear } from '../../src/algorithms/geometry/geo-points-collinear/impl.ts';

test('共线（水平线）', () => {
  assert.equal(areCollinear({ x: 0, y: 5 }, { x: 3, y: 5 }, { x: 9, y: 5 }), true);
});

test('共线（对角线）', () => {
  assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), true);
});

test('共线（端点顺序无关）', () => {
  // 中间点在首位也应判共线
  assert.equal(areCollinear({ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 2, y: 2 }), true);
});

test('不共线', () => {
  assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), false);
});

test('三点重合视为共线（叉积=0）', () => {
  assert.equal(areCollinear({ x: 4, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 4 }), true);
});

test('自定义 eps 阈值生效', () => {
  // 三点几乎共线但偏差 0.1：默认 1e-9 判不共线，eps=1 判共线
  const a = { x: 0, y: 0 };
  const b = { x: 1, y: 0 };
  const c = { x: 2, y: 0.1 };
  assert.equal(areCollinear(a, b, c), false);
  assert.equal(areCollinear(a, b, c, 1), true);
});

test('浮点误差近共线点在默认 eps 下判共线', () => {
  // 真实共线但引入 1e-12 量级浮点噪声
  const a = { x: 0, y: 0 };
  const b = { x: 1e6, y: 1e6 };
  const c = { x: 2e6, y: 2e6 + 1e-3 }; // 偏离 0.001 → 不共线
  assert.equal(areCollinear(a, b, c), false);
  const d = { x: 2e6, y: 2e6 + 1e-12 }; // 偏离 1e-12 → 共线
  assert.equal(areCollinear(a, b, d), true);
});
