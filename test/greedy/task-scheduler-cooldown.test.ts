import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  taskSchedulerCooldown,
  type TaskSchedulerCooldownHooks,
} from '../../src/algorithms/greedy/task-scheduler-cooldown/impl.ts';

test('task-scheduler-cooldown ["A","A","A","B","B","B"] n=2 = 8', () => {
  // LeetCode 示例 1：A→B→idle→A→B→idle→A→B
  assert.equal(taskSchedulerCooldown(['A', 'A', 'A', 'B', 'B', 'B'], 2).minTime, 8);
});

test('task-scheduler-cooldown ["A","A","A","B","B","B"] n=0 = 6', () => {
  // 无冷却：直接 6
  assert.equal(taskSchedulerCooldown(['A', 'A', 'A', 'B', 'B', 'B'], 0).minTime, 6);
});

test('task-scheduler-cooldown ["A","A","A","A","A","A","B","C","D","E","F","G"] n=2 = 16', () => {
  // LeetCode 示例 2
  assert.equal(
    taskSchedulerCooldown(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2).minTime,
    16,
  );
});

test('task-scheduler-cooldown 单任务多次', () => {
  // 3 个 A，n=2：A→idle→idle→A→idle→idle→A = 7
  assert.equal(taskSchedulerCooldown(['A', 'A', 'A'], 2).minTime, 7);
});

test('task-scheduler-cooldown 空任务 = 0', () => {
  assert.equal(taskSchedulerCooldown([], 2).minTime, 0);
});

test('task-scheduler-cooldown n=0 时等于任务数', () => {
  assert.equal(taskSchedulerCooldown(['A', 'B', 'C', 'A'], 0).minTime, 4);
});

test('task-scheduler-cooldown 结果 >= 任务数', () => {
  const tasks = ['A', 'A', 'B', 'B', 'C', 'C'];
  assert.ok(taskSchedulerCooldown(tasks, 3).minTime >= tasks.length);
});

test('task-scheduler-cooldown 与模拟法一致（小例）', () => {
  // 模拟：贪心选可执行且剩余最多的任务
  const simulate = (tasks: string[], n: number): number => {
    const cnt = new Map<string, number>();
    for (const t of tasks) cnt.set(t, (cnt.get(t) ?? 0) + 1);
    const last: Map<string, number> = new Map();
    let time = 0;
    let done = 0;
    while (done < tasks.length) {
      let pick: string | null = null;
      let best = -1;
      for (const [t, c] of cnt) {
        if (c <= 0) continue;
        const lt = last.get(t) ?? -Infinity;
        if (time - lt > n && c > best) {
          best = c;
          pick = t;
        }
      }
      if (pick !== null) {
        cnt.set(pick, cnt.get(pick)! - 1);
        last.set(pick, time);
        done++;
      }
      time++;
    }
    return time;
  };
  const cases: Array<[string[], number]> = [
    [['A', 'A', 'A', 'B', 'B', 'B'], 2],
    [['A', 'A', 'A', 'B', 'C', 'D'], 2],
    [['A', 'B', 'C', 'A', 'B', 'C'], 1],
  ];
  for (const [tasks, n] of cases) {
    assert.equal(taskSchedulerCooldown(tasks, n).minTime, simulate(tasks, n));
  }
});

test('task-scheduler-cooldown 钩子被调用', () => {
  let counts = 0;
  let concludes = 0;
  const hooks: TaskSchedulerCooldownHooks = {
    onCount: () => counts++,
    onConclude: () => concludes++,
  };
  taskSchedulerCooldown(['A', 'A', 'B'], 2, hooks);
  assert.equal(counts, 1);
  assert.equal(concludes, 1);
});
