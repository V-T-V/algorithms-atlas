import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadlineMonotonic } from '../../src/algorithms/scheduling/deadline-monotonic/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/deadline-monotonic/trace.ts';

test('deadlineMonotonic 优先级按 D 升序', () => {
  const r = deadlineMonotonic(
    [
      { id: 'A', period: 10, deadline: 8, execution: 2 },
      { id: 'B', period: 10, deadline: 4, execution: 2 },
    ],
    0,
  );
  const a = r.tasks.find((t) => t.id === 'A')!;
  const b = r.tasks.find((t) => t.id === 'B')!;
  assert.ok(b.priority < a.priority); // B 的 D=4 更小，优先级更高
});

test('deadlineMonotonic D=T 退化为 RM', () => {
  const r = deadlineMonotonic(
    [
      { id: 'A', period: 4, deadline: 4, execution: 1 },
      { id: 'B', period: 8, deadline: 8, execution: 2 },
    ],
    8,
  );
  // 可行（利用率 1/4 + 2/8 = 0.5）
  assert.equal(r.feasible, true);
});

test('deadlineMonotonic 过载时错过截止期', () => {
  const r = deadlineMonotonic(
    [
      { id: 'A', period: 4, deadline: 2, execution: 3 }, // C>D 必错过
    ],
    8,
  );
  assert.equal(r.feasible, false);
  assert.ok(r.deadlineMisses > 0);
});

test('deadlineMonotonic 空任务集', () => {
  const r = deadlineMonotonic([]);
  assert.equal(r.feasible, true);
  assert.equal(r.deadlineMisses, 0);
});

test('deadlineMonotonic 钩子被调用', () => {
  let steps = 0;
  deadlineMonotonic([{ id: 'A', period: 4, deadline: 4, execution: 1 }], 4, {
    onStep: () => steps++,
  });
  assert.equal(steps, 4);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
