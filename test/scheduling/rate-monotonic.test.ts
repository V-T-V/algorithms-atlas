import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rateMonotonic,
  liuLaylandBound,
} from '../../src/algorithms/scheduling/rate-monotonic/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/scheduling/rate-monotonic/trace.ts';

test('liuLaylandBound 经典值', () => {
  assert.equal(liuLaylandBound(1), 1);
  assert.ok(Math.abs(liuLaylandBound(2) - 0.8284271247) < 1e-6, 'n=2 应约 0.828');
  assert.ok(Math.abs(liuLaylandBound(3) - 0.7797631487) < 1e-6, 'n=3 应约 0.780');
  // n→∞ 趋于 ln2 ≈ 0.693
  assert.ok(liuLaylandBound(100) > 0.69 && liuLaylandBound(100) < 0.7);
});

test('rate-monotonic 可调度例（U 在上界内）', () => {
  const r = rateMonotonic([
    { id: 'T1', period: 4, execution: 1 }, // U=0.25
    { id: 'T2', period: 6, execution: 2 }, // U=0.333
  ]);
  // U = 0.25 + 0.333 = 0.583 ≤ 0.828 → 可调度
  assert.equal(r.tasks.length, 2);
  assert.ok(r.utilization < r.bound, 'U 应小于 LL 上界');
  assert.equal(r.schedulable, true);
});

test('rate-monotonic 不可调度例（U 超过上界）', () => {
  const r = rateMonotonic([
    { id: 'T1', period: 4, execution: 3 }, // U=0.75
    { id: 'T2', period: 6, execution: 3 }, // U=0.5
  ]);
  // U = 1.25 > 0.828 → 不可调度（充分条件）
  assert.ok(r.utilization > r.bound);
  assert.equal(r.schedulable, false);
});

test('rate-monotonic 优先级：周期越短越高', () => {
  const r = rateMonotonic([
    { id: 'A', period: 10, execution: 1 },
    { id: 'B', period: 4, execution: 1 },
    { id: 'C', period: 8, execution: 1 },
  ]);
  // B(4) 优先级 1，C(8) 优先级 2，A(10) 优先级 3
  const byId = (id: string) => r.tasks.find((t) => t.id === id)!;
  assert.equal(byId('B').priority, 1);
  assert.equal(byId('C').priority, 2);
  assert.equal(byId('A').priority, 3);
});

test('rate-monotonic 利用率正确', () => {
  const r = rateMonotonic([
    { id: 'T1', period: 5, execution: 1 },
    { id: 'T2', period: 10, execution: 2 },
  ]);
  // 0.2 + 0.2 = 0.4
  assert.ok(Math.abs(r.utilization - 0.4) < 1e-9);
});

test('rate-monotonic 平局按 id 字典序', () => {
  const r = rateMonotonic([
    { id: 'Z', period: 4, execution: 1 },
    { id: 'A', period: 4, execution: 1 },
  ]);
  assert.equal(r.tasks[0]!.id, 'A');
  assert.equal(r.tasks[0]!.priority, 1);
});

test('rate-monotonic 拒绝 execution > period', () => {
  assert.throws(() => rateMonotonic([{ id: 'X', period: 2, execution: 5 }]), RangeError);
});

test('rate-monotonic 空任务集', () => {
  const r = rateMonotonic([]);
  assert.equal(r.utilization, 0);
  assert.equal(r.schedulable, true);
});

test('rate-monotonic 仿真甘特段非空（可调度例）', () => {
  const r = rateMonotonic(
    [
      { id: 'T1', period: 4, execution: 1 },
      { id: 'T2', period: 6, execution: 1 },
    ],
    {},
    12,
  );
  assert.ok(r.segments.length > 0);
  assert.equal(r.simHorizon, 12);
});

test('rate-monotonic 钩子被调用', () => {
  let steps = 0;
  let completes = 0;
  rateMonotonic(
    [
      { id: 'T1', period: 4, execution: 1 },
      { id: 'T2', period: 6, execution: 1 },
    ],
    {
      onStep: () => steps++,
      onJobComplete: () => completes++,
    },
    12,
  );
  assert.ok(steps > 0);
  assert.ok(completes > 0);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
  // 终帧应含利用率与可调度性
  assert.ok(last.aux!.some((e) => e.label.includes('利用率')));
});
