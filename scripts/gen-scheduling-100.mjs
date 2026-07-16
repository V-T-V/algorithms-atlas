// Generator for 45 scheduling algorithms (55 -> 100). ids use 'sched-' prefix to stay unique.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'scheduling';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;
function writeAlg(id, metaSrc, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), metaSrc);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}
function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// shared Job interface
const JOB_IFACE = `export interface Job { id: string; arrival: number; burst: number; priority?: number; }
export interface Segment { id: string; start: number; end: number; }
export interface SchedResult { order: string[]; segments: Segment[]; avgWait: number; avgTurnaround: number; }`;

const ALGS = [];

// 1. sched-sjf-nonpreempt  —— 短作业优先（非抢占）
ALGS.push({
  id: 'sched-sjf-nonpreempt',
  m: ['短作业优先非抢占', 'Shortest Job First (Non-preemptive)', '非抢占式最短作业优先调度。', 'Non-preemptive shortest job first.',
    '就绪队列中选 burst 最小者执行。', 'Pick min burst from ready queue. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'sjf']],
  impl: `${JOB_IFACE}
export interface SjfHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function sjfNonPreemptive(jobs: Job[], hooks: SjfHooks = {}): SchedResult {
  const remaining = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = remaining[0]!; time = pick.arrival; }
    else pick = ready.reduce((a, b) => (a.burst < b.burst ? a : b));
    const idx = remaining.indexOf(pick);
    remaining.splice(idx, 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sjfNonPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 6 }, { id: 'B', arrival: 1, burst: 2 }, { id: 'C', arrival: 2, burst: 4 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const acc: Array<{ id: string; start: number; end: number }> = [];
  rec.begin({ zh: 'SJF 非抢占', en: 'SJF non-preemptive' }).commit();
  const r = sjfNonPreemptive(input, { onPick: (j, t) => { acc.push({ id: j.id, start: t, end: t + j.burst }); rec.begin({ zh: t + ': 运行 ' + j.id, en: t + ': run ' + j.id }).setBars(acc.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).commit(); } });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sjfNonPreemptive } from '../../src/algorithms/scheduling/sched-sjf-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-nonpreempt/trace.ts';
test('sjfNonPreemptive 正确', () => {
  const r = sjfNonPreemptive([{ id: 'A', arrival: 0, burst: 6 }, { id: 'B', arrival: 1, burst: 2 }, { id: 'C', arrival: 2, burst: 4 }]);
  assert.deepEqual(r.order, ['A','B','C']);
  assert.ok(r.avgWait > 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. sched-srtf-preempt  —— 最短剩余时间优先（抢占）
ALGS.push({
  id: 'sched-srtf-preempt',
  m: ['最短剩余时间优先', 'Shortest Remaining Time First', '抢占式 SJF，每次选剩余时间最短。', 'Preemptive SJF: pick min remaining time each tick.',
    '每时间单位选剩余 burst 最小者。', 'Per tick pick min remaining. O(n*maxburst).', 'O(n*maxburst)', 'O(n)', ['scheduling', 'srtf', 'preemptive']],
  impl: `${JOB_IFACE}
export interface SrtfHooks { onTick?: (id: string, time: number) => void; onResult?: (r: SchedResult) => void; }
export function srtf(jobs: Job[], hooks: SrtfHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  let time = 0, totalWait = 0, totalTurn = 0;
  const segments: Segment[] = []; const order: string[] = [];
  const finish: Map<string, number> = new Map();
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => (rem.get(a.id)! < rem.get(b.id)! ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onTick?.(pick.id, time);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); }
  }
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { srtf, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 1, burst: 3 }, { id: 'C', arrival: 2, burst: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SRTF 抢占', en: 'SRTF preemptive' }).commit();
  const r = srtf(input, { onTick: (id, t) => rec.begin({ zh: t + ': ' + id, en: t + ': ' + id }).setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srtf } from '../../src/algorithms/scheduling/sched-srtf-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-srtf-preempt/trace.ts';
test('srtf 正确', () => {
  const r = srtf([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 1, burst: 3 }, { id: 'C', arrival: 2, burst: 1 }]);
  assert.deepEqual(r.order, ['A','C','B','A']);
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. sched-priority-nonpreempt  —— 优先级调度（非抢占）
ALGS.push({
  id: 'sched-priority-nonpreempt',
  m: ['优先级调度非抢占', 'Priority Scheduling (Non-preemptive)', '非抢占式优先级调度（数字小优先级高）。', 'Non-preemptive priority scheduling (smaller = higher).',
    '就绪队列选优先级数字最小者。', 'Pick min priority number. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'priority']],
  impl: `${JOB_IFACE}
export interface PriHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function priorityNonPreemptive(jobs: Job[], hooks: PriHooks = {}): SchedResult {
  const remaining = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = remaining[0]!; time = pick.arrival; }
    else pick = ready.reduce((a, b) => ((a.priority ?? 0) < (b.priority ?? 0) ? a : b));
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityNonPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 4, priority: 2 }, { id: 'B', arrival: 1, burst: 3, priority: 1 }, { id: 'C', arrival: 2, burst: 1, priority: 3 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级非抢占', en: 'Priority non-preemptive' }).commit();
  const r = priorityNonPreemptive(input, { onPick: (j, t) => rec.begin({ zh: t + ': 运行 ' + j.id + ' (P' + j.priority + ')', en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityNonPreemptive } from '../../src/algorithms/scheduling/sched-priority-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-nonpreempt/trace.ts';
test('priorityNonPreemptive 正确', () => {
  const r = priorityNonPreemptive([{ id: 'A', arrival: 0, burst: 4, priority: 2 }, { id: 'B', arrival: 0, burst: 3, priority: 1 }, { id: 'C', arrival: 0, burst: 1, priority: 3 }]);
  assert.deepEqual(r.order, ['B','A','C']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. sched-round-robin  —— 时间片轮转
ALGS.push({
  id: 'sched-round-robin',
  m: ['时间片轮转', 'Round Robin', '每个进程分配固定时间片，轮流执行。', 'Each process gets a fixed quantum, taking turns.',
    'FIFO 队列，到时间片末尾回队尾。', 'FIFO queue, requeue at quantum end. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'round-robin']],
  impl: `${JOB_IFACE}
export interface RrHooks { onRun?: (id: string, start: number, dur: number) => void; onResult?: (r: SchedResult) => void; }
export function roundRobin(jobs: Job[], quantum: number, hooks: RrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q: Job[] = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0, i = 0;
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let totalWait = 0, totalTurn = 0;
  while (q.length) {
    if (i >= q.length) { i = 0; if (q.every((j) => j.arrival > time)) time = Math.min(...q.map((j) => j.arrival)); }
    const j = q[i]!;
    if (j.arrival > time) { i++; continue; }
    const run = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    i++;
    if (rem.get(j.id) === 0) { q.splice(q.indexOf(j), 1); finish.set(j.id, time); i--; }
  }
  for (const job of jobs) { totalTurn += finish.get(job.id)! - job.arrival; totalWait += finish.get(job.id)! - job.arrival - job.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobin, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 1 }] as Job[], quantum: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const acc: Array<{ id: string; start: number; end: number }> = [];
  rec.begin({ zh: 'RR quantum=' + input.quantum, en: 'RR q=' + input.quantum }).commit();
  const r = roundRobin(input.jobs, input.quantum, { onRun: (id, s, d) => { acc.push({ id, start: s, end: s + d }); rec.begin({ zh: s + '-' + (s + d) + ': ' + id, en: s + '-' + (s + d) + ': ' + id }).setBars(acc.map((sg) => ({ value: sg.end - sg.start, role: 'final' as BarRole, label: sg.id }))).commit(); } });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobin } from '../../src/algorithms/scheduling/sched-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-round-robin/trace.ts';
test('roundRobin 正确', () => {
  const r = roundRobin([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 1 }], 2);
  assert.ok(r.segments.length >= 3);
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. sched-multilevel-queue  —— 多级队列调度
ALGS.push({
  id: 'sched-multilevel-queue',
  m: ['多级队列', 'Multilevel Queue', '按类型分到不同队列，固定优先级调度。', 'Categorize into queues, fixed-priority scheduling.',
    '高优先级队列优先，队列内 FCFS。', 'Higher-priority queue first, FCFS within. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'multilevel']],
  impl: `${JOB_IFACE}
export interface MlqHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function multilevelQueue(jobs: Job[], hooks: MlqHooks = {}): SchedResult {
  const queues = new Map<number, Job[]>();
  for (const j of jobs) { const p = j.priority ?? 0; if (!queues.has(p)) queues.set(p, []); queues.get(p)!.push(j); }
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  for (const p of [...queues.keys()].sort((a, b) => a - b)) {
    for (const j of queues.get(p)!) {
      const wait = Math.max(0, time - j.arrival);
      totalWait += wait; totalTurn += wait + j.burst;
      hooks.onPick?.(j, time);
      order.push(j.id);
      segments.push({ id: j.id, start: time, end: time + j.burst });
      time += j.burst;
    }
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multilevelQueue, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 2, priority: 0 }, { id: 'B', arrival: 0, burst: 3, priority: 1 }, { id: 'C', arrival: 0, burst: 1, priority: 0 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多级队列', en: 'Multilevel queue' }).commit();
  const r = multilevelQueue(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id + ' (Q' + j.priority + ')', en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multilevelQueue } from '../../src/algorithms/scheduling/sched-multilevel-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multilevel-queue/trace.ts';
test('multilevelQueue 正确', () => {
  const r = multilevelQueue([{ id: 'A', arrival: 0, burst: 2, priority: 0 }, { id: 'B', arrival: 0, burst: 3, priority: 1 }, { id: 'C', arrival: 0, burst: 1, priority: 0 }]);
  assert.deepEqual(r.order, ['A','C','B']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. sched-hrn  —— 最高响应比优先
ALGS.push({
  id: 'sched-hrn',
  m: ['最高响应比优先', 'Highest Response Ratio Next', '响应比 = (等待+burst)/burst，选最大。', 'Response ratio = (wait+burst)/burst, pick max.',
    '非抢占，每步算响应比。', 'Non-preemptive, compute ratio each step. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'hrn']],
  impl: `${JOB_IFACE}
export interface HrnHooks { onPick?: (j: Job, ratio: number, time: number) => void; onResult?: (r: SchedResult) => void; }
export function hrn(jobs: Job[], hooks: HrnHooks = {}): SchedResult {
  const remaining = [...jobs];
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = remaining.reduce((a, b) => (a.arrival < b.arrival ? a : b)); time = pick.arrival; }
    else {
      pick = ready.reduce((a, b) => {
        const ra = (time - a.arrival + a.burst) / a.burst;
        const rb = (time - b.arrival + b.burst) / b.burst;
        return ra >= rb ? a : b;
      });
    }
    const ratio = (time - pick.arrival + pick.burst) / pick.burst;
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, ratio, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hrn, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 2 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 8 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'HRN', en: 'HRN' }).commit();
  const r = hrn(input, { onPick: (j, ratio, t) => rec.begin({ zh: t + ': ' + j.id + ' R=' + ratio.toFixed(2), en: t + ': ' + j.id + ' R=' + ratio.toFixed(2) }).setAux([{ label: 'ratio', value: ratio.toFixed(2), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hrn } from '../../src/algorithms/scheduling/sched-hrn/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-hrn/trace.ts';
test('hrn 正确', () => {
  const r = hrn([{ id: 'A', arrival: 0, burst: 2 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 8 }]);
  assert.equal(r.order[0], 'A');
  assert.ok(r.avgWait >= 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. sched-lottery  —— 彩票调度
ALGS.push({
  id: 'sched-llottery',
  m: ['彩票调度', 'Lottery Scheduling', '按彩票数概率抽签选进程。', 'Probabilistically pick process by ticket count.',
    '总票数内随机抽，落在某进程区间则选中。', 'Random within total tickets. O(n) per pick.', 'O(n^2)', 'O(n)', ['scheduling', 'lottery']],
  impl: `${JOB_IFACE}
export interface LotteryJob extends Job { tickets: number; }
export interface LtHooks { onPick?: (j: LotteryJob, time: number) => void; onResult?: (r: SchedResult) => void; }
export function lottery(jobs: LotteryJob[], hooks: LtHooks = {}, seed = 42): SchedResult {
  let rand = seed;
  const next = () => { rand = (rand * 1103515245 + 12345) & 0x7fffffff; return rand; };
  const remaining = [...jobs];
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    if (ready.length === 0) { time = Math.min(...remaining.map((j) => j.arrival)); continue; }
    const total = ready.reduce((s, j) => s + j.tickets, 0);
    let draw = next() % total;
    let pick = ready[0]!;
    for (const j of ready) { draw -= j.tickets; if (draw < 0) { pick = j; break; } }
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lottery, type LotteryJob } from './impl.ts';
export const DEFAULT_INPUT: LotteryJob[] = [{ id: 'A', arrival: 0, burst: 3, tickets: 5 }, { id: 'B', arrival: 0, burst: 2, tickets: 3 }, { id: 'C', arrival: 0, burst: 1, tickets: 2 }];
export function buildTrace(input: LotteryJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '彩票调度', en: 'Lottery' }).commit();
  const r = lottery(input, { onPick: (j, t) => rec.begin({ zh: t + ': 抽中 ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lottery } from '../../src/algorithms/scheduling/sched-llottery/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-llottery/trace.ts';
test('lottery 正确', () => {
  const r = lottery([{ id: 'A', arrival: 0, burst: 3, tickets: 5 }, { id: 'B', arrival: 0, burst: 2, tickets: 3 }]);
  assert.equal(r.order.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. sched-multilevel-feedback  —— 多级反馈队列
ALGS.push({
  id: 'sched-multilevel-feedback',
  m: ['多级反馈队列', 'Multilevel Feedback Queue', '多级队列，降级运行过久的进程。', 'Multi queues with demotion for long-running processes.',
    '顶层 RR 短时间片，用完降级。', 'RR top short, demote on quantum exhaust. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'mlfq']],
  impl: `${JOB_IFACE}
export interface MlfqHooks { onRun?: (id: string, level: number, start: number, dur: number) => void; onResult?: (r: SchedResult) => void; }
export function mlfq(jobs: Job[], quantums: number[], hooks: MlfqHooks = {}): SchedResult {
  const levels = quantums.length;
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const queues: Job[][] = Array.from({ length: levels }, () => []);
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0, pending = sorted;
  let totalWait = 0, totalTurn = 0;
  const arrived = (t: number) => { const nw = pending.filter((j) => j.arrival <= t); pending = pending.filter((j) => j.arrival > t); if (nw.length) queues[0]!.push(...nw); };
  while (rem.size) {
    arrived(time);
    let lvl = -1;
    for (let i = 0; i < levels; i++) if (queues[i]!.length) { lvl = i; break; }
    if (lvl === -1) { if (pending.length) time = pending[0]!.arrival; else break; continue; }
    const j = queues[lvl]!.shift()!;
    const q = quantums[lvl]!;
    const run = Math.min(q, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, lvl, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    arrived(time);
    if (rem.get(j.id) === 0) { finish.set(j.id, time); rem.delete(j.id); }
    else if (lvl + 1 < levels) queues[lvl + 1]!.push(j);
    else queues[lvl]!.push(j);
  }
  for (const job of jobs) { totalTurn += finish.get(job.id)! - job.arrival; totalWait += finish.get(job.id)! - job.arrival - job.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mlfq, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 8 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 2 }] as Job[], quantums: [2, 4, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MLFQ', en: 'MLFQ' }).commit();
  const r = mlfq(input.jobs, input.quantums, { onRun: (id, lvl, s, d) => rec.begin({ zh: s + ': ' + id + ' L' + lvl, en: s + ': ' + id + ' L' + lvl }).setAux([{ label: 'level', value: String(lvl), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mlfq } from '../../src/algorithms/scheduling/sched-multilevel-feedback/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multilevel-feedback/trace.ts';
test('mlfq 正确', () => {
  const r = mlfq([{ id: 'A', arrival: 0, burst: 8 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 2 }], [2, 4, 6]);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. sched-guaranteed  —— 公平分享调度
ALGS.push({
  id: 'sched-guaranteed',
  m: ['公平分享调度', 'Fair Share Scheduling', '按用户/组均分 CPU 时间。', 'Distribute CPU time fairly across users/groups.',
    '按组计算份额，组内轮流。', 'Per-group share, round-robin within. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'fair-share']],
  impl: `${JOB_IFACE}
export interface FsJob extends Job { group: string; }
export interface FsHooks { onPick?: (j: FsJob, time: number) => void; onResult?: (r: SchedResult) => void; }
export function fairShare(jobs: FsJob[], hooks: FsHooks = {}): SchedResult {
  const groups = new Map<string, FsJob[]>();
  for (const j of jobs) { if (!groups.has(j.group)) groups.set(j.group, []); groups.get(j.group)!.push(j); }
  const segs: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while ([...groups.values()].some((g) => g.length)) {
    for (const [, list] of [...groups.entries()].sort()) {
      if (!list.length) continue;
      const j = list.shift()!;
      const wait = Math.max(0, time - j.arrival);
      totalWait += wait; totalTurn += wait + j.burst;
      hooks.onPick?.(j, time);
      order.push(j.id);
      segs.push({ id: j.id, start: time, end: time + j.burst });
      time += j.burst;
    }
  }
  const r = { order, segments: segs, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fairShare, type FsJob } from './impl.ts';
export const DEFAULT_INPUT: FsJob[] = [{ id: 'A', arrival: 0, burst: 2, group: 'X' }, { id: 'B', arrival: 0, burst: 3, group: 'Y' }, { id: 'C', arrival: 0, burst: 1, group: 'X' }];
export function buildTrace(input: FsJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '公平分享', en: 'Fair share' }).commit();
  const r = fairShare(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id + ' (g' + j.group + ')', en: t + ': ' + j.id }).setAux([{ label: 'group', value: j.group, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fairShare } from '../../src/algorithms/scheduling/sched-guaranteed/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-guaranteed/trace.ts';
test('fairShare 正确', () => {
  const r = fairShare([{ id: 'A', arrival: 0, burst: 2, group: 'X' }, { id: 'B', arrival: 0, burst: 3, group: 'Y' }, { id: 'C', arrival: 0, burst: 1, group: 'X' }]);
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[1], 'B');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. sched-aging  —— 老化调度（防饥饿）
ALGS.push({
  id: 'sched-aging',
  m: ['老化优先级调度', 'Priority with Aging', '等待越久优先级越高，防止饥饿。', 'Priority increases with wait time, prevents starvation.',
    '动态优先级 = base - wait/agingRate。', 'Dynamic priority = base - wait/rate. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'aging']],
  impl: `${JOB_IFACE}
export interface AgeHooks { onPick?: (j: Job, effPri: number, time: number) => void; onResult?: (r: SchedResult) => void; }
export function priorityWithAging(jobs: Job[], agingRate: number, hooks: AgeHooks = {}): SchedResult {
  const remaining = [...jobs];
  const segs: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = remaining.reduce((a, b) => (a.arrival < b.arrival ? a : b)); time = pick.arrival; }
    else pick = ready.reduce((a, b) => {
      const ea = (a.priority ?? 0) - Math.max(0, time - a.arrival) / agingRate;
      const eb = (b.priority ?? 0) - Math.max(0, time - b.arrival) / agingRate;
      return ea <= eb ? a : b;
    });
    const eff = (pick.priority ?? 0) - Math.max(0, time - pick.arrival) / agingRate;
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, eff, time);
    order.push(pick.id);
    segs.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments: segs, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityWithAging, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 5, priority: 1 }, { id: 'B', arrival: 1, burst: 2, priority: 1 }, { id: 'C', arrival: 2, burst: 1, priority: 5 }] as Job[], rate: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '老化优先级', en: 'Priority aging' }).commit();
  const r = priorityWithAging(input.jobs, input.rate, { onPick: (j, eff, t) => rec.begin({ zh: t + ': ' + j.id + ' 有效P=' + eff.toFixed(2), en: t + ': ' + j.id + ' P=' + eff.toFixed(2) }).setAux([{ label: 'P', value: eff.toFixed(2), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityWithAging } from '../../src/algorithms/scheduling/sched-aging/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-aging/trace.ts';
test('priorityWithAging 正确', () => {
  const r = priorityWithAging([{ id: 'A', arrival: 0, burst: 2, priority: 1 }, { id: 'B', arrival: 0, burst: 1, priority: 1 }], 2);
  assert.equal(r.order.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. sched-edf  —— 最早截止时间优先
ALGS.push({
  id: 'sched-edf',
  m: ['最早截止时间优先', 'Earliest Deadline First', '实时调度：选截止时间最早的进程。', 'Real-time: pick process with earliest deadline.',
    '抢占式，每刻选 deadline 最小。', 'Preemptive, min deadline each tick. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'real-time', 'edf']],
  impl: `${JOB_IFACE}
export interface RtJob extends Job { deadline: number; }
export interface EdfHooks { onTick?: (id: string, time: number) => void; onResult?: (r: SchedResult, missed: number) => void; }
export function edf(jobs: RtJob[], hooks: EdfHooks = {}): { result: SchedResult; missed: number } {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0, missed = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => (a.deadline < b.deadline ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onTick?.(pick.id, time);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); if (time > pick.deadline) missed++; }
  }
  let totalWait = 0, totalTurn = 0;
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r, missed);
  return { result: r, missed };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edf, type RtJob } from './impl.ts';
export const DEFAULT_INPUT: RtJob[] = [{ id: 'A', arrival: 0, burst: 2, deadline: 4 }, { id: 'B', arrival: 0, burst: 3, deadline: 6 }, { id: 'C', arrival: 0, burst: 1, deadline: 3 }];
export function buildTrace(input: RtJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'EDF', en: 'EDF' }).commit();
  const { result: r, missed } = edf(input, { onTick: (id, t) => rec.begin({ zh: t + ': ' + id, en: t + ': ' + id }).setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '错过 ' + missed + ' 个截止', en: missed + ' missed' }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'missed', value: String(missed), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edf } from '../../src/algorithms/scheduling/sched-edf/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-edf/trace.ts';
test('edf 正确', () => {
  const { result: r, missed } = edf([{ id: 'A', arrival: 0, burst: 2, deadline: 4 }, { id: 'B', arrival: 0, burst: 3, deadline: 6 }, { id: 'C', arrival: 0, burst: 1, deadline: 3 }]);
  assert.deepEqual(r.order, ['C','A','B']);
  assert.equal(missed, 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. sched-rate-monotonic  —— 速率单调调度
ALGS.push({
  id: 'sched-rate-monotonic',
  m: ['速率单调调度', 'Rate Monotonic Scheduling', '周期任务，周期短者优先（静态优先级）。', 'Periodic tasks, shorter period = higher priority (static).',
    '周期越小优先级越高。', 'Shorter period = higher priority. O(n).', 'O(n)', 'O(n)', ['scheduling', 'real-time', 'rms']],
  impl: `${JOB_IFACE}
export interface PeriodicJob { id: string; period: number; burst: number; }
export interface RmHooks { onAssign?: (id: string, pri: number) => void; onResult?: (util: number) => void; }
export function rateMonotonic(jobs: PeriodicJob[], hooks: RmHooks = {}): Array<{ id: string; priority: number }> {
  const sorted = [...jobs].sort((a, b) => a.period - b.period);
  const out = sorted.map((j, i) => ({ id: j.id, priority: i }));
  const util = jobs.reduce((s, j) => s + j.burst / j.period, 0);
  for (const o of out) hooks.onAssign?.(o.id, o.priority);
  hooks.onResult?.(util);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rateMonotonic, type PeriodicJob } from './impl.ts';
export const DEFAULT_INPUT: PeriodicJob[] = [{ id: 'A', period: 4, burst: 1 }, { id: 'B', period: 6, burst: 2 }, { id: 'C', period: 8, burst: 1 }];
export function buildTrace(input: PeriodicJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '速率单调', en: 'Rate monotonic' }).commit();
  const util = rateMonotonic(input, { onAssign: (id, pri) => rec.begin({ zh: id + ' 优先级 ' + pri, en: id + ' pri ' + pri }).setBars([{ value: pri, role: 'pivot' as BarRole, label: id }]).commit() });
  rec.begin({ zh: '利用率 = ' + util.toFixed(2), en: 'util = ' + util.toFixed(2) }).setAux([{ label: 'util', value: util.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rateMonotonic } from '../../src/algorithms/scheduling/sched-rate-monotonic/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-rate-monotonic/trace.ts';
test('rateMonotonic 正确', () => {
  const r = rateMonotonic([{ id: 'A', period: 8, burst: 1 }, { id: 'B', period: 4, burst: 1 }]);
  assert.equal(r[0]!.id, 'B');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. sched-sjf-preempt  —— SJF 抢占变体（按剩余+到达）
ALGS.push({
  id: 'sched-sjf-preempt',
  m: ['SJF抢占变体', 'Preemptive SJF Variant', '新进程到达且 burst 更短时抢占。', 'Preempt when new arrival has shorter burst.',
    '比较新到达进程与当前剩余。', 'Compare new arrival with current. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'preemptive']],
  impl: `${JOB_IFACE}
export interface SjpHooks { onRun?: (id: string, time: number) => void; onResult?: (r: SchedResult) => void; }
export function sjfPreemptive(jobs: Job[], hooks: SjpHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => (rem.get(a.id)! < rem.get(b.id)! ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onRun?.(pick.id, time);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); }
  }
  let totalWait = 0, totalTurn = 0;
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sjfPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 7 }, { id: 'B', arrival: 2, burst: 4 }, { id: 'C', arrival: 4, burst: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SJF 抢占', en: 'SJF preemptive' }).commit();
  const r = sjfPreemptive(input, { onRun: (id, t) => rec.begin({ zh: t + ': ' + id, en: t + ': ' + id }).setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sjfPreemptive } from '../../src/algorithms/scheduling/sched-sjf-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-preempt/trace.ts';
test('sjfPreemptive 正确', () => {
  const r = sjfPreemptive([{ id: 'A', arrival: 0, burst: 7 }, { id: 'B', arrival: 2, burst: 4 }, { id: 'C', arrival: 4, burst: 1 }]);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. sched-priority-preempt  —— 优先级抢占
ALGS.push({
  id: 'sched-priority-preempt',
  m: ['优先级抢占', 'Priority Preemptive', '高优先级进程到达时抢占当前。', 'Preempt when higher-priority process arrives.',
    '每刻选优先级最高（数字最小）。', 'Pick min priority each tick. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'preemptive', 'priority']],
  impl: `${JOB_IFACE}
export interface PpHooks { onRun?: (id: string, time: number) => void; onResult?: (r: SchedResult) => void; }
export function priorityPreemptive(jobs: Job[], hooks: PpHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => ((a.priority ?? 0) < (b.priority ?? 0) ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onRun?.(pick.id, time);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); }
  }
  let totalWait = 0, totalTurn = 0;
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityPreemptive, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 4, priority: 2 }, { id: 'B', arrival: 1, burst: 3, priority: 1 }, { id: 'C', arrival: 2, burst: 1, priority: 3 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级抢占', en: 'Priority preemptive' }).commit();
  const r = priorityPreemptive(input, { onRun: (id, t) => rec.begin({ zh: t + ': ' + id, en: t + ': ' + id }).setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityPreemptive } from '../../src/algorithms/scheduling/sched-priority-preempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-preempt/trace.ts';
test('priorityPreemptive 正确', () => {
  const r = priorityPreemptive([{ id: 'A', arrival: 0, burst: 4, priority: 2 }, { id: 'B', arrival: 1, burst: 3, priority: 1 }, { id: 'C', arrival: 2, burst: 1, priority: 3 }]);
  assert.ok(r.segments.length >= 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. sched-virtual-round-robin  —— 虚拟轮转（I/O 密集优先）
ALGS.push({
  id: 'sched-virtual-round-robin',
  m: ['虚拟轮转', 'Virtual Round Robin', 'I/O 阻塞进程进入更高优先级队列。', 'I/O-blocked processes get a higher-priority queue.',
    'I/O 完成后入辅助队列优先调度。', 'After I/O, enter aux queue first. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'round-robin', 'io']],
  impl: `${JOB_IFACE}
export interface IoJob extends Job { ioAt: number; ioDur: number; }
export interface VrrHooks { onRun?: (id: string, queue: string, time: number) => void; onResult?: (r: SchedResult) => void; }
export function virtualRR(jobs: IoJob[], quantum: number, hooks: VrrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const mainQ: IoJob[] = []; const auxQ: IoJob[] = [];
  const blocked: Array<{ j: IoJob; until: number }> = [];
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0, mi = 0;
  while (rem.size) {
    while (mi < sorted.length && sorted[mi]!.arrival <= time) mainQ.push(sorted[mi]!), mi++;
    for (let b = blocked.length - 1; b >= 0; b--) if (blocked[b]!.until <= time) { auxQ.push(blocked[b]!.j); blocked.splice(b, 1); }
    let j: IoJob | undefined = auxQ.shift() ?? mainQ.shift();
    if (!j) { const next = Math.min(...sorted.slice(mi).map((x) => x.arrival), ...blocked.map((b) => b.until)); time = next; continue; }
    const q = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + q });
    hooks.onRun?.(j.id, auxQ.includes(j) ? 'aux' : 'main', time);
    rem.set(j.id, rem.get(j.id)! - q);
    time += q;
    if (j.ioAt > 0 && j.ioAt === j.burst - rem.get(j.id) && rem.get(j.id)! > 0) { blocked.push({ j, until: time + j.ioDur }); }
    else if (rem.get(j.id) === 0) { finish.set(j.id, time); rem.delete(j.id); }
    else mainQ.push(j);
  }
  let totalWait = 0, totalTurn = 0;
  for (const job of jobs) { totalTurn += finish.get(job.id)! - job.arrival; totalWait += finish.get(job.id)! - job.arrival - job.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { virtualRR, type IoJob } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 5, ioAt: 2, ioDur: 2 }, { id: 'B', arrival: 0, burst: 3, ioAt: 0, ioDur: 0 }] as IoJob[], quantum: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '虚拟轮转 q=' + input.quantum, en: 'VRR q=' + input.quantum }).commit();
  const r = virtualRR(input.jobs, input.quantum, { onRun: (id, q, t) => rec.begin({ zh: t + ': ' + id + ' (' + q + ')', en: t + ': ' + id + ' (' + q + ')' }).setAux([{ label: 'queue', value: q, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { virtualRR } from '../../src/algorithms/scheduling/sched-virtual-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-virtual-round-robin/trace.ts';
test('virtualRR 正确', () => {
  const r = virtualRR([{ id: 'A', arrival: 0, burst: 4, ioAt: 0, ioDur: 0 }, { id: 'B', arrival: 0, burst: 2, ioAt: 0, ioDur: 0 }], 2);
  assert.ok(r.segments.length >= 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. sched-highest-priority-first  —— 最高优先级优先（非抢占，FCFS tie）
ALGS.push({
  id: 'sched-hpf-nonpreempt',
  m: ['最高优先级先服务', 'Highest Priority First', '非抢占选最高优先级，同优先级 FCFS。', 'Non-preemptive, highest priority, FCFS tie.',
    '就绪选最高优先级。', 'Pick highest priority from ready. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'priority']],
  impl: `${JOB_IFACE}
export interface HpfHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function hpf(jobs: Job[], hooks: HpfHooks = {}): SchedResult {
  const rem = [...jobs];
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (rem.length) {
    const ready = rem.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = rem.reduce((a, b) => (a.arrival < b.arrival ? a : b)); time = pick.arrival; }
    else pick = ready.reduce((a, b) => {
      const pa = a.priority ?? 0, pb = b.priority ?? 0;
      if (pa !== pb) return pa < pb ? a : b;
      return a.arrival < b.arrival ? a : b;
    });
    rem.splice(rem.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hpf, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 3, priority: 2 }, { id: 'B', arrival: 0, burst: 2, priority: 1 }, { id: 'C', arrival: 0, burst: 1, priority: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'HPF 非抢占', en: 'HPF' }).commit();
  const r = hpf(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id + ' P' + j.priority, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hpf } from '../../src/algorithms/scheduling/sched-hpf-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-hpf-nonpreempt/trace.ts';
test('hpf 正确', () => {
  const r = hpf([{ id: 'A', arrival: 0, burst: 3, priority: 2 }, { id: 'B', arrival: 0, burst: 2, priority: 1 }, { id: 'C', arrival: 0, burst: 1, priority: 1 }]);
  assert.equal(r.order[0], 'B');
  assert.equal(r.order[1], 'C');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. sched-cfs  —— CFS 完全公平调度（简化）
ALGS.push({
  id: 'sched-cfs',
  m: ['完全公平调度CFS', 'Completely Fair Scheduler (CFS)', '按 vruntime 最小选择，模拟 Linux CFS。', 'Pick min vruntime, simulating Linux CFS.',
    '每次选 vruntime 最小者运行一拍。', 'Run min vruntime one tick. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'cfs']],
  impl: `${JOB_IFACE}
export interface CfsJob extends Job { weight: number; }
export interface CfsHooks { onRun?: (id: string, vrun: number, time: number) => void; onResult?: (r: SchedResult) => void; }
export function cfs(jobs: CfsJob[], hooks: CfsHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const vrun = new Map(jobs.map((j) => [j.id, 0]));
  const done = new Set<string>();
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => (vrun.get(a.id)! <= vrun.get(b.id)! ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onRun?.(pick.id, vrun.get(pick.id)!, time);
    vrun.set(pick.id, vrun.get(pick.id)! + 1024 / pick.weight);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); }
  }
  let totalWait = 0, totalTurn = 0;
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cfs, type CfsJob } from './impl.ts';
export const DEFAULT_INPUT: CfsJob[] = [{ id: 'A', arrival: 0, burst: 3, weight: 1 }, { id: 'B', arrival: 0, burst: 3, weight: 2 }, { id: 'C', arrival: 0, burst: 3, weight: 3 }];
export function buildTrace(input: CfsJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CFS', en: 'CFS' }).commit();
  const r = cfs(input, { onRun: (id, v, t) => rec.begin({ zh: t + ': ' + id + ' vr=' + v.toFixed(0), en: t + ': ' + id + ' vr=' + v.toFixed(0) }).setAux([{ label: 'vr', value: v.toFixed(0), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cfs } from '../../src/algorithms/scheduling/sched-cfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-cfs/trace.ts';
test('cfs 正确', () => {
  const r = cfs([{ id: 'A', arrival: 0, burst: 3, weight: 1 }, { id: 'B', arrival: 0, burst: 3, weight: 1 }]);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. sched-lcfs  —— 后到先服务
ALGS.push({
  id: 'sched-lcfs',
  m: ['后到先服务', 'Last Come First Served', '后到达的进程先执行（栈式）。', 'Last-arrived process runs first (stack).',
    '用栈，弹出栈顶。', 'Stack pop. O(n).', 'O(n)', 'O(n)', ['scheduling', 'lcfs']],
  impl: `${JOB_IFACE}
export interface LcfsHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function lcfs(jobs: Job[], hooks: LcfsHooks = {}): SchedResult {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  const stack: Job[] = [];
  let i = 0;
  while (stack.length || i < sorted.length) {
    while (i < sorted.length && sorted[i]!.arrival <= time) stack.push(sorted[i]!), i++;
    if (!stack.length) { time = sorted[i]!.arrival; continue; }
    const j = stack.pop()!;
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait; totalTurn += wait + j.burst;
    hooks.onPick?.(j, time);
    order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + j.burst });
    time += j.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcfs, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 1, burst: 2 }, { id: 'C', arrival: 2, burst: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LCFS', en: 'LCFS' }).commit();
  const r = lcfs(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcfs } from '../../src/algorithms/scheduling/sched-lcfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-lcfs/trace.ts';
test('lcfs 正确', () => {
  const r = lcfs([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 1, burst: 2 }, { id: 'C', arrival: 2, burst: 1 }]);
  assert.equal(r.order[0], 'A');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. sched-fcfs-with-overhead  —— FCFS（带切换开销）
ALGS.push({
  id: 'sched-fcfs-overhead',
  m: ['FCFS带切换开销', 'FCFS with Context Switch Overhead', 'FCFS 加上进程切换固定开销。', 'FCFS with fixed context-switch overhead.',
    '每次切换加 overhead 时间。', 'Add overhead on each switch. O(n).', 'O(n)', 'O(n)', ['scheduling', 'fcfs', 'overhead']],
  impl: `${JOB_IFACE}
export interface FcOhHooks { onPick?: (j: Job, time: number) => void; onSwitch?: (time: number) => void; onResult?: (r: SchedResult) => void; }
export function fcfsOverhead(jobs: Job[], overhead: number, hooks: FcOhHooks = {}): SchedResult {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  for (let i = 0; i < sorted.length; i++) {
    const j = sorted[i]!;
    if (j.arrival > time) time = j.arrival;
    if (i > 0) { hooks.onSwitch?.(time); time += overhead; }
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait; totalTurn += wait + j.burst;
    hooks.onPick?.(j, time);
    order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + j.burst });
    time += j.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fcfsOverhead, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }, { id: 'C', arrival: 0, burst: 1 }] as Job[], overhead: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FCFS 开销=' + input.overhead, en: 'FCFS oh=' + input.overhead }).commit();
  const r = fcfsOverhead(input.jobs, input.overhead, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit(), onSwitch: (t) => rec.begin({ zh: t + ': 切换', en: t + ': switch' }).setAux([{ label: 'switch', value: '1', role: 'swap' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fcfsOverhead } from '../../src/algorithms/scheduling/sched-fcfs-overhead/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-fcfs-overhead/trace.ts';
test('fcfsOverhead 正确', () => {
  const r = fcfsOverhead([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }], 1);
  assert.deepEqual(r.order, ['A','B']);
  assert.equal(r.segments[1]!.start, 4);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. sched-batch-sequential  —— 批处理顺序调度
ALGS.push({
  id: 'sched-batch-sequential',
  m: ['批处理顺序调度', 'Batch Sequential Scheduling', '按提交顺序无切换执行批处理作业。', 'Run batch jobs in submission order, no switches.',
    '简单 FIFO，零切换。', 'Simple FIFO zero switch. O(n).', 'O(n)', 'O(n)', ['scheduling', 'batch']],
  impl: `${JOB_IFACE}
export interface BsHooks { onRun?: (j: Job, start: number) => void; onResult?: (r: SchedResult) => void; }
export function batchSequential(jobs: Job[], hooks: BsHooks = {}): SchedResult {
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  for (const j of jobs) {
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait; totalTurn += wait + j.burst;
    hooks.onRun?.(j, time);
    order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + j.burst });
    time += j.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchSequential, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'J1', arrival: 0, burst: 5 }, { id: 'J2', arrival: 0, burst: 3 }, { id: 'J3', arrival: 0, burst: 2 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '批处理顺序', en: 'Batch sequential' }).commit();
  const r = batchSequential(input, { onRun: (j, s) => rec.begin({ zh: s + ': ' + j.id, en: s + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { batchSequential } from '../../src/algorithms/scheduling/sched-batch-sequential/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-batch-sequential/trace.ts';
test('batchSequential 正确', () => {
  const r = batchSequential([{ id: 'J1', arrival: 0, burst: 5 }, { id: 'J2', arrival: 0, burst: 3 }]);
  assert.deepEqual(r.order, ['J1','J2']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. sched-interactive-rr  —— 交互式轮转（短量子）
ALGS.push({
  id: 'sched-interactive-rr',
  m: ['交互式轮转', 'Interactive Round Robin', '短量子保持响应性，适用于交互系统。', 'Short quantum for responsiveness in interactive systems.',
    '极短 RR 量子。', 'Very short RR quantum. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'round-robin', 'interactive']],
  impl: `${JOB_IFACE}
export interface IrrHooks { onRun?: (id: string, start: number, dur: number) => void; onResult?: (r: SchedResult) => void; }
export function interactiveRR(jobs: Job[], quantum: number, hooks: IrrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q: Job[] = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let totalWait = 0, totalTurn = 0;
  while (q.length) {
    const j = q.shift()!;
    if (j.arrival > time) { time = j.arrival; }
    const run = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    if (rem.get(j.id) === 0) finish.set(j.id, time); else q.push(j);
  }
  for (const job of jobs) if (finish.has(job.id)) { totalTurn += finish.get(job.id)! - job.arrival; totalWait += finish.get(job.id)! - job.arrival - job.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interactiveRR, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 0, burst: 2 }] as Job[], quantum: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '交互式RR q=' + input.quantum, en: 'IRR q=' + input.quantum }).commit();
  const r = interactiveRR(input.jobs, input.quantum, { onRun: (id, s, d) => rec.begin({ zh: s + ': ' + id + 'x' + d, en: s + ': ' + id }).setAux([{ label: 'run', value: id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interactiveRR } from '../../src/algorithms/scheduling/sched-interactive-rr/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-interactive-rr/trace.ts';
test('interactiveRR 正确', () => {
  const r = interactiveRR([{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 0, burst: 2 }], 1);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. sched-cpu-utilization  —— CPU 利用率计算
ALGS.push({
  id: 'sched-cpu-utilization',
  m: ['CPU利用率计算', 'CPU Utilization Calculation', '从调度结果计算 CPU 利用率。', 'Compute CPU utilization from schedule result.',
    '利用率 = 总burst / 总时间。', 'util = sum(burst) / total. O(n).', 'O(n)', 'O(1)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface UtilHooks { onCalc?: (util: number, idle: number) => void; onResult?: (util: number) => void; }
export function cpuUtilization(jobs: Job[], hooks: UtilHooks = {}): number {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0, busy = 0;
  for (const j of sorted) {
    if (j.arrival > time) time = j.arrival;
    busy += j.burst;
    time += j.burst;
  }
  const total = time - sorted[0]!.arrival;
  const idle = total - busy;
  const util = total === 0 ? 1 : busy / total;
  hooks.onCalc?.(util, idle);
  hooks.onResult?.(util);
  return util;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cpuUtilization, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 2, burst: 3 }, { id: 'C', arrival: 8, burst: 2 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CPU 利用率', en: 'CPU utilization' }).commit();
  const u = cpuUtilization(input, { onCalc: (util, idle) => rec.begin({ zh: 'busy=' + (util * 100).toFixed(0) + '% idle=' + idle, en: 'busy=' + (util * 100).toFixed(0) + '%' }).setAux([{ label: 'idle', value: String(idle), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '利用率 = ' + (u * 100).toFixed(1) + '%', en: 'util = ' + (u * 100).toFixed(1) + '%' }).setAux([{ label: 'util', value: (u * 100).toFixed(1) + '%', role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpuUtilization } from '../../src/algorithms/scheduling/sched-cpu-utilization/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-cpu-utilization/trace.ts';
test('cpuUtilization 正确', () => {
  const u = cpuUtilization([{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 2, burst: 3 }, { id: 'C', arrival: 8, burst: 2 }]);
  assert.ok(u > 0 && u <= 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. sched-arrival-sort  —— 到达时间排序调度
ALGS.push({
  id: 'sched-arrival-sort',
  m: ['到达时间排序', 'Arrival Time Sort Scheduling', '按到达时间升序调度（同 FCFS 但显式排序）。', 'Schedule by ascending arrival time.',
    '稳定排序后顺序执行。', 'Stable sort then run. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'sort']],
  impl: `${JOB_IFACE}
export interface AsHooks { onRun?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function arrivalSortSchedule(jobs: Job[], hooks: AsHooks = {}): SchedResult {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  for (const j of sorted) {
    if (j.arrival > time) time = j.arrival;
    const wait = time - j.arrival;
    totalWait += wait; totalTurn += wait + j.burst;
    hooks.onRun?.(j, time);
    order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + j.burst });
    time += j.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arrivalSortSchedule, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'C', arrival: 5, burst: 2 }, { id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 2, burst: 3 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '到达排序', en: 'Arrival sort' }).commit();
  const r = arrivalSortSchedule(input, { onRun: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrivalSortSchedule } from '../../src/algorithms/scheduling/sched-arrival-sort/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-arrival-sort/trace.ts';
test('arrivalSortSchedule 正确', () => {
  const r = arrivalSortSchedule([{ id: 'C', arrival: 5, burst: 2 }, { id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 2, burst: 3 }]);
  assert.deepEqual(r.order, ['A','B','C']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. sched-metrics  —— 调度指标计算
ALGS.push({
  id: 'sched-metrics',
  m: ['调度指标计算', 'Scheduling Metrics', '从甘特段计算等待/周转/响应时间。', 'Compute wait/turnaround/response from Gantt segments.',
    '按段汇总每进程指标。', 'Aggregate per-process metrics. O(n*k).', 'O(n*k)', 'O(n)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface MetricResult { id: string; wait: number; turnaround: number; response: number; }
export interface MtrHooks { onMetric?: (m: MetricResult) => void; onResult?: (avg: { wait: number; turnaround: number; response: number }) => void; }
export function computeMetrics(jobs: Job[], segments: Segment[], hooks: MtrHooks = {}): MetricResult[] {
  const firstRun = new Map<string, number>();
  const finish = new Map<string, number>();
  for (const s of segments) { if (!firstRun.has(s.id)) firstRun.set(s.id, s.start); finish.set(s.id, Math.max(finish.get(s.id) ?? 0, s.end)); }
  const out: MetricResult[] = [];
  for (const j of jobs) {
    const fr = firstRun.get(j.id) ?? j.arrival;
    const fin = finish.get(j.id) ?? j.arrival + j.burst;
    const m = { id: j.id, wait: fin - j.arrival - j.burst, turnaround: fin - j.arrival, response: fr - j.arrival };
    out.push(m); hooks.onMetric?.(m);
  }
  const n = jobs.length;
  const avg = { wait: out.reduce((s, m) => s + m.wait, 0) / n, turnaround: out.reduce((s, m) => s + m.turnaround, 0) / n, response: out.reduce((s, m) => s + m.response, 0) / n };
  hooks.onResult?.(avg);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computeMetrics, type Job, type Segment } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }] as Job[], segments: [{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 3, end: 5 }] as Segment[] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '调度指标', en: 'Metrics' }).commit();
  const ms = computeMetrics(input.jobs, input.segments, { onMetric: (m) => rec.begin({ zh: m.id + ': 等' + m.wait + ' 转' + m.turnaround, en: m.id + ': w' + m.wait + ' t' + m.turnaround }).setBars([{ value: m.wait, role: 'pivot' as BarRole, label: m.id }]).commit() });
  const avgW = ms.reduce((s, m) => s + m.wait, 0) / ms.length;
  rec.begin({ zh: '平均等待 ' + avgW.toFixed(2), en: 'avg wait ' + avgW.toFixed(2) }).setAux([{ label: 'avgWait', value: avgW.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeMetrics } from '../../src/algorithms/scheduling/sched-metrics/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-metrics/trace.ts';
test('computeMetrics 正确', () => {
  const ms = computeMetrics([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }], [{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 3, end: 5 }]);
  assert.equal(ms[0]!.wait, 0);
  assert.equal(ms[1]!.wait, 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. sched-greedy-load-balance  —— 贪心负载均衡（LPT）
ALGS.push({
  id: 'sched-greedy-load-balance',
  m: ['LPT负载均衡', 'LPT Load Balancing', '长作业优先分配到当前最闲的机器。', 'Assign longest job to least-loaded machine (LPT).',
    '按 burst 降序，每次放最闲机器。', 'Sort desc, place on min-load. O(n log n).', 'O(n log n)', 'O(m)', ['scheduling', 'load-balance', 'lpt']],
  impl: `${JOB_IFACE}
export interface LbHooks { onAssign?: (j: Job, machine: number) => void; onResult?: (loads: number[]) => void; }
export function lptLoadBalance(jobs: Job[], machines: number, hooks: LbHooks = {}): number[] {
  const loads = new Array(machines).fill(0);
  const sorted = [...jobs].sort((a, b) => b.burst - a.burst);
  for (const j of sorted) {
    let mi = 0; for (let i = 1; i < machines; i++) if (loads[i]! < loads[mi]!) mi = i;
    hooks.onAssign?.(j, mi);
    loads[mi] += j.burst;
  }
  hooks.onResult?.(loads);
  return loads;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lptLoadBalance, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 3 }, { id: 'D', arrival: 0, burst: 2 }] as Job[], machines: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LPT ' + input.machines + ' 机', en: 'LPT ' + input.machines + ' machines' }).commit();
  const loads = lptLoadBalance(input.jobs, input.machines, { onAssign: (j, mi) => rec.begin({ zh: j.id + ' → 机 ' + mi, en: j.id + ' → M' + mi }).setBars(loads.map((l, i) => ({ value: l, role: 'pivot' as BarRole, label: 'M' + i }))).commit() });
  rec.begin({ zh: '负载 [' + loads.join(',') + ']', en: 'loads [' + loads.join(',') + ']' }).setBars(loads.map((l, i) => ({ value: l, role: 'final' as BarRole, label: 'M' + i }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lptLoadBalance } from '../../src/algorithms/scheduling/sched-greedy-load-balance/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-greedy-load-balance/trace.ts';
test('lptLoadBalance 正确', () => {
  const loads = lptLoadBalance([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 3 }, { id: 'D', arrival: 0, burst: 2 }], 2);
  assert.equal(loads.length, 2);
  assert.equal(loads[0]! + loads[1]!, 14);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. sched-sjf-approx  —— 估计式SJF（指数平均）
ALGS.push({
  id: 'sched-sjf-approx',
  m: ['指数平均估计SJF', 'SJF with Exponential Averaging', '用历史估计下次 burst（指数平滑）。', 'Estimate next burst via exponential averaging.',
    'next = α*actual + (1-α)*prev。', 'next = α*actual + (1-α)*prev. O(n).', 'O(n)', 'O(n)', ['scheduling', 'estimation']],
  impl: `${JOB_IFACE}
export interface EaJob { id: string; bursts: number[]; }
export interface Ea2Hooks { onEstimate?: (id: string, est: number) => void; onResult?: (ests: Map<string, number>) => void; }
export function exponentialAveraging(jobs: EaJob[], alpha: number, hooks: Ea2Hooks = {}): Map<string, number> {
  const est = new Map<string, number>();
  for (const j of jobs) {
    let t = j.bursts[0] ?? 1;
    for (let i = 1; i < j.bursts.length; i++) t = alpha * j.bursts[i]! + (1 - alpha) * t;
    est.set(j.id, t);
    hooks.onEstimate?.(j.id, t);
  }
  hooks.onResult?.(est);
  return est;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exponentialAveraging, type EaJob } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', bursts: [10, 6, 8, 5] }, { id: 'B', bursts: [3, 4, 2, 5] }] as EaJob[], alpha: 0.5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '指数平均 α=' + input.alpha, en: 'Exp avg α=' + input.alpha }).commit();
  const est = exponentialAveraging(input.jobs, input.alpha, { onEstimate: (id, e) => rec.begin({ zh: id + ' 估计 ' + e.toFixed(2), en: id + ' est ' + e.toFixed(2) }).setAux([{ label: 'est', value: e.toFixed(2), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setBars([...est.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialAveraging } from '../../src/algorithms/scheduling/sched-sjf-approx/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-sjf-approx/trace.ts';
test('exponentialAveraging 正确', () => {
  const est = exponentialAveraging([{ id: 'A', bursts: [10, 6, 8, 5] }], 0.5);
  assert.ok(est.get('A')! > 0);
  assert.ok(est.get('A')! < 10);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. sched-response-ratio  —— 响应比单独计算
ALGS.push({
  id: 'sched-response-ratio',
  m: ['响应比计算', 'Response Ratio Calculator', '计算各进程在某时刻的响应比。', 'Compute response ratio of each process at a time.',
    'R = (wait + burst) / burst。', 'R = (wait+burst)/burst. O(n).', 'O(n)', 'O(n)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface Rr2Hooks { onRatio?: (id: string, ratio: number) => void; onResult?: (ratios: Map<string, number>) => void; }
export function responseRatios(jobs: Job[], time: number, hooks: Rr2Hooks = {}): Map<string, number> {
  const out = new Map<string, number>();
  for (const j of jobs) {
    const wait = Math.max(0, time - j.arrival);
    const r = (wait + j.burst) / j.burst;
    out.set(j.id, r);
    hooks.onRatio?.(j.id, r);
  }
  hooks.onResult?.(out);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { responseRatios, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 2 }, { id: 'B', arrival: 0, burst: 4 }, { id: 'C', arrival: 0, burst: 8 }] as Job[], time: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '响应比 t=' + input.time, en: 'Ratio t=' + input.time }).commit();
  const rs = responseRatios(input.jobs, input.time, { onRatio: (id, r) => rec.begin({ zh: id + ' R=' + r.toFixed(2), en: id + ' R=' + r.toFixed(2) }).setBars([{ value: r, role: 'pivot' as BarRole, label: id }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setBars([...rs.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { responseRatios } from '../../src/algorithms/scheduling/sched-response-ratio/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-response-ratio/trace.ts';
test('responseRatios 正确', () => {
  const rs = responseRatios([{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 0, burst: 2 }], 4);
  assert.equal(rs.get('A'), 2);
  assert.equal(rs.get('B'), 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. sched-precedence  —— 优先约束调度（拓扑+最长路径）
ALGS.push({
  id: 'sched-precedence',
  m: ['优先约束调度', 'Precedence Constraint Scheduling', '任务有先序约束，按拓扑序调度。', 'Schedule tasks with precedence via topological order.',
    '拓扑排序后逐个执行。', 'Topo sort then execute. O(V+E).', 'O(V+E)', 'O(V)', ['scheduling', 'precedence', 'topological']],
  impl: `${JOB_IFACE}
export interface PrecTask extends Job { deps: string[]; }
export interface PcHooks { onRun?: (j: PrecTask, time: number) => void; onResult?: (r: SchedResult) => void; }
export function precedenceSchedule(tasks: PrecTask[], hooks: PcHooks = {}): SchedResult {
  const indeg = new Map(tasks.map((t) => [t.id, 0]));
  const adj = new Map(tasks.map((t) => [t.id, [] as string[]]));
  for (const t of tasks) for (const d of t.deps) { adj.get(d)!.push(t.id); indeg.set(t.id, (indeg.get(t.id) ?? 0) + 1); }
  const q: string[] = [];
  for (const [id, d] of indeg) if (d === 0) q.push(id);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (q.length) {
    const id = q.shift()!;
    const j = byId.get(id)!;
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait; totalTurn += wait + j.burst;
    hooks.onRun?.(j, time);
    order.push(id);
    segments.push({ id, start: time, end: time + j.burst });
    time += j.burst;
    for (const v of adj.get(id) ?? []) { indeg.set(v, (indeg.get(v) ?? 0) - 1); if (indeg.get(v) === 0) q.push(v); }
  }
  const r = { order, segments, avgWait: totalWait / tasks.length, avgTurnaround: totalTurn / tasks.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { precedenceSchedule, type PrecTask } from './impl.ts';
export const DEFAULT_INPUT: PrecTask[] = [{ id: 'A', arrival: 0, burst: 2, deps: [] }, { id: 'B', arrival: 0, burst: 3, deps: ['A'] }, { id: 'C', arrival: 0, burst: 1, deps: ['A'] }, { id: 'D', arrival: 0, burst: 2, deps: ['B', 'C'] }];
export function buildTrace(input: PrecTask[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先约束调度', en: 'Precedence' }).commit();
  const r = precedenceSchedule(input, { onRun: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precedenceSchedule } from '../../src/algorithms/scheduling/sched-precedence/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-precedence/trace.ts';
test('precedenceSchedule 正确', () => {
  const r = precedenceSchedule([{ id: 'A', arrival: 0, burst: 2, deps: [] }, { id: 'B', arrival: 0, burst: 3, deps: ['A'] }, { id: 'C', arrival: 0, burst: 1, deps: ['A'] }, { id: 'D', arrival: 0, burst: 2, deps: ['B', 'C'] }]);
  assert.equal(r.order[0], 'A');
  assert.equal(r.order[r.order.length - 1], 'D');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. sched-multicore-fcfs  —— 多核FCFS
ALGS.push({
  id: 'sched-multicore-fcfs',
  m: ['多核FCFS', 'Multicore FCFS', '把 FCFS 队列分发到多个核心。', 'Distribute FCFS queue across multiple cores.',
    '每任务分配到最早空闲核。', 'Assign to earliest-idle core. O(n*m).', 'O(n*m)', 'O(m)', ['scheduling', 'multicore', 'fcfs']],
  impl: `${JOB_IFACE}
export interface McHooks { onAssign?: (j: Job, core: number, start: number) => void; onResult?: (loads: number[]) => void; }
export function multicoreFCFS(jobs: Job[], cores: number, hooks: McHooks = {}): number[] {
  const avail = new Array(cores).fill(0);
  for (const j of [...jobs].sort((a, b) => a.arrival - b.arrival)) {
    let c = 0; for (let i = 1; i < cores; i++) if (avail[i]! < avail[c]!) c = i;
    const start = Math.max(avail[c]!, j.arrival);
    hooks.onAssign?.(j, c, start);
    avail[c] = start + j.burst;
  }
  hooks.onResult?.(avail);
  return avail;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multicoreFCFS, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 4 }, { id: 'D', arrival: 0, burst: 2 }] as Job[], cores: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多核FCFS ' + input.cores + ' 核', en: 'Multicore FCFS' }).commit();
  const loads = multicoreFCFS(input.jobs, input.cores, { onAssign: (j, c, s) => rec.begin({ zh: s + ': ' + j.id + ' → 核' + c, en: s + ': ' + j.id + ' → C' + c }).setAux([{ label: 'core', value: String(c), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '负载 [' + loads.join(',') + ']', en: 'loads [' + loads.join(',') + ']' }).setBars(loads.map((l, i) => ({ value: l, role: 'final' as BarRole, label: 'C' + i }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multicoreFCFS } from '../../src/algorithms/scheduling/sched-multicore-fcfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-multicore-fcfs/trace.ts';
test('multicoreFCFS 正确', () => {
  const loads = multicoreFCFS([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 4 }, { id: 'D', arrival: 0, burst: 2 }], 2);
  assert.equal(loads[0]! + loads[1]!, 14);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. sched-idle-detect  —— 空闲时间检测
ALGS.push({
  id: 'sched-idle-detect',
  m: ['空闲时间检测', 'Idle Time Detection', '从甘特段中找出所有 CPU 空闲区间。', 'Find all CPU idle intervals from Gantt segments.',
    '排序段，找间隙。', 'Sort segments, find gaps. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface Idle { start: number; end: number; }
export interface IdHooks { onIdle?: (i: Idle) => void; onResult?: (idles: Idle[]) => void; }
export function detectIdle(segments: Segment[], total: number, hooks: IdHooks = {}): Idle[] {
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const idles: Idle[] = [];
  let t = 0;
  for (const s of sorted) {
    if (s.start > t) { const i = { start: t, end: s.start }; idles.push(i); hooks.onIdle?.(i); }
    t = Math.max(t, s.end);
  }
  if (t < total) { const i = { start: t, end: total }; idles.push(i); hooks.onIdle?.(i); }
  hooks.onResult?.(idles);
  return idles;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectIdle, type Segment } from './impl.ts';
export const DEFAULT_INPUT = { segments: [{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 5, end: 7 }] as Segment[], total: 8 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '空闲检测', en: 'Idle detect' }).commit();
  const idles = detectIdle(input.segments, input.total, { onIdle: (i) => rec.begin({ zh: '空闲 ' + i.start + '-' + i.end, en: 'idle ' + i.start + '-' + i.end }).setBars([{ value: i.end - i.start, role: 'warn' as BarRole, label: 'idle' }]).commit() });
  rec.begin({ zh: '共 ' + idles.length + ' 段空闲', en: idles.length + ' idles' }).setAux([{ label: 'count', value: String(idles.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectIdle } from '../../src/algorithms/scheduling/sched-idle-detect/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-idle-detect/trace.ts';
test('detectIdle 正确', () => {
  const idles = detectIdle([{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 5, end: 7 }], 8);
  assert.equal(idles.length, 1);
  assert.equal(idles[0]!.start, 3);
  assert.equal(idles[0]!.end, 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. sched-throughput  —— 吞吐量计算
ALGS.push({
  id: 'sched-throughput',
  m: ['吞吐量计算', 'Throughput Calculation', '单位时间完成的进程数。', 'Number of processes completed per unit time.',
    '吞吐 = 进程数 / 总时间。', 'throughput = n / total. O(1).', 'O(1)', 'O(1)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface ThHooks { onResult?: (throughput: number) => void; }
export function throughput(jobs: Job[], totalTime: number, hooks: ThHooks = {}): number {
  const t = totalTime === 0 ? 0 : jobs.length / totalTime;
  hooks.onResult?.(t);
  return t;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { throughput, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }] as Job[], total: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '吞吐量', en: 'Throughput' }).commit();
  const t = throughput(input.jobs, input.total, { onResult: (tp) => rec.begin({ zh: '完成 ' + input.jobs.length + ' / ' + input.total + ' = ' + tp.toFixed(2), en: tp.toFixed(2) + ' proc/unit' }).setAux([{ label: 'tp', value: tp.toFixed(3), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '吞吐 = ' + t.toFixed(3), en: 'throughput = ' + t.toFixed(3) }).setAux([{ label: 'throughput', value: t.toFixed(3), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { throughput } from '../../src/algorithms/scheduling/sched-throughput/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-throughput/trace.ts';
test('throughput 正确', () => {
  assert.equal(throughput([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }], 10), 0.2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. sched-priority-inheritance  —— 优先级继承（资源锁）
ALGS.push({
  id: 'sched-priority-inheritance',
  m: ['优先级继承', 'Priority Inheritance', '低优先级持锁者临时继承等待者的高优先级。', 'Lock holder temporarily inherits waiter priority.',
    '持锁者优先级 = max(自己, 等待者)。', 'Holder pri = max(self, waiters). O(n).', 'O(n)', 'O(n)', ['scheduling', 'priority', 'lock']],
  impl: `${JOB_IFACE}
export interface PiJob extends Job { holding: string[]; }
export interface PiHooks { onInherit?: (id: string, newPri: number) => void; onResult?: (p: Map<string, number>) => void; }
export function priorityInheritance(jobs: PiJob[], blockedOn: Map<string, string>, hooks: PiHooks = {}): Map<string, number> {
  const eff = new Map(jobs.map((j) => [j.id, j.priority ?? 0]));
  for (const [waiter, res] of blockedOn) {
    const holder = jobs.find((j) => j.holding.includes(res));
    if (holder) {
      const newPri = Math.min(eff.get(holder.id)!, eff.get(waiter) ?? 0);
      if (newPri < eff.get(holder.id)!) { eff.set(holder.id, newPri); hooks.onInherit?.(holder.id, newPri); }
    }
  }
  hooks.onResult?.(eff);
  return eff;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityInheritance, type PiJob } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'L', arrival: 0, burst: 1, priority: 5, holding: ['R'] }, { id: 'H', arrival: 0, burst: 1, priority: 1, holding: [] }] as PiJob[], blocked: new Map([['H', 'R']]) };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级继承', en: 'Priority inheritance' }).commit();
  const eff = priorityInheritance(input.jobs, input.blocked, { onInherit: (id, np) => rec.begin({ zh: id + ' 继承 P=' + np, en: id + ' inherit P=' + np }).setAux([{ label: 'newPri', value: String(np), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setBars([...eff.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityInheritance } from '../../src/algorithms/scheduling/sched-priority-inheritance/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-inheritance/trace.ts';
test('priorityInheritance 正确', () => {
  const eff = priorityInheritance([{ id: 'L', arrival: 0, burst: 1, priority: 5, holding: ['R'] }, { id: 'H', arrival: 0, burst: 1, priority: 1, holding: [] }], new Map([['H', 'R']]));
  assert.equal(eff.get('L'), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. sched-llf  —— 最松弛优先
ALGS.push({
  id: 'sched-llf',
  m: ['最松弛优先', 'Least Laxity First', '实时调度：选松弛度最小的进程。', 'Real-time: pick process with least laxity.',
    '松弛 = deadline - time - remaining。', 'laxity = deadline - time - rem. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'real-time', 'llf']],
  impl: `${JOB_IFACE}
export interface LlfJob extends Job { deadline: number; }
export interface LlfHooks { onTick?: (id: string, lax: number) => void; onResult?: (r: { order: string[]; missed: number }) => void; }
export function llf(jobs: LlfJob[], hooks: LlfHooks = {}): { order: string[]; missed: number } {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const order: string[] = [];
  let time = 0, missed = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => {
      const la = a.deadline - time - rem.get(a.id)!;
      const lb = b.deadline - time - rem.get(b.id)!;
      return la <= lb ? a : b;
    });
    const lax = pick.deadline - time - rem.get(pick.id)!;
    if (!order.includes(pick.id) || order[order.length - 1] !== pick.id) order.push(pick.id);
    hooks.onTick?.(pick.id, lax);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); if (time > pick.deadline) missed++; }
  }
  hooks.onResult?.({ order, missed });
  return { order, missed };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { llf, type LlfJob } from './impl.ts';
export const DEFAULT_INPUT: LlfJob[] = [{ id: 'A', arrival: 0, burst: 2, deadline: 5 }, { id: 'B', arrival: 0, burst: 3, deadline: 6 }];
export function buildTrace(input: LlfJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LLF', en: 'LLF' }).commit();
  const { order, missed } = llf(input, { onTick: (id, lax) => rec.begin({ zh: id + ' 松弛 ' + lax, en: id + ' lax ' + lax }).setAux([{ label: 'lax', value: String(lax), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '错过 ' + missed, en: missed + ' missed' }).setBars(order.map((o, i) => ({ value: i, role: 'final' as BarRole, label: o }))).setAux([{ label: 'missed', value: String(missed), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { llf } from '../../src/algorithms/scheduling/sched-llf/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-llf/trace.ts';
test('llf 正确', () => {
  const { order, missed } = llf([{ id: 'A', arrival: 0, burst: 2, deadline: 5 }, { id: 'B', arrival: 0, burst: 3, deadline: 6 }]);
  assert.ok(order.length >= 2);
  assert.equal(missed, 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. sched-srt-simplified  —— 简化最短剩余
ALGS.push({
  id: 'sched-srt-simplified',
  m: ['简化最短剩余', 'Simplified Shortest Remaining', '每进程执行完才切换的简化版。', 'Simplified version that switches only on completion.',
    '非抢占，选剩余最短。', 'Non-preemptive, min remaining. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'srt']],
  impl: `${JOB_IFACE}
export interface SrtHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function srtSimplified(jobs: Job[], hooks: SrtHooks = {}): SchedResult {
  const rem = [...jobs];
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (rem.length) {
    const ready = rem.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = rem.reduce((a, b) => (a.arrival < b.arrival ? a : b)); time = pick.arrival; }
    else pick = ready.reduce((a, b) => (a.burst < b.burst ? a : b));
    rem.splice(rem.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { srtSimplified, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 6 }, { id: 'B', arrival: 1, burst: 3 }, { id: 'C', arrival: 2, burst: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '简化 SRT', en: 'Simplified SRT' }).commit();
  const r = srtSimplified(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { srtSimplified } from '../../src/algorithms/scheduling/sched-srt-simplified/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-srt-simplified/trace.ts';
test('srtSimplified 正确', () => {
  const r = srtSimplified([{ id: 'A', arrival: 0, burst: 6 }, { id: 'B', arrival: 1, burst: 3 }, { id: 'C', arrival: 2, burst: 1 }]);
  assert.equal(r.order[0], 'A');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. sched-quantum-optimize  —— 时间片优化（搜索最佳量子）
ALGS.push({
  id: 'sched-quantum-optimize',
  m: ['时间片优化', 'Quantum Size Optimization', '枚举量子大小找使平均等待最小的值。', 'Search quantum size minimizing avg wait.',
    '枚举多个量子跑 RR。', 'Try multiple quantums. O(q * n*total).', 'O(q * n*total)', 'O(n)', ['scheduling', 'optimization']],
  impl: `${JOB_IFACE}
export interface QoHooks { onTry?: (q: number, avgWait: number) => void; onResult?: (best: { quantum: number; avgWait: number }) => void; }
function rrOnce(jobs: Job[], quantum: number): number {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0, totalWait = 0;
  const finish = new Map<string, number>();
  while (q.length) {
    const j = q.shift()!;
    if (j.arrival > time) time = j.arrival;
    const run = Math.min(quantum, rem.get(j.id)!);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    if (rem.get(j.id) === 0) finish.set(j.id, time); else q.push(j);
  }
  for (const job of jobs) totalWait += finish.get(job.id)! - job.arrival - job.burst;
  return totalWait / jobs.length;
}
export function optimizeQuantum(jobs: Job[], hooks: QoHooks = {}): { quantum: number; avgWait: number } {
  const maxBurst = Math.max(...jobs.map((j) => j.burst));
  let best = { quantum: 1, avgWait: Infinity };
  for (let q = 1; q <= maxBurst; q++) {
    const aw = rrOnce(jobs, q);
    hooks.onTry?.(q, aw);
    if (aw < best.avgWait) best = { quantum: q, avgWait: aw };
  }
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optimizeQuantum, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 1 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '量子优化', en: 'Quantum optimize' }).commit();
  const best = optimizeQuantum(input, { onTry: (q, aw) => rec.begin({ zh: 'q=' + q + ' avgW=' + aw.toFixed(2), en: 'q=' + q + ' aw=' + aw.toFixed(2) }).setBars([{ value: aw, role: 'pivot' as BarRole, label: 'q' + q }]).commit() });
  rec.begin({ zh: '最佳 q=' + best.quantum, en: 'best q=' + best.quantum }).setAux([{ label: 'quantum', value: String(best.quantum), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimizeQuantum } from '../../src/algorithms/scheduling/sched-quantum-optimize/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-quantum-optimize/trace.ts';
test('optimizeQuantum 正确', () => {
  const best = optimizeQuantum([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 1 }]);
  assert.ok(best.quantum >= 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. sched-gantt  —— 甘特图构建器
ALGS.push({
  id: 'sched-gantt',
  m: ['甘特图构建', 'Gantt Chart Builder', '从段列表构建文本甘特图。', 'Build text Gantt chart from segments.',
    '按时间展开为时间轴。', 'Expand to timeline. O(total).', 'O(total)', 'O(total)', ['scheduling', 'gantt']],
  impl: `${JOB_IFACE}
export interface GanttHooks { onCell?: (time: number, id: string) => void; onResult?: (chart: string) => void; }
export function buildGantt(segments: Segment[], hooks: GanttHooks = {}): string {
  const total = segments.reduce((m, s) => Math.max(m, s.end), 0);
  let chart = '';
  for (let t = 0; t < total; t++) {
    const s = segments.find((x) => t >= x.start && t < x.end);
    const id = s ? s.id : '_';
    chart += id;
    hooks.onCell?.(t, id);
  }
  hooks.onResult?.(chart);
  return chart;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildGantt, type Segment } from './impl.ts';
export const DEFAULT_INPUT: Segment[] = [{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 3, end: 5 }];
export function buildTrace(input: Segment[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '甘特图', en: 'Gantt' }).commit();
  const chart = buildGantt(input, { onCell: (t, id) => rec.begin({ zh: 't' + t + ': ' + id, en: 't' + t + ': ' + id }).setAux([{ label: 't', value: String(t), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: chart, en: chart }).setBars([{ value: chart.length, role: 'final' as BarRole, label: chart }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGantt } from '../../src/algorithms/scheduling/sched-gantt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-gantt/trace.ts';
test('buildGantt 正确', () => {
  assert.equal(buildGantt([{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 3, end: 5 }]), 'AAABB');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. sched-context-switch-count  —— 上下文切换计数
ALGS.push({
  id: 'sched-context-switch-count',
  m: ['上下文切换计数', 'Context Switch Count', '统计调度段中的上下文切换次数。', 'Count context switches in schedule segments.',
    '相邻段 id 不同即一次切换。', 'Adjacent different id => 1 switch. O(n).', 'O(n)', 'O(1)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface CscHooks { onSwitch?: (from: string, to: string) => void; onResult?: (count: number) => void; }
export function contextSwitchCount(segments: Segment[], hooks: CscHooks = {}): number {
  let count = 0;
  for (let i = 1; i < segments.length; i++) {
    if (segments[i]!.id !== segments[i - 1]!.id) { count++; hooks.onSwitch?.(segments[i - 1]!.id, segments[i]!.id); }
  }
  hooks.onResult?.(count);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { contextSwitchCount, type Segment } from './impl.ts';
export const DEFAULT_INPUT: Segment[] = [{ id: 'A', start: 0, end: 2 }, { id: 'B', start: 2, end: 4 }, { id: 'A', start: 4, end: 6 }];
export function buildTrace(input: Segment[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '上下文切换', en: 'Context switch' }).commit();
  const c = contextSwitchCount(input, { onSwitch: (f, t) => rec.begin({ zh: f + ' → ' + t, en: f + ' → ' + t }).setAux([{ label: 'switch', value: f + '→' + t, role: 'swap' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + c + ' 次', en: c + ' switches' }).setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contextSwitchCount } from '../../src/algorithms/scheduling/sched-context-switch-count/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-context-switch-count/trace.ts';
test('contextSwitchCount 正确', () => {
  assert.equal(contextSwitchCount([{ id: 'A', start: 0, end: 2 }, { id: 'B', start: 2, end: 4 }, { id: 'A', start: 4, end: 6 }]), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. sched-job-pool  —— 作业池调度（任意时刻选优）
ALGS.push({
  id: 'sched-job-pool',
  m: ['作业池调度', 'Job Pool Scheduling', '维护作业池，按策略函数选下一个。', 'Maintain job pool, pick next via policy function.',
    '可插拔策略：FCFS/SJF/Priority。', 'Pluggable policy. O(n^2).', 'O(n^2)', 'O(n)', ['scheduling', 'pool']],
  impl: `${JOB_IFACE}
export type Policy = (a: Job, b: Job) => number;
export const Policies: Record<string, Policy> = {
  fcfs: (a, b) => a.arrival - b.arrival,
  sjf: (a, b) => a.burst - b.burst,
  priority: (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
};
export interface JpHooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function jobPool(jobs: Job[], policy: Policy, hooks: JpHooks = {}): SchedResult {
  const rem = [...jobs];
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (rem.length) {
    const ready = rem.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = rem.reduce((a, b) => (a.arrival < b.arrival ? a : b)); time = pick.arrival; }
    else pick = ready.reduce((a, b) => (policy(a, b) <= 0 ? a : b));
    rem.splice(rem.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jobPool, Policies, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 0, burst: 2 }, { id: 'C', arrival: 0, burst: 3 }] as Job[], policy: 'sjf' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '作业池 ' + input.policy, en: 'Job pool ' + input.policy }).commit();
  const r = jobPool(input.jobs, Policies[input.policy] ?? Policies.fcfs, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jobPool, Policies } from '../../src/algorithms/scheduling/sched-job-pool/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-job-pool/trace.ts';
test('jobPool sjf 正确', () => {
  const r = jobPool([{ id: 'A', arrival: 0, burst: 4 }, { id: 'B', arrival: 0, burst: 2 }, { id: 'C', arrival: 0, burst: 3 }], Policies.sjf);
  assert.deepEqual(r.order, ['B','C','A']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. sched-weighted-fair  —— 加权公平队列（简化 WFQ）
ALGS.push({
  id: 'sched-weighted-fair',
  m: ['加权公平队列', 'Weighted Fair Queueing', '按权重分配 CPU 比例。', 'Allocate CPU proportionally by weight.',
    '虚拟完成时间排序。', 'Sort by virtual finish time. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'wfq']],
  impl: `${JOB_IFACE}
export interface WfJob extends Job { weight: number; }
export interface WfqHooks { onSend?: (j: WfJob, vt: number) => void; onResult?: (order: string[]) => void; }
export function weightedFairQueue(jobs: WfJob[], hooks: WfqHooks = {}): string[] {
  let vt = 0;
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const order: string[] = [];
  for (const j of sorted) {
    const finish = vt + j.burst / j.weight;
    hooks.onSend?.(j, finish);
    order.push(j.id);
    vt = finish;
  }
  hooks.onResult?.(order);
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedFairQueue, type WfJob } from './impl.ts';
export const DEFAULT_INPUT: WfJob[] = [{ id: 'A', arrival: 0, burst: 4, weight: 2 }, { id: 'B', arrival: 0, burst: 4, weight: 1 }, { id: 'C', arrival: 0, burst: 2, weight: 4 }];
export function buildTrace(input: WfJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'WFQ', en: 'WFQ' }).commit();
  const order = weightedFairQueue(input, { onSend: (j, vt) => rec.begin({ zh: j.id + ' vf=' + vt.toFixed(2), en: j.id + ' vf=' + vt.toFixed(2) }).setAux([{ label: 'vf', value: vt.toFixed(2), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '顺序 ' + order.join(','), en: order.join(',') }).setBars(order.map((o, i) => ({ value: i, role: 'final' as BarRole, label: o }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedFairQueue } from '../../src/algorithms/scheduling/sched-weighted-fair/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-weighted-fair/trace.ts';
test('weightedFairQueue 正确', () => {
  const order = weightedFairQueue([{ id: 'A', arrival: 0, burst: 4, weight: 2 }, { id: 'B', arrival: 0, burst: 4, weight: 1 }]);
  assert.equal(order.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. sched-periodic-utilization  —— 周期任务利用率检查
ALGS.push({
  id: 'sched-periodic-utilization',
  m: ['周期任务利用率检查', 'Periodic Utilization Bound', '检查周期任务集是否可调度（RMS 利用率上界）。', 'Check schedulability via RMS utilization bound.',
    'n 任务 RMS 上界 n(2^(1/n)-1)。', 'RMS bound n(2^(1/n)-1). O(n).', 'O(n)', 'O(1)', ['scheduling', 'real-time', 'rms']],
  impl: `export interface PuHooks { onResult?: (util: number, bound: number, schedulable: boolean) => void; }
export function periodicUtilization(jobs: Array<{ id: string; period: number; burst: number }>, hooks: PuHooks = {}): { util: number; bound: number; schedulable: boolean } {
  const n = jobs.length;
  const util = jobs.reduce((s, j) => s + j.burst / j.period, 0);
  const bound = n * (Math.pow(2, 1 / n) - 1);
  const schedulable = util <= bound;
  hooks.onResult?.(util, bound, schedulable);
  return { util, bound, schedulable };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { periodicUtilization } from './impl.ts';
export const DEFAULT_INPUT = [{ id: 'A', period: 4, burst: 1 }, { id: 'B', period: 6, burst: 1 }, { id: 'C', period: 8, burst: 1 }];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '周期利用率检查', en: 'Utilization bound' }).commit();
  const r = periodicUtilization(input, { onResult: (util, bound, s) => rec.begin({ zh: 'util=' + util.toFixed(2) + ' 上界=' + bound.toFixed(2), en: 'util=' + util.toFixed(2) + ' bound=' + bound.toFixed(2) }).setAux([{ label: 'schedulable', value: String(s), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '可调度？' + r.schedulable, en: 'schedulable? ' + r.schedulable }).setAux([{ label: 'ok', value: String(r.schedulable), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { periodicUtilization } from '../../src/algorithms/scheduling/sched-periodic-utilization/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-periodic-utilization/trace.ts';
test('periodicUtilization 正确', () => {
  const r = periodicUtilization([{ id: 'A', period: 4, burst: 1 }, { id: 'B', period: 6, burst: 1 }, { id: 'C', period: 8, burst: 1 }]);
  assert.ok(r.util > 0);
  assert.ok(r.bound > 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. sched-deadline-monotonic  —— 截止时间单调调度
ALGS.push({
  id: 'sched-deadline-monotonic',
  m: ['截止时间单调调度', 'Deadline Monotonic Scheduling', '相对截止时间短者优先（静态）。', 'Shorter relative deadline = higher priority (static).',
    'D 越小优先级越高。', 'Smaller D = higher pri. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'real-time']],
  impl: `export interface DmJob { id: string; period: number; burst: number; deadline: number; }
export interface DmHooks { onAssign?: (id: string, pri: number) => void; onResult?: (out: Array<{ id: string; priority: number }>) => void; }
export function deadlineMonotonic(jobs: DmJob[], hooks: DmHooks = {}): Array<{ id: string; priority: number }> {
  const sorted = [...jobs].sort((a, b) => a.deadline - b.deadline);
  const out = sorted.map((j, i) => ({ id: j.id, priority: i }));
  for (const o of out) hooks.onAssign?.(o.id, o.priority);
  hooks.onResult?.(out);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deadlineMonotonic, type DmJob } from './impl.ts';
export const DEFAULT_INPUT: DmJob[] = [{ id: 'A', period: 10, burst: 2, deadline: 8 }, { id: 'B', period: 8, burst: 1, deadline: 5 }, { id: 'C', period: 12, burst: 2, deadline: 10 }];
export function buildTrace(input: DmJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '截止时间单调', en: 'Deadline monotonic' }).commit();
  const out = deadlineMonotonic(input, { onAssign: (id, pri) => rec.begin({ zh: id + ' P=' + pri, en: id + ' P=' + pri }).setBars([{ value: pri, role: 'pivot' as BarRole, label: id }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setBars(out.map((o) => ({ value: o.priority, role: 'final' as BarRole, label: o.id }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deadlineMonotonic } from '../../src/algorithms/scheduling/sched-deadline-monotonic/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-deadline-monotonic/trace.ts';
test('deadlineMonotonic 正确', () => {
  const out = deadlineMonotonic([{ id: 'A', period: 10, burst: 2, deadline: 8 }, { id: 'B', period: 8, burst: 1, deadline: 5 }]);
  assert.equal(out[0]!.id, 'B');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. sched-io-bound-favor  —— I/O 密集型优先
ALGS.push({
  id: 'sched-io-bound-favor',
  m: ['I/O密集型优先', 'I/O Bound Favoring', 'I/O 密集（短 CPU 段）的进程优先。', 'Favor I/O-bound (short CPU burst) processes.',
    '按 burst 长度升序，短的优先。', 'Sort by burst asc. O(n log n).', 'O(n log n)', 'O(n)', ['scheduling', 'io']],
  impl: `${JOB_IFACE}
export interface Io2Hooks { onPick?: (j: Job, time: number) => void; onResult?: (r: SchedResult) => void; }
export function ioBoundFavor(jobs: Job[], hooks: Io2Hooks = {}): SchedResult {
  const rem = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = []; const order: string[] = [];
  let time = 0, totalWait = 0, totalTurn = 0;
  while (rem.length) {
    const ready = rem.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) { pick = rem[0]!; time = pick.arrival; }
    else pick = ready.reduce((a, b) => (a.burst < b.burst ? a : b));
    rem.splice(rem.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait; totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
  }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ioBoundFavor, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 1 }, { id: 'C', arrival: 0, burst: 2 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'I/O 密集优先', en: 'IO bound favor' }).commit();
  const r = ioBoundFavor(input, { onPick: (j, t) => rec.begin({ zh: t + ': ' + j.id, en: t + ': ' + j.id }).setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ioBoundFavor } from '../../src/algorithms/scheduling/sched-io-bound-favor/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-io-bound-favor/trace.ts';
test('ioBoundFavor 正确', () => {
  const r = ioBoundFavor([{ id: 'A', arrival: 0, burst: 5 }, { id: 'B', arrival: 0, burst: 1 }, { id: 'C', arrival: 0, burst: 2 }]);
  assert.deepEqual(r.order, ['B','C','A']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. sched-priority-feedback  —— 优先级反馈（动态降级）
ALGS.push({
  id: 'sched-priority-feedback',
  m: ['优先级反馈', 'Priority Feedback', '运行后降低优先级，防止独占。', 'Demote priority after running, prevent monopoly.',
    '每跑一拍优先级+1（变低）。', 'Each tick pri += 1. O(n*total).', 'O(n*total)', 'O(n)', ['scheduling', 'feedback']],
  impl: `${JOB_IFACE}
export interface PfHooks { onRun?: (id: string, pri: number, time: number) => void; onResult?: (r: SchedResult) => void; }
export function priorityFeedback(jobs: Job[], initialPri: number, hooks: PfHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const pri = new Map(jobs.map((j) => [j.id, j.priority ?? initialPri]));
  const done = new Set<string>();
  const segments: Segment[] = []; const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) { time++; continue; }
    const pick = ready.reduce((a, b) => (pri.get(a.id)! <= pri.get(b.id)! ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) { segments.push({ id: pick.id, start: time, end: time + 1 }); if (!order.includes(pick.id)) order.push(pick.id); }
    else segments[segments.length - 1]!.end = time + 1;
    hooks.onRun?.(pick.id, pri.get(pick.id)!, time);
    pri.set(pick.id, pri.get(pick.id)! + 1);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) { done.add(pick.id); finish.set(pick.id, time); }
  }
  let totalWait = 0, totalTurn = 0;
  for (const j of jobs) { totalTurn += finish.get(j.id)! - j.arrival; totalWait += finish.get(j.id)! - j.arrival - j.burst; }
  const r = { order, segments, avgWait: totalWait / jobs.length, avgTurnaround: totalTurn / jobs.length };
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityFeedback, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 3 }, { id: 'C', arrival: 0, burst: 3 }];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级反馈', en: 'Priority feedback' }).commit();
  const r = priorityFeedback(input, 0, { onRun: (id, p, t) => rec.begin({ zh: t + ': ' + id + ' P=' + p, en: t + ': ' + id + ' P=' + p }).setAux([{ label: 'pri', value: String(p), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) }).setBars(r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id }))).setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityFeedback } from '../../src/algorithms/scheduling/sched-priority-feedback/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-feedback/trace.ts';
test('priorityFeedback 正确', () => {
  const r = priorityFeedback([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 3 }], 0);
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 44. sched-turnaround-time  —— 周转时间计算
ALGS.push({
  id: 'sched-turnaround-time',
  m: ['周转时间计算', 'Turnaround Time Calculator', '从完成时间和到达时间算周转。', 'Compute turnaround from finish and arrival.',
    'TAT = finish - arrival。', 'TAT = finish - arrival. O(n).', 'O(n)', 'O(n)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface TatHooks { onCalc?: (id: string, tat: number) => void; onResult?: (avg: number) => void; }
export function turnaroundTimes(jobs: Job[], finish: Map<string, number>, hooks: TatHooks = {}): Map<string, number> {
  const out = new Map<string, number>();
  let sum = 0;
  for (const j of jobs) { const tat = (finish.get(j.id) ?? j.arrival + j.burst) - j.arrival; out.set(j.id, tat); sum += tat; hooks.onCalc?.(j.id, tat); }
  const avg = sum / jobs.length;
  hooks.onResult?.(avg);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { turnaroundTimes, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }] as Job[], finish: new Map([['A', 3], ['B', 5]]) };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '周转时间', en: 'Turnaround' }).commit();
  const ts = turnaroundTimes(input.jobs, input.finish, { onCalc: (id, tat) => rec.begin({ zh: id + ' TAT=' + tat, en: id + ' TAT=' + tat }).setBars([{ value: tat, role: 'pivot' as BarRole, label: id }]).commit() });
  const avg = [...ts.values()].reduce((a, b) => a + b, 0) / ts.size;
  rec.begin({ zh: '平均 TAT ' + avg.toFixed(2), en: 'avg TAT ' + avg.toFixed(2) }).setAux([{ label: 'avg', value: avg.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { turnaroundTimes } from '../../src/algorithms/scheduling/sched-turnaround-time/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-turnaround-time/trace.ts';
test('turnaroundTimes 正确', () => {
  const ts = turnaroundTimes([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }], new Map([['A', 3], ['B', 5]]));
  assert.equal(ts.get('A'), 3);
  assert.equal(ts.get('B'), 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 45. sched-wait-time  —— 等待时间计算
ALGS.push({
  id: 'sched-wait-time',
  m: ['等待时间计算', 'Waiting Time Calculator', '从周转和 burst 算等待时间。', 'Compute wait time from turnaround and burst.',
    'wait = TAT - burst。', 'wait = TAT - burst. O(n).', 'O(n)', 'O(n)', ['scheduling', 'metric']],
  impl: `${JOB_IFACE}
export interface WtHooks { onCalc?: (id: string, wait: number) => void; onResult?: (avg: number) => void; }
export function waitingTimes(jobs: Job[], turnaround: Map<string, number>, hooks: WtHooks = {}): Map<string, number> {
  const out = new Map<string, number>();
  let sum = 0;
  for (const j of jobs) { const w = (turnaround.get(j.id) ?? j.burst) - j.burst; out.set(j.id, w); sum += w; hooks.onCalc?.(j.id, w); }
  const avg = sum / jobs.length;
  hooks.onResult?.(avg);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { waitingTimes, type Job } from './impl.ts';
export const DEFAULT_INPUT = { jobs: [{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }] as Job[], turnaround: new Map([['A', 3], ['B', 5]]) };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '等待时间', en: 'Waiting time' }).commit();
  const ws = waitingTimes(input.jobs, input.turnaround, { onCalc: (id, w) => rec.begin({ zh: id + ' wait=' + w, en: id + ' wait=' + w }).setBars([{ value: w, role: 'pivot' as BarRole, label: id }]).commit() });
  const avg = [...ws.values()].reduce((a, b) => a + b, 0) / ws.size;
  rec.begin({ zh: '平均等待 ' + avg.toFixed(2), en: 'avg wait ' + avg.toFixed(2) }).setAux([{ label: 'avg', value: avg.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitingTimes } from '../../src/algorithms/scheduling/sched-wait-time/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-wait-time/trace.ts';
test('waitingTimes 正确', () => {
  const ws = waitingTimes([{ id: 'A', arrival: 0, burst: 3 }, { id: 'B', arrival: 0, burst: 2 }], new Map([['A', 3], ['B', 5]]));
  assert.equal(ws.get('A'), 0);
  assert.equal(ws.get('B'), 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

for (const a of ALGS) {
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`scheduling: wrote ${ALGS.length} algorithms`);
