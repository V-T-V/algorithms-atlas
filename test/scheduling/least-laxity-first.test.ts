import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leastLaxityFirst } from '../../src/algorithms/scheduling/least-laxity-first/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/least-laxity-first/trace.ts';

test('leastLaxityFirst 可行任务集无错过', () => {
  const r = leastLaxityFirst(
    [
      { id: 'T1', period: 8, deadline: 8, execution: 3 },
      { id: 'T2', period: 12, deadline: 12, execution: 3 },
    ],
    24,
  );
  assert.equal(r.feasible, true);
  assert.equal(r.deadlineMisses, 0);
});

test('leastLaxityFirst 过载时错过', () => {
  const r = leastLaxityFirst([{ id: 'X', period: 4, deadline: 2, execution: 3 }], 8);
  assert.equal(r.feasible, false);
});

test('leastLaxityFirst 总调度段数符合执行总量', () => {
  const r = leastLaxityFirst([{ id: 'A', period: 10, deadline: 10, execution: 2 }], 10);
  const total = r.segments.reduce((s, x) => s + (x.finish - x.start), 0);
  assert.equal(total, 2);
});

test('leastLaxityFirst 空任务集', () => {
  const r = leastLaxityFirst([]);
  assert.equal(r.feasible, true);
});

test('leastLaxityFirst 钩子被调用', () => {
  let steps = 0;
  leastLaxityFirst([{ id: 'A', period: 4, deadline: 4, execution: 1 }], 4, {
    onStep: () => steps++,
  });
  assert.equal(steps, 4);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
