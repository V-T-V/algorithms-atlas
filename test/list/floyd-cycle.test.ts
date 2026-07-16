import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floydCycle } from '../../src/algorithms/list/floyd-cycle/impl.ts';

test('floyd-cycle 检测到环并定位入口', () => {
  // 0→1→2→3→4→5→6→3，环入口为 3
  const next = [1, 2, 3, 4, 5, 6, 3];
  const r = floydCycle(0, (p) => next[p]!);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry, 3);
});

test('floyd-cycle 自环', () => {
  // 0→1→1（自环入口 1）
  const next = [1, 1];
  const r = floydCycle(0, (p) => next[p]!);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry, 1);
});

test('floyd-cycle 无环', () => {
  // 0→1→2→-1（终点）
  const next = [1, 2, -1];
  const r = floydCycle(0, (p) => next[p] ?? -1);
  assert.equal(r.hasCycle, false);
  assert.equal(r.entry, -1);
});

test('floyd-cycle 钩子被调用', () => {
  const next = [1, 2, 3, 4, 5, 6, 3];
  let steps = 0;
  let meetCount = 0;
  let entryVal = -1;
  floydCycle(0, (p) => next[p]!, {
    onStep: () => steps++,
    onMeet: () => meetCount++,
    onEntry: (e) => {
      entryVal = e;
    },
  });
  assert.ok(steps > 0, '应有多步');
  assert.equal(meetCount, 1, '恰好相遇一次');
  assert.equal(entryVal, 3);
});
