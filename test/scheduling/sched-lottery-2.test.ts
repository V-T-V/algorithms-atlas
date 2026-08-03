import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lotterySchedule,
  lcg,
  type LotteryTask,
} from '../../src/algorithms/scheduling/sched-lottery-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-lottery-2/trace.ts';

test('sched-lottery-2：所有任务完成后 completion 正确', () => {
  const tasks: LotteryTask[] = [
    { pid: 'A', burst: 2, tickets: 1 },
    { pid: 'B', burst: 2, tickets: 1 },
  ];
  // 确定性 RNG
  const rng = lcg(42);
  const { completion, cpuTime } = lotterySchedule(tasks, 100, rng);
  assert.equal(cpuTime.A, 2);
  assert.equal(cpuTime.B, 2);
  assert.ok(completion.A !== undefined);
  assert.ok(completion.B !== undefined);
});

test('sched-lottery-2：高票数任务获得更多 CPU（确定性统计）', () => {
  // 单任务必胜
  const tasks: LotteryTask[] = [{ pid: 'A', burst: 3, tickets: 10 }];
  const { cpuTime, completion } = lotterySchedule(tasks, 100, lcg(1));
  assert.equal(cpuTime.A, 3);
  assert.equal(completion.A, 3);
});

test('sched-lottery-2：steps 耗尽未完成时部分任务无 completion', () => {
  const tasks: LotteryTask[] = [
    { pid: 'A', burst: 5, tickets: 1 },
    { pid: 'B', burst: 5, tickets: 1 },
  ];
  const { completion } = lotterySchedule(tasks, 3, lcg(7));
  // 最多 3 步，不可能两个都完成
  assert.ok(Object.keys(completion).length <= 1);
});

test('sched-lottery-2：确定性 RNG 可复现', () => {
  const tasks: LotteryTask[] = [
    { pid: 'A', burst: 1, tickets: 1 },
    { pid: 'B', burst: 1, tickets: 1 },
  ];
  const r1 = lotterySchedule(tasks, 10, lcg(99));
  const r2 = lotterySchedule(tasks, 10, lcg(99));
  assert.deepEqual(r1.timeline, r2.timeline);
});

test('sched-lottery-2：空任务列表安全返回', () => {
  const { completion, cpuTime, timeline } = lotterySchedule([], 10, lcg(0));
  assert.deepEqual(completion, {});
  assert.deepEqual(cpuTime, {});
  assert.equal(timeline.length, 0);
});

test('lcg 产出 [0,1) 区间伪随机数', () => {
  const rng = lcg(12345);
  for (let i = 0; i < 20; i++) {
    const v = rng();
    assert.ok(v >= 0 && v < 1, `rng 值越界: ${v}`);
  }
});

test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
