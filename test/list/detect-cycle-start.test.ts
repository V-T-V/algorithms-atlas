import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectCycleStart,
  listFromValues,
  collectNodes,
  type CycleListNode,
} from '../../src/algorithms/list/detect-cycle-start/impl.ts';

/** 构造带环链表：values 给节点值，cycleAt 为尾节点回指的下标（-1 无环）。 */
function buildCyclicList(values: number[], cycleAt: number): CycleListNode | null {
  const head = listFromValues(values);
  if (!head || cycleAt < 0) return head;
  const nodes = collectNodes(head);
  nodes[nodes.length - 1]!.next = nodes[cycleAt]!;
  return head;
}

test('detect-cycle-start 定位环入口', () => {
  // 1→2→3→4→5→6→3，环入口为值 3（下标 2）
  const head = buildCyclicList([1, 2, 3, 4, 5, 6], 2);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry?.value, 3);
});

test('detect-cycle-start 自环', () => {
  // 单节点自环
  const head = buildCyclicList([1], 0);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry?.value, 1);
});

test('detect-cycle-start 环在头部', () => {
  // 1→2→1，环入口为头节点（值 1）
  const head = buildCyclicList([1, 2], 0);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry?.value, 1);
});

test('detect-cycle-start 无环返回 null', () => {
  const head = buildCyclicList([1, 2, 3, 4], -1);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, false);
  assert.equal(r.entry, null);
});

test('detect-cycle-start 空链表', () => {
  const r = detectCycleStart(null);
  assert.equal(r.hasCycle, false);
  assert.equal(r.entry, null);
});

test('detect-cycle-start 单节点无环', () => {
  const head = listFromValues([42]);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, false);
  assert.equal(r.entry, null);
});

test('detect-cycle-start 入口为链表中段', () => {
  // 1→2→3→4→5→6→7→8→4，环入口值 4（下标 3）
  const head = buildCyclicList([1, 2, 3, 4, 5, 6, 7, 8], 3);
  const r = detectCycleStart(head);
  assert.equal(r.hasCycle, true);
  assert.equal(r.entry?.value, 4);
});

test('detect-cycle-start 钩子被调用', () => {
  const head = buildCyclicList([1, 2, 3, 4, 5, 6], 2);
  let detectSteps = 0;
  let findSteps = 0;
  let meetCount = 0;
  let entryVal = -1;
  const phaseChanges: string[] = [];
  detectCycleStart(head, {
    onStepDetect: () => detectSteps++,
    onStepFind: () => findSteps++,
    onMeet: () => meetCount++,
    onEntry: (idx) => {
      entryVal = idx;
    },
    onPhase: (p) => phaseChanges.push(p),
  });
  assert.ok(detectSteps > 0, '阶段一应有多步');
  assert.ok(findSteps > 0, '阶段二应有多步');
  assert.equal(meetCount, 1, '恰好相遇一次');
  assert.equal(entryVal, 2, '入口下标为 2');
  assert.deepEqual(phaseChanges, ['detect', 'find']);
});
