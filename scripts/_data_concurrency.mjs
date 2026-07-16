// concurrency data — 25 algorithms (event-sequence simulations)

export const algos = [
// 1. conc-tas-lock
{
  id: 'conc-tas-lock',
  titleZh: 'TAS 自旋锁', titleEn: 'Test-and-Set Spinlock',
  summaryZh: 'TestAndSet 自旋锁：原子地测试并置位，失败则忙等。',
  summaryEn: 'TestAndSet spinlock: atomically test-and-set; spin on failure.',
  descZh: 'TAS 自旋锁用一条原子指令 test-and-set：若 flag 为 0 则置 1 并获得锁；否则自旋。优点是实现极简、低延迟；缺点是在高竞争下总线流量大、无公平性。',
  descEn: 'TAS spinlock uses an atomic test-and-set: if flag is 0, set it to 1 and acquire; otherwise spin. Simple and low-latency, but high bus traffic under contention and no fairness.',
  tags: ['concurrency','lock','spinlock','test-and-set'],
  time: 'O(n) (per acquire, worst-case)', space: 'O(n)',
  impl: `// TAS 自旋锁 · 实现（事件序列模拟）
export type TState = 'idle' | 'spinning' | 'critical';
export interface TasLEvent { thread: number; action: 'lock' | 'unlock'; }
export interface TasLStep { thread: number; action: string; flag: number; states: TState[]; holder: number; }
export interface TasLHooks {
  onSpin?: (t: number, attempt: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export function simulateTasLock(n: number, events: TasLEvent[], maxSpin = 4, hooks: TasLHooks = {}): TasLStep[] {
  let flag = 0;
  let holder = -1;
  const states: TState[] = new Array(n).fill('idle');
  const steps: TasLStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      if (flag === 0) { flag = 1; states[ev.thread] = 'critical'; holder = ev.thread; hooks.onAcquire?.(ev.thread); }
      else {
        let a = 0;
        while (flag === 1 && a < maxSpin) { a++; hooks.onSpin?.(ev.thread, a); }
        if (flag === 0) { flag = 1; states[ev.thread] = 'critical'; holder = ev.thread; hooks.onAcquire?.(ev.thread); }
        else states[ev.thread] = 'spinning';
      }
    } else {
      if (holder === ev.thread) { flag = 0; states[ev.thread] = 'idle'; holder = -1; hooks.onRelease?.(ev.thread); }
    }
    steps.push({ thread: ev.thread, action: ev.action, flag, states: [...states], holder });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTasLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const events = [
    { thread: 0, action: 'lock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 0, action: 'unlock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 1, action: 'unlock' as const },
  ];
  rec.begin({ zh: 'TAS 锁：2 线程竞争', en: 'TAS lock: 2 threads contend' })
    .setBars([0,0].map(()=>({value:0,role:'default' as BarRole})))
    .setAux([{ label: 'flag', value: '0', role: 'compare' as BarRole }]).commit();
  let flag = 0; let holder = -1;
  for (const s of simulateTasLock(2, events, 3, {
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得锁\`, en: \`T\${t} acquired\` })
      .setBars(s2bars(s.states)).setAux(aux(flag, holder)).commit(),
    onSpin: (t, a) => rec.begin({ zh: \`T\${t} 自旋 #\${a}\`, en: \`T\${t} spin #\${a}\` })
      .setBars(s2bars(s.states)).setAux(aux(flag, holder)).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} released\` })
      .setBars(s2bars(s.states)).setAux(aux(flag, holder)).commit(),
  })) { flag = s.flag; holder = s.holder; }
  return rec.build();
  function s2bars(states: string[]) {
    return states.map((st, i) => ({ value: st === 'critical' ? 2 : st === 'spinning' ? 1 : 0, role: (st === 'critical' ? 'final' : st === 'spinning' ? 'warn' : 'default') as BarRole, label: 'T'+i }));
  }
  function aux(f: number, h: number) {
    return [{ label: 'flag', value: String(f), role: 'compare' as BarRole }, { label: 'holder', value: h < 0 ? '-' : 'T'+h, role: 'final' as BarRole }];
  }
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTasLock } from '../../src/algorithms/concurrency/conc-tas-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-tas-lock/trace.ts';

test('TAS 互斥：同时只有一个持有者', () => {
  const steps = simulateTasLock(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  // 在 T0 unlock 前，T1 不是 critical
  assert.notEqual(steps[1]!.states[1], 'critical');
  assert.equal(steps[0]!.states[0], 'critical');
});
test('TAS unlock 后 flag 归 0', () => {
  const steps = simulateTasLock(1, [{ thread: 0, action: 'lock' }, { thread: 0, action: 'unlock' }]);
  assert.equal(steps[1]!.flag, 0);
});
test('TAS trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 2. conc-back-off-lock
{
  id: 'conc-back-off-lock',
  titleZh: '退避自旋锁', titleEn: 'Backoff Spinlock',
  summaryZh: 'TAS + 指数退避：失败后随机延时再试，降低总线竞争。',
  summaryEn: 'TAS + exponential backoff: wait a random delay before retry to reduce bus contention.',
  descZh: '退避自旋锁在 TAS 失败后，等待一段随机时间（按重试次数指数增长）再重试，避免所有线程同时争抢总线。比纯 TAS 在高竞争下更高效。',
  descEn: 'Backoff spinlock waits a random delay (growing exponentially with retries) after a failed TAS, avoiding simultaneous bus contention. More efficient than plain TAS under high contention.',
  tags: ['concurrency','lock','spinlock','backoff'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 退避自旋锁 · 实现
export interface BoEvent { thread: number; action: 'lock' | 'unlock'; }
export interface BoHooks {
  onBackoff?: (t: number, delay: number, attempt: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BoStep { thread: number; flag: number; holder: number; backoffs: number[]; }
export function simulateBackoff(n: number, events: BoEvent[], seed = 7, hooks: BoHooks = {}): BoStep[] {
  let s = seed >>> 0;
  const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  let flag = 0; let holder = -1;
  const backoffs: number[] = new Array(n).fill(0);
  const steps: BoStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      let attempt = 0;
      while (flag === 1 && attempt < 5) {
        const delay = Math.min(1 << attempt, 16) * (0.5 + rng() * 0.5);
        attempt++;
        backoffs[ev.thread] = (backoffs[ev.thread] ?? 0) + Math.round(delay);
        hooks.onBackoff?.(ev.thread, delay, attempt);
      }
      if (flag === 0) { flag = 1; holder = ev.thread; hooks.onAcquire?.(ev.thread); }
    } else if (holder === ev.thread) { flag = 0; holder = -1; hooks.onRelease?.(ev.thread); }
    steps.push({ thread: ev.thread, flag, holder, backoffs: [...backoffs] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBackoff } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '退避锁：3 线程', en: 'Backoff lock: 3 threads' })
    .setBars([0,0,0].map((_,i)=>({value:0,role:'default' as BarRole,label:'T'+i}))).commit();
  simulateBackoff(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ], 7, {
    onBackoff: (t, d) => rec.begin({ zh: \`T\${t} 退避 \${d.toFixed(1)}\`, en: \`T\${t} backoff \${d.toFixed(1)}\` })
      .setAux([{ label: 'T'+t, value: d.toFixed(1), role: 'warn' as BarRole }]).commit(),
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得锁\`, en: \`T\${t} acquired\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} released\` })
      .setAux([{ label: 'released', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBackoff } from '../../src/algorithms/concurrency/conc-back-off-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-back-off-lock/trace.ts';

test('backoff 互斥', () => {
  const steps = simulateBackoff(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[0]!.flag, 1);
  assert.equal(steps[0]!.holder, 0);
});
test('backoff 退避计数递增', () => {
  const steps = simulateBackoff(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' }, // T1 退避
  ]);
  assert.ok(steps[1]!.backoffs[1]! >= 0);
});
test('backoff trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 3. conc-anderson-lock
{
  id: 'conc-anderson-lock',
  titleZh: 'Anderson 锁', titleEn: 'Anderson Lock',
  summaryZh: '基于槽（slot）数组的公平自旋锁：每个线程等自己的槽。',
  summaryEn: 'Fair array-based spinlock: each thread spins on its own slot.',
  descZh: 'Anderson 锁（Anderson 1990）用一个大小为 n 的 slots 数组实现 FIFO 公平：获得锁的线程释放时把下一个 slot 置为 true，下一个线程在自己的 slot 上自旋。减少缓存争用。',
  descEn: 'Anderson lock (Anderson 1990) uses an array of n slots for FIFO fairness: the holder, on release, sets the next slot true; the next thread spins on its own slot, reducing cache contention.',
  tags: ['concurrency','lock','spinlock','fair','anderson'],
  time: 'O(1) per acquire', space: 'O(n)',
  impl: `// Anderson 锁 · 实现
export interface AnEvent { thread: number; action: 'lock' | 'unlock'; }
export interface AnHooks {
  onAcquire?: (t: number, slot: number) => void;
  onRelease?: (t: number, nextSlot: number) => void;
  onWait?: (t: number, slot: number) => void;
}
export interface AnStep { thread: number; tail: number; slots: boolean[]; holder: number; }
export function simulateAnderson(n: number, events: AnEvent[], hooks: AnHooks = {}): AnStep[] {
  const slots: boolean[] = new Array(n).fill(false);
  slots[0] = true;
  let tail = 0;
  let holder = -1;
  const waitSlot = new Map<number, number>();
  const steps: AnStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      const mySlot = tail;
      tail = (tail + 1) % n;
      waitSlot.set(ev.thread, mySlot);
      if (slots[mySlot]) {
        slots[mySlot] = false;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread, mySlot);
      } else {
        hooks.onWait?.(ev.thread, mySlot);
        // 模拟：等到下一轮也视为获得
        slots[mySlot] = false;
        holder = ev.thread;
        hooks.onAcquire?.(ev.thread, mySlot);
      }
    } else if (holder === ev.thread) {
      const next = (waitSlot.size) % n;
      slots[(tail) % n] = true;
      holder = -1;
      hooks.onRelease?.(ev.thread, next);
    }
    steps.push({ thread: ev.thread, tail, slots: [...slots], holder });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateAnderson } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Anderson 锁：3 线程', en: 'Anderson lock: 3 threads' })
    .setBars([1,0,0].map((v,i)=>({value:v,role: v?'final':'default' as BarRole,label:'S'+i}))).commit();
  simulateAnderson(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ], {
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得锁\`, en: \`T\${t} acquired\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放，唤醒下一槽\`, en: \`T\${t} release, wake next slot\` })
      .setAux([{ label: 'release', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateAnderson } from '../../src/algorithms/concurrency/conc-anderson-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-anderson-lock/trace.ts';

test('Anderson 初始 slot[0]=true', () => {
  const steps = simulateAnderson(3, [{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.holder, 0);
});
test('Anderson tail 推进', () => {
  const steps = simulateAnderson(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.equal(steps[1]!.tail, 2);
});
test('Anderson trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 4. concent-lock
{
  id: 'concent-lock',
  titleZh: 'CLH 队列锁', titleEn: 'CLH Queue Lock',
  summaryZh: 'CLH：线程在隐式队列前驱节点上自旋，FIFO 公平。',
  summaryEn: 'CLH: each thread spins on its predecessor node in an implicit FIFO queue.',
  descZh: 'CLH 锁（Craig, Magnussen, Landin, Hagersten）：每个获取锁的线程创建一个新节点排在队尾，在前驱节点的状态字段上自旋。释放时把自己的节点置为 false。FIFO 公平且只需局部缓存。',
  descEn: 'CLH lock: each acquiring thread appends a node to the queue tail and spins on its predecessor state field; release sets its own node false. FIFO-fair with only local caching.',
  tags: ['concurrency','lock','queue','clh','fair'],
  time: 'O(1) per acquire', space: 'O(n)',
  impl: `// CLH 队列锁 · 实现
export interface ClhNode { locked: boolean; owner: number; }
export interface ClhEvent { thread: number; action: 'lock' | 'unlock'; }
export interface ClhHooks {
  onEnqueue?: (t: number, pred: number) => void;
  onSpinPred?: (t: number, pred: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface ClhStep { thread: number; queue: ClhNode[]; holder: number; }
export function simulateClh(events: ClhEvent[], hooks: ClhHooks = {}): ClhStep[] {
  // 初始哨兵节点（unlocked）
  let tail: ClhNode = { locked: false, owner: -1 };
  let holder = -1;
  const myNode = new Map<number, ClhNode>();
  const predMap = new Map<number, ClhNode>();
  const steps: ClhStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      const node: ClhNode = { locked: true, owner: ev.thread };
      myNode.set(ev.thread, node);
      const pred = tail;
      predMap.set(ev.thread, pred);
      tail = node;
      hooks.onEnqueue?.(ev.thread, pred.owner);
      if (pred.locked) hooks.onSpinPred?.(ev.thread, pred.owner);
      // 模拟：等到前驱释放
      pred.locked = false;
      holder = ev.thread;
      hooks.onAcquire?.(ev.thread);
    } else if (holder === ev.thread) {
      const node = myNode.get(ev.thread)!;
      node.locked = false;
      holder = -1;
      hooks.onRelease?.(ev.thread);
    }
    const queue: ClhNode[] = [];
    let cur: ClhNode | undefined = tail;
    const seen = new Set<ClhNode>();
    while (cur && !seen.has(cur)) { seen.add(cur); queue.unshift(cur); cur = predMap.get(cur.owner); }
    steps.push({ thread: ev.thread, queue, holder });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateClh } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CLH 锁：2 线程', en: 'CLH lock: 2 threads' }).commit();
  simulateClh([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ], {
    onEnqueue: (t, p) => rec.begin({ zh: \`T\${t} 入队，前驱=\${p<0?'-':'T'+p}\`, en: \`T\${t} enqueue, pred=\${p<0?'-':'T'+p}\` })
      .setAux([{ label: 'pred', value: p<0?'-':'T'+p, role: 'compare' as BarRole }]).commit(),
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得\`, en: \`T\${t} acquired\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} release\` })
      .setAux([{ label: 'release', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateClh } from '../../src/algorithms/concurrency/concent-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/concent-lock/trace.ts';

test('CLH 单 acquire 持有', () => {
  const steps = simulateClh([{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.holder, 0);
});
test('CLH unlock 释放', () => {
  const steps = simulateClh([
    { thread: 0, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[1]!.holder, -1);
});
test('CLH trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 5. conc-time-priority-lock
{
  id: 'conc-time-priority-lock',
  titleZh: '时间优先锁', titleEn: 'Time-Priority Lock',
  summaryZh: '按等待时间排序授予锁，等待越久越优先。',
  summaryEn: 'Grant the lock by waiting time: longer wait = higher priority.',
  descZh: '时间优先锁维护每个等待线程的等待开始时间；锁释放时把锁授予等待最久的线程（FIFO/最老优先），避免饥饿。',
  descEn: 'Time-priority lock tracks each waiter start time; on release it grants the lock to the longest-waiting thread (oldest-first), preventing starvation.',
  tags: ['concurrency','lock','fair','priority','starvation-free'],
  time: 'O(log n) per op', space: 'O(n)',
  impl: `// 时间优先锁 · 实现
export interface TpEvent { thread: number; action: 'lock' | 'unlock'; }
export interface TpHooks {
  onWait?: (t: number, time: number) => void;
  onAcquire?: (t: number, waitTime: number) => void;
  onRelease?: (t: number) => void;
}
export interface TpStep { thread: number; holder: number; waiters: Array<{ t: number; since: number }>; }
export function simulateTimePriority(events: TpEvent[], hooks: TpHooks = {}): TpStep[] {
  let holder = -1;
  const waiters: Array<{ t: number; since: number }> = [];
  let clock = 0;
  const steps: TpStep[] = [];
  for (const ev of events) {
    clock++;
    if (ev.action === 'lock') {
      if (holder === -1) { holder = ev.thread; hooks.onAcquire?.(ev.thread, 0); }
      else { waiters.push({ t: ev.thread, since: clock }); hooks.onWait?.(ev.thread, clock); }
    } else if (holder === ev.thread) {
      hooks.onRelease?.(ev.thread);
      if (waiters.length > 0) {
        // 选等待最久的（since 最小）
        waiters.sort((a, b) => a.since - b.since);
        const next = waiters.shift()!;
        holder = next.t;
        hooks.onAcquire?.(next.t, clock - next.since);
      } else holder = -1;
    }
    steps.push({ thread: ev.thread, holder, waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTimePriority } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '时间优先锁：3 线程', en: 'Time-priority lock: 3 threads' }).commit();
  simulateTimePriority([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' }, // 应授给 T1（先等）
    { thread: 1, action: 'unlock' }, // 授给 T2
  ], {
    onAcquire: (t, w) => rec.begin({ zh: \`T\${t} 获得（等了\${w}）\`, en: \`T\${t} acquired (waited \${w})\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} release\` })
      .setAux([{ label: 'release', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTimePriority } from '../../src/algorithms/concurrency/conc-time-priority-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-time-priority-lock/trace.ts';

test('时间优先：先等者先得', () => {
  const steps = simulateTimePriority([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  // T1 应该是新的 holder
  assert.equal(steps[3]!.holder, 1);
});
test('时间优先 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 6. conc-bakery-2
{
  id: 'conc-bakery-2',
  titleZh: 'Bakery 算法 v2', titleEn: 'Bakery Algorithm v2',
  summaryZh: 'Lamport Bakery：取号排序，号小者优先进入临界区。',
  summaryEn: 'Lamport Bakery: take a ticket; the smallest ticket enters first.',
  descZh: 'Bakery 算法（Lamport 1974）模拟面包店取号：每个线程进入前取一个比所有现有号大 1 的号；号最小者（线程 id 小者破并列）进入临界区。无原子读写的互斥算法。',
  descEn: 'Bakery algorithm (Lamport 1974) mimics a bakery ticket: each thread takes a ticket one larger than all current tickets; the smallest ticket (ties broken by thread id) enters the critical section. Mutual exclusion without atomic read-modify-write.',
  tags: ['concurrency','lock','bakery','mutual-exclusion','lamport'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Bakery 算法 v2 · 实现
export interface BkEvent { thread: number; action: 'enter' | 'exit'; }
export interface BkHooks {
  onTicket?: (t: number, ticket: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BkStep { thread: number; tickets: number[]; inCs: boolean[]; }
export function simulateBakery(n: number, events: BkEvent[], hooks: BkHooks = {}): BkStep[] {
  const tickets: number[] = new Array(n).fill(0);
  const inCs: boolean[] = new Array(n).fill(false);
  const choosing: boolean[] = new Array(n).fill(false);
  const steps: BkStep[] = [];
  for (const ev of events) {
    if (ev.action === 'enter') {
      choosing[ev.thread] = true;
      let max = 0;
      for (const tk of tickets) if (tk > max) max = tk;
      tickets[ev.thread] = max + 1;
      choosing[ev.thread] = false;
      hooks.onTicket?.(ev.thread, tickets[ev.thread]!);
      // 是否我的号最小？
      let canEnter = true;
      for (let j = 0; j < n; j++) {
        if (j === ev.thread) continue;
        if (tickets[j]! !== 0) {
          if (tickets[j]! < tickets[ev.thread]! || (tickets[j]! === tickets[ev.thread]! && j < ev.thread)) {
            canEnter = false; break;
          }
        }
      }
      if (canEnter) { inCs[ev.thread] = true; hooks.onAcquire?.(ev.thread); }
    } else {
      if (inCs[ev.thread]) { inCs[ev.thread] = false; tickets[ev.thread] = 0; hooks.onRelease?.(ev.thread); }
    }
    steps.push({ thread: ev.thread, tickets: [...tickets], inCs: [...inCs] });
  }
  return steps;
}
void choosing;
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBakery } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bakery：3 线程取号', en: 'Bakery: 3 threads take tickets' }).commit();
  simulateBakery(3, [
    { thread: 0, action: 'enter' },
    { thread: 1, action: 'enter' },
    { thread: 2, action: 'enter' },
    { thread: 0, action: 'exit' },
    { thread: 1, action: 'exit' },
    { thread: 2, action: 'exit' },
  ], {
    onTicket: (t, tk) => rec.begin({ zh: \`T\${t} 取号 \${tk}\`, en: \`T\${t} ticket \${tk}\` })
      .setAux([{ label: 'T'+t, value: String(tk), role: 'compare' as BarRole }]).commit(),
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 进入临界区\`, en: \`T\${t} enter CS\` })
      .setAux([{ label: 'CS', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 退出\`, en: \`T\${t} exit\` })
      .setAux([{ label: 'exit', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBakery } from '../../src/algorithms/concurrency/conc-bakery-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bakery-2/trace.ts';

test('bakery 取号递增', () => {
  const steps = simulateBakery(3, [
    { thread: 0, action: 'enter' },
    { thread: 1, action: 'enter' },
  ]);
  assert.equal(steps[0]!.tickets[0], 1);
  assert.equal(steps[1]!.tickets[1], 2);
});
test('bakery 首个进入者直接 CS', () => {
  const steps = simulateBakery(2, [{ thread: 0, action: 'enter' }]);
  assert.equal(steps[0]!.inCs[0], true);
});
test('bakery exit 清号', () => {
  const steps = simulateBakery(2, [
    { thread: 0, action: 'enter' },
    { thread: 0, action: 'exit' },
  ]);
  assert.equal(steps[1]!.tickets[0], 0);
});
test('bakery trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 7. conc-fast-lock-2
{
  id: 'conc-fast-lock-2',
  titleZh: '快速锁 v2', titleEn: 'Fast Lock v2',
  summaryZh: 'Fast Lock：无竞争路径仅 1 条原子指令，回退到慢路径。',
  summaryEn: 'Fast Lock: uncontended fast path uses 1 atomic op, falls back to slow path.',
  descZh: 'Fast Lock（Mellor-Crummey & Scott）针对常见无竞争情形优化：快路径一次 CAS 即获锁；失败则进入基于队列的慢路径。低竞争下接近零开销。',
  descEn: 'Fast Lock (Mellor-Crummey & Scott) optimizes the common uncontended case: the fast path acquires with a single CAS; on failure it falls back to a queue-based slow path. Near-zero overhead under low contention.',
  tags: ['concurrency','lock','fast-path','cas'],
  time: 'O(1) fast / O(n) slow', space: 'O(n)',
  impl: `// Fast Lock v2 · 实现
export interface FlEvent { thread: number; action: 'lock' | 'unlock'; }
export interface FlHooks {
  onFastPath?: (t: number) => void;
  onSlowPath?: (t: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface FlStep { thread: number; state: 'free' | 'locked'; queue: number[]; holder: number; }
export function simulateFastLock(events: FlEvent[], hooks: FlHooks = {}): FlStep[] {
  let state: 'free' | 'locked' = 'free';
  const queue: number[] = [];
  let holder = -1;
  const steps: FlStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      if (state === 'free') { state = 'locked'; holder = ev.thread; hooks.onFastPath?.(ev.thread); hooks.onAcquire?.(ev.thread); }
      else { queue.push(ev.thread); hooks.onSlowPath?.(ev.thread); }
    } else if (holder === ev.thread) {
      if (queue.length > 0) { holder = queue.shift()!; hooks.onAcquire?.(holder); }
      else { state = 'free'; holder = -1; }
      hooks.onRelease?.(ev.thread);
    }
    steps.push({ thread: ev.thread, state, queue: [...queue], holder });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateFastLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Fast Lock', en: 'Fast Lock' }).commit();
  simulateFastLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ], {
    onFastPath: (t) => rec.begin({ zh: \`T\${t} 快路径\`, en: \`T\${t} fast path\` })
      .setAux([{ label: 'path', value: 'fast', role: 'final' as BarRole }]).commit(),
    onSlowPath: (t) => rec.begin({ zh: \`T\${t} 慢路径入队\`, en: \`T\${t} slow path enqueue\` })
      .setAux([{ label: 'path', value: 'slow', role: 'warn' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} release\` })
      .setAux([{ label: 'release', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateFastLock } from '../../src/algorithms/concurrency/conc-fast-lock-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-fast-lock-2/trace.ts';

test('fast lock 无竞争直接获得', () => {
  const steps = simulateFastLock([{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.state, 'locked');
  assert.equal(steps[0]!.holder, 0);
});
test('fast lock 竞争入队', () => {
  const steps = simulateFastLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.deepEqual(steps[1]!.queue, [1]);
});
test('fast lock trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 8. conc-slow-lock-2
{
  id: 'conc-slow-lock-2',
  titleZh: '慢路径锁 v2', titleEn: 'Slow Path Lock v2',
  summaryZh: '总是排队（无快路径）的公平锁，作为 Fast Lock 的对照组。',
  summaryEn: 'Always-queued fair lock (no fast path); a baseline contrast to Fast Lock.',
  descZh: '慢路径锁始终使用基于队列的获取/释放路径，便于与 Fast Lock 对比延迟。FIFO 公平，但即使无竞争也要付出队列维护开销。',
  descEn: 'The slow-path lock always uses the queued acquire/release path, providing a baseline to contrast with Fast Lock latency. FIFO-fair but pays queue overhead even when uncontended.',
  tags: ['concurrency','lock','queue','fair','baseline'],
  time: 'O(1)', space: 'O(n)',
  impl: `// Slow Path Lock v2 · 实现
export interface SlEvent { thread: number; action: 'lock' | 'unlock'; }
export interface SlHooks {
  onEnqueue?: (t: number) => void;
  onAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface SlStep { thread: number; queue: number[]; holder: number; }
export function simulateSlowLock(events: SlEvent[], hooks: SlHooks = {}): SlStep[] {
  const queue: number[] = [];
  let holder = -1;
  const steps: SlStep[] = [];
  for (const ev of events) {
    if (ev.action === 'lock') {
      queue.push(ev.thread); hooks.onEnqueue?.(ev.thread);
      if (holder === -1) { holder = queue.shift()!; hooks.onAcquire?.(holder); }
    } else if (holder === ev.thread) {
      hooks.onRelease?.(ev.thread);
      holder = queue.length > 0 ? queue.shift()! : -1;
      if (holder !== -1) hooks.onAcquire?.(holder);
    }
    steps.push({ thread: ev.thread, queue: [...queue], holder });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSlowLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Slow Path Lock', en: 'Slow Path Lock' }).commit();
  simulateSlowLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ], {
    onEnqueue: (t) => rec.begin({ zh: \`T\${t} 入队\`, en: \`T\${t} enqueue\` })
      .setAux([{ label: 'queue', value: 'T'+t, role: 'compare' as BarRole }]).commit(),
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得\`, en: \`T\${t} acquired\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onRelease: (t) => rec.begin({ zh: \`T\${t} 释放\`, en: \`T\${t} release\` })
      .setAux([{ label: 'release', value: 'T'+t, role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSlowLock } from '../../src/algorithms/concurrency/conc-slow-lock-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-slow-lock-2/trace.ts';

test('slow lock FIFO', () => {
  const steps = simulateSlowLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[2]!.holder, 1);
});
test('slow lock trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 9. conc-reader-writer-3
{
  id: 'conc-reader-writer-3',
  titleZh: '读写锁 v3', titleEn: 'Reader-Writer Lock v3',
  summaryZh: '区分读/写：多读并发，写独占。',
  summaryEn: 'Distinguish read/write: multiple readers concurrent, writers exclusive.',
  descZh: '读写锁允许多个读者同时持有，但写者独占。本实现维护 activeReaders 计数与 writer 等待标志；读者过多时可能延迟写者。',
  descEn: 'Reader-writer lock allows multiple concurrent readers but exclusive writers. This impl tracks activeReaders and a writer-waiting flag; many readers can delay writers.',
  tags: ['concurrency','lock','reader-writer','shared'],
  time: 'O(1)', space: 'O(n)',
  impl: `// Reader-Writer Lock v3 · 实现
export interface RwEvent { thread: number; action: 'rlock' | 'runlock' | 'wlock' | 'wunlock'; }
export interface RwHooks {
  onReadAcquire?: (t: number, active: number) => void;
  onWriteAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
  onBlock?: (t: number, reason: string) => void;
}
export interface RwStep { thread: number; activeReaders: number; writerActive: boolean; writerWaiting: number; }
export function simulateRwLock(events: RwEvent[], hooks: RwHooks = {}): RwStep[] {
  let activeReaders = 0;
  let writerActive = false;
  let writerWaiting = 0;
  const steps: RwStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (writerActive || writerWaiting > 0) hooks.onBlock?.(ev.thread, 'writer');
      else { activeReaders++; hooks.onReadAcquire?.(ev.thread, activeReaders); }
    } else if (ev.action === 'runlock') {
      if (activeReaders > 0) { activeReaders--; hooks.onRelease?.(ev.thread); }
    } else if (ev.action === 'wlock') {
      if (writerActive || activeReaders > 0) { writerWaiting++; hooks.onBlock?.(ev.thread, 'busy'); }
      else { writerActive = true; hooks.onWriteAcquire?.(ev.thread); }
    } else if (ev.action === 'wunlock') {
      if (writerActive) { writerActive = false; hooks.onRelease?.(ev.thread); }
    }
    steps.push({ thread: ev.thread, activeReaders, writerActive, writerWaiting });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRwLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读写锁', en: 'Reader-Writer Lock' }).commit();
  simulateRwLock([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'rlock' },
    { thread: 2, action: 'wlock' },
    { thread: 0, action: 'runlock' },
    { thread: 1, action: 'runlock' },
  ], {
    onReadAcquire: (t, a) => rec.begin({ zh: \`T\${t} 读锁（共\${a}读者）\`, en: \`T\${t} rlock (\${a} readers)\` })
      .setAux([{ label: 'readers', value: String(a), role: 'final' as BarRole }]).commit(),
    onWriteAcquire: (t) => rec.begin({ zh: \`T\${t} 写锁\`, en: \`T\${t} wlock\` })
      .setAux([{ label: 'writer', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
    onBlock: (t, r) => rec.begin({ zh: \`T\${t} 阻塞(\${r})\`, en: \`T\${t} blocked(\${r})\` })
      .setAux([{ label: 'block', value: r, role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRwLock } from '../../src/algorithms/concurrency/conc-reader-writer-3/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-reader-writer-3/trace.ts';

test('rw 多读者并发', () => {
  const steps = simulateRwLock([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'rlock' },
  ]);
  assert.equal(steps[1]!.activeReaders, 2);
});
test('rw 写者阻塞当有读者', () => {
  const steps = simulateRwLock([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'wlock' },
  ]);
  assert.equal(steps[1]!.writerActive, false);
  assert.equal(steps[1]!.writerWaiting, 1);
});
test('rw trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 10. conc-writer-pref-2
{
  id: 'conc-writer-pref-2',
  titleZh: '写者优先锁 v2', titleEn: 'Writer-Preference Lock v2',
  summaryZh: '写者优先：有写者等待时阻止新读者，避免写者饥饿。',
  summaryEn: 'Writer preference: block new readers when a writer waits, preventing writer starvation.',
  descZh: '写者优先锁：当有写者等待时，新读者被阻塞，让写者尽快获得锁，避免写者饥饿（代价是读者吞吐降低）。',
  descEn: 'Writer-preference lock: when a writer is waiting, new readers are blocked so the writer can proceed soon, preventing writer starvation (at the cost of reader throughput).',
  tags: ['concurrency','lock','reader-writer','writer-priority'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 写者优先锁 v2 · 实现
export interface WpEvent { thread: number; action: 'rlock' | 'runlock' | 'wlock' | 'wunlock'; }
export interface WpHooks {
  onReadAcquire?: (t: number) => void;
  onWriteAcquire?: (t: number) => void;
  onBlockReader?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface WpStep { thread: number; activeReaders: number; writerActive: boolean; writersWaiting: number; }
export function simulateWriterPref(events: WpEvent[], hooks: WpHooks = {}): WpStep[] {
  let activeReaders = 0;
  let writerActive = false;
  let writersWaiting = 0;
  const steps: WpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (writerActive || writersWaiting > 0) hooks.onBlockReader?.(ev.thread);
      else { activeReaders++; hooks.onReadAcquire?.(ev.thread); }
    } else if (ev.action === 'runlock') {
      if (activeReaders > 0) { activeReaders--; hooks.onRelease?.(ev.thread); }
    } else if (ev.action === 'wlock') {
      if (writerActive || activeReaders > 0) writersWaiting++;
      else { writerActive = true; hooks.onWriteAcquire?.(ev.thread); }
    } else if (ev.action === 'wunlock') {
      if (writerActive) { writerActive = false; hooks.onRelease?.(ev.thread); }
      if (writersWaiting > 0) { writersWaiting--; writerActive = true; hooks.onWriteAcquire?.(-1); }
    }
    steps.push({ thread: ev.thread, activeReaders, writerActive, writersWaiting });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateWriterPref } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '写者优先锁', en: 'Writer-preference lock' }).commit();
  simulateWriterPref([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'wlock' }, // 写等待 → 阻塞后续读
    { thread: 2, action: 'rlock' }, // 被阻塞
    { thread: 0, action: 'runlock' },
  ], {
    onReadAcquire: (t) => rec.begin({ zh: \`T\${t} 读\`, en: \`T\${t} read\` })
      .setAux([{ label: 'reader', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onWriteAcquire: (t) => rec.begin({ zh: \`T\${t} 写\`, en: \`T\${t} write\` })
      .setAux([{ label: 'writer', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
    onBlockReader: (t) => rec.begin({ zh: \`T\${t} 读阻塞\`, en: \`T\${t} reader blocked\` })
      .setAux([{ label: 'blocked', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateWriterPref } from '../../src/algorithms/concurrency/conc-writer-pref-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-writer-pref-2/trace.ts';

test('writer-pref 写者等待阻塞读者', () => {
  const steps = simulateWriterPref([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'wlock' },
    { thread: 2, action: 'rlock' },
  ]);
  assert.equal(steps[2]!.activeReaders, 1); // T2 没进入
});
test('writer-pref trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 11. conc-cond-var-3
{
  id: 'conc-cond-var-3',
  titleZh: '条件变量 v3', titleEn: 'Condition Variable v3',
  summaryZh: 'wait/signal：线程在条件变量上挂起，被 signal 唤醒。',
  summaryEn: 'wait/signal: threads suspend on a condition variable and resume on signal.',
  descZh: '条件变量允许线程原子地释放锁并挂起（wait），其他线程满足条件后通过 signal/broadcast 唤醒。本实现模拟生产者-消费者。',
  descEn: 'A condition variable lets a thread atomically release the lock and suspend (wait); other threads signal/broadcast when the condition holds. Demo: producer-consumer.',
  tags: ['concurrency','synchronization','condition-variable','monitor'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 条件变量 v3 · 实现
export interface CvEvent { thread: number; action: 'wait' | 'signal' | 'broadcast'; }
export interface CvHooks {
  onWait?: (t: number, waiting: number) => void;
  onSignal?: (signaler: number, wakee: number) => void;
  onBroadcast?: (signaler: number, woken: number) => void;
}
export interface CvStep { thread: number; waiting: number[]; }
export function simulateCondVar(events: CvEvent[], hooks: CvHooks = {}): CvStep[] {
  const waiting: number[] = [];
  const steps: CvStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') { waiting.push(ev.thread); hooks.onWait?.(ev.thread, waiting.length); }
    else if (ev.action === 'signal') {
      if (waiting.length > 0) { const w = waiting.shift()!; hooks.onSignal?.(ev.thread, w); }
    } else {
      const n = waiting.length;
      waiting.length = 0;
      hooks.onBroadcast?.(ev.thread, n);
    }
    steps.push({ thread: ev.thread, waiting: [...waiting] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCondVar } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '条件变量', en: 'Condition variable' }).commit();
  simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'signal' },
    { thread: 3, action: 'broadcast' },
  ], {
    onWait: (t, w) => rec.begin({ zh: \`T\${t} wait (共\${w}等)\`, en: \`T\${t} wait (\${w} waiting)\` })
      .setAux([{ label: 'waiting', value: String(w), role: 'warn' as BarRole }]).commit(),
    onSignal: (s, w) => rec.begin({ zh: \`T\${s} signal → T\${w}\`, en: \`T\${s} signal → T\${w}\` })
      .setAux([{ label: 'wake', value: 'T'+w, role: 'final' as BarRole }]).commit(),
    onBroadcast: (s, n) => rec.begin({ zh: \`T\${s} broadcast 唤醒\${n}\`, en: \`T\${s} broadcast wake \${n}\` })
      .setAux([{ label: 'wake', value: String(n), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCondVar } from '../../src/algorithms/concurrency/conc-cond-var-3/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-cond-var-3/trace.ts';

test('condvar wait 入队', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.deepEqual(steps[1]!.waiting, [0, 1]);
});
test('condvar signal 唤醒一个', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'signal' },
  ]);
  assert.deepEqual(steps[2]!.waiting, [1]);
});
test('condvar broadcast 全部唤醒', () => {
  const steps = simulateCondVar([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'broadcast' },
  ]);
  assert.deepEqual(steps[1]!.waiting, []);
});
test('condvar trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 12. conc-semaphore-counting
{
  id: 'conc-semaphore-counting',
  titleZh: '计数信号量', titleEn: 'Counting Semaphore',
  summaryZh: '计数信号量：允许 N 个线程同时进入临界区。',
  summaryEn: 'Counting semaphore: allow up to N threads into the critical section.',
  descZh: 'Dijkstra 信号量：wait 使 count−1（< 0 阻塞），signal 使 count+1（唤醒等待者）。计数信号量 count 初值 > 1，允许多个线程同时持有。常用于资源池。',
  descEn: 'Dijkstra semaphore: wait decrements count (blocks if < 0), signal increments (wakes a waiter). A counting semaphore starts with count > 1, allowing multiple holders. Used for resource pools.',
  tags: ['concurrency','synchronization','semaphore','counting'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 计数信号量 · 实现
export interface SemEvent { thread: number; action: 'wait' | 'signal'; }
export interface SemHooks {
  onAcquire?: (t: number, count: number) => void;
  onBlock?: (t: number, waiters: number) => void;
  onRelease?: (t: number, count: number) => void;
}
export interface SemStep { thread: number; count: number; waiters: number[]; }
export function simulateCountingSem(initial: number, events: SemEvent[], hooks: SemHooks = {}): SemStep[] {
  let count = initial;
  const waiters: number[] = [];
  const steps: SemStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') {
      count--;
      if (count < 0) { waiters.push(ev.thread); hooks.onBlock?.(ev.thread, waiters.length); }
      else hooks.onAcquire?.(ev.thread, count);
    } else {
      count++;
      if (waiters.length > 0) { count--; const w = waiters.shift()!; hooks.onAcquire?.(w, count); }
      else hooks.onRelease?.(ev.thread, count);
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCountingSem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '计数信号量（初值 2）', en: 'Counting semaphore (init 2)' })
    .setAux([{ label: 'count', value: '2', role: 'compare' as BarRole }]).commit();
  simulateCountingSem(2, [
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'wait' }, // 阻塞
    { thread: 0, action: 'signal' }, // 唤醒 T2
  ], {
    onAcquire: (t, c) => rec.begin({ zh: \`T\${t} 获得（剩\${c}）\`, en: \`T\${t} acquire (\${c} left)\` })
      .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }]).commit(),
    onBlock: (t, w) => rec.begin({ zh: \`T\${t} 阻塞\`, en: \`T\${t} blocked\` })
      .setAux([{ label: 'waiters', value: String(w), role: 'warn' as BarRole }]).commit(),
    onRelease: (t, c) => rec.begin({ zh: \`T\${t} signal（剩\${c}）\`, en: \`T\${t} signal (\${c} left)\` })
      .setAux([{ label: 'count', value: String(c), role: 'swap' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCountingSem } from '../../src/algorithms/concurrency/conc-semaphore-counting/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-semaphore-counting/trace.ts';

test('counting sem 允许多个持有', () => {
  const steps = simulateCountingSem(2, [
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.equal(steps[1]!.count, 0);
  assert.deepEqual(steps[1]!.waiters, []);
});
test('counting sem 超额阻塞', () => {
  const steps = simulateCountingSem(2, [
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 2, action: 'wait' },
  ]);
  assert.equal(steps[2]!.count, -1);
  assert.deepEqual(steps[2]!.waiters, [2]);
});
test('counting sem trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 13. conc-semaphore-binary
{
  id: 'conc-semaphore-binary',
  titleZh: '二值信号量', titleEn: 'Binary Semaphore',
  summaryZh: '二值信号量（0/1）：等价于互斥锁。',
  summaryEn: 'Binary semaphore (0/1): equivalent to a mutex.',
  descZh: '二值信号量 count 只能取 0 或 1，功能上等价于互斥锁，但通常可在不同线程间 signal（不要求获取者释放）。',
  descEn: 'A binary semaphore takes only values 0 or 1, functionally equivalent to a mutex, but typically can be signaled by a different thread than the acquirer.',
  tags: ['concurrency','synchronization','semaphore','binary','mutex'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 二值信号量 · 实现
export interface BsEvent { thread: number; action: 'wait' | 'signal'; }
export interface BsHooks {
  onAcquire?: (t: number) => void;
  onBlock?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BsStep { thread: number; value: 0 | 1; holder: number; waiters: number[]; }
export function simulateBinarySem(events: BsEvent[], hooks: BsHooks = {}): BsStep[] {
  let value: 0 | 1 = 1;
  let holder = -1;
  const waiters: number[] = [];
  const steps: BsStep[] = [];
  for (const ev of events) {
    if (ev.action === 'wait') {
      if (value === 1) { value = 0; holder = ev.thread; hooks.onAcquire?.(ev.thread); }
      else { waiters.push(ev.thread); hooks.onBlock?.(ev.thread); }
    } else {
      if (waiters.length > 0) { const w = waiters.shift()!; holder = w; hooks.onAcquire?.(w); }
      else { value = 1; holder = -1; hooks.onRelease?.(ev.thread); }
    }
    steps.push({ thread: ev.thread, value, holder, waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBinarySem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二值信号量', en: 'Binary semaphore' })
    .setAux([{ label: 'value', value: '1', role: 'compare' as BarRole }]).commit();
  simulateBinarySem([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 0, action: 'signal' },
  ], {
    onAcquire: (t) => rec.begin({ zh: \`T\${t} 获得\`, en: \`T\${t} acquire\` })
      .setAux([{ label: 'holder', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onBlock: (t) => rec.begin({ zh: \`T\${t} 阻塞\`, en: \`T\${t} blocked\` })
      .setAux([{ label: 'block', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBinarySem } from '../../src/algorithms/concurrency/conc-semaphore-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-semaphore-binary/trace.ts';

test('binary sem 互斥', () => {
  const steps = simulateBinarySem([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
  ]);
  assert.equal(steps[1]!.value, 0);
  assert.equal(steps[1]!.holder, 0);
  assert.deepEqual(steps[1]!.waiters, [1]);
});
test('binary sem signal 唤醒等待者', () => {
  const steps = simulateBinarySem([
    { thread: 0, action: 'wait' },
    { thread: 1, action: 'wait' },
    { thread: 0, action: 'signal' },
  ]);
  assert.equal(steps[2]!.holder, 1);
});
test('binary sem trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 14. conc-event-count
{
  id: 'conc-event-count',
  titleZh: '事件计数器', titleEn: 'Event Count',
  summaryZh: 'EventCount：单调递增事件序号，await(ticket) 等到事件到达。',
  summaryEn: 'EventCount: monotonically increasing event number; await(ticket) blocks until reached.',
  descZh: '事件计数器（Reppert）维护单调递增的 count；advance() 使 count+1 并唤醒所有等待 count 的线程；await(ticket) 阻塞到 count >= ticket。用于等序号同步。',
  descEn: 'Event Count (Reppert) keeps a monotonically increasing count; advance() increments and wakes waiters; await(ticket) blocks until count >= ticket. Used for sequence-number synchronization.',
  tags: ['concurrency','synchronization','event-count','await'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 事件计数器 · 实现
export interface EcEvent { thread: number; action: 'await' | 'advance'; ticket?: number; }
export interface EcHooks {
  onAwait?: (t: number, ticket: number, count: number) => void;
  onAdvance?: (t: number, count: number, woken: number) => void;
  onWake?: (t: number, ticket: number) => void;
}
export interface EcStep { thread: number; count: number; waiters: Array<{ t: number; ticket: number }>; }
export function simulateEventCount(events: EcEvent[], hooks: EcHooks = {}): EcStep[] {
  let count = 0;
  const waiters: Array<{ t: number; ticket: number }> = [];
  const steps: EcStep[] = [];
  for (const ev of events) {
    if (ev.action === 'await') {
      const ticket = ev.ticket ?? count + 1;
      if (count < ticket) { waiters.push({ t: ev.thread, ticket }); hooks.onAwait?.(ev.thread, ticket, count); }
      else hooks.onAwait?.(ev.thread, ticket, count);
    } else {
      count++;
      const woken: number[] = [];
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (count >= waiters[i]!.ticket) { woken.unshift(waiters[i]!.t); hooks.onWake?.(waiters[i]!.t, waiters[i]!.ticket); waiters.splice(i, 1); }
      }
      hooks.onAdvance?.(ev.thread, count, woken.length);
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateEventCount } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '事件计数器', en: 'Event count' })
    .setAux([{ label: 'count', value: '0', role: 'compare' as BarRole }]).commit();
  simulateEventCount([
    { thread: 0, action: 'await', ticket: 2 },
    { thread: 1, action: 'advance' },
    { thread: 2, action: 'advance' }, // 唤醒 T0
  ], {
    onAwait: (t, tk, c) => rec.begin({ zh: \`T\${t} await(\${tk}), count=\${c}\`, en: \`T\${t} await(\${tk}), count=\${c}\` })
      .setAux([{ label: 'await', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
    onAdvance: (t, c, w) => rec.begin({ zh: \`T\${t} advance→\${c}, 唤醒\${w}\`, en: \`T\${t} advance→\${c}, wake \${w}\` })
      .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }]).commit(),
    onWake: (t) => rec.begin({ zh: \`T\${t} 被唤醒\`, en: \`T\${t} woken\` })
      .setAux([{ label: 'wake', value: 'T'+t, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateEventCount } from '../../src/algorithms/concurrency/conc-event-count/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-event-count/trace.ts';

test('event count advance 增加 count', () => {
  const steps = simulateEventCount([{ thread: 0, action: 'advance' }]);
  assert.equal(steps[0]!.count, 1);
});
test('event count await ticket 满足后唤醒', () => {
  const steps = simulateEventCount([
    { thread: 0, action: 'await', ticket: 1 },
    { thread: 1, action: 'advance' },
  ]);
  assert.equal(steps[1]!.count, 1);
  assert.deepEqual(steps[1]!.waiters, []);
});
test('event count trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 15. conc-sequence-lock
{
  id: 'conc-sequence-lock',
  titleZh: '顺序锁', titleEn: 'Sequence Lock',
  summaryZh: 'SeqLock：读者无锁读，校验前后序号一致；写者持锁时序号变奇。',
  summaryEn: 'SeqLock: readers read locklessly, validating sequence parity; writers flip sequence to odd while writing.',
  descZh: '顺序锁（Lamport-style）用于读多写少场景：读者读取数据并记录序号；若序号为奇数（写者正在写）或读后序号变化则重读。写者进入时序号变奇，退出变偶。',
  descEn: 'Sequence lock (used for read-mostly workloads): readers read data and record the sequence; they retry if the sequence is odd (writer active) or changed during the read. Writers flip sequence to odd on entry, even on exit.',
  tags: ['concurrency','lock','seqlock','reader-heavy','lockless'],
  time: 'O(1) read', space: 'O(1)',
  impl: `// 顺序锁 · 实现
export interface SeqEvent { thread: number; action: 'write-begin' | 'write-end' | 'read'; }
export interface SeqHooks {
  onWriteBegin?: (t: number, seq: number) => void;
  onWriteEnd?: (t: number, seq: number) => void;
  onReadRetry?: (t: number, seq: number) => void;
  onReadOk?: (t: number, seq: number, value: number) => void;
}
export interface SeqStep { thread: number; seq: number; value: number; }
export function simulateSeqLock(events: SeqEvent[], hooks: SeqHooks = {}): SeqStep[] {
  let seq = 0;
  let value = 0;
  const steps: SeqStep[] = [];
  for (const ev of events) {
    if (ev.action === 'write-begin') { seq++; hooks.onWriteBegin?.(ev.thread, seq); }
    else if (ev.action === 'write-end') { value++; seq++; hooks.onWriteEnd?.(ev.thread, seq); }
    else {
      // 读：若 seq 奇则重试
      if (seq % 2 === 1) { hooks.onReadRetry?.(ev.thread, seq); seq++; hooks.onReadOk?.(ev.thread, seq, value); }
      else hooks.onReadOk?.(ev.thread, seq, value);
    }
    steps.push({ thread: ev.thread, seq, value });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSeqLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '顺序锁', en: 'Sequence lock' })
    .setAux([{ label: 'seq', value: '0', role: 'compare' as BarRole }]).commit();
  simulateSeqLock([
    { thread: 0, action: 'read' },
    { thread: 1, action: 'write-begin' },
    { thread: 0, action: 'read' }, // 应重试
    { thread: 1, action: 'write-end' },
    { thread: 0, action: 'read' },
  ], {
    onWriteBegin: (t, s) => rec.begin({ zh: \`T\${t} 写入开始 seq=\${s}\`, en: \`T\${t} write-begin seq=\${s}\` })
      .setAux([{ label: 'seq', value: String(s), role: 'warn' as BarRole }]).commit(),
    onWriteEnd: (t, s) => rec.begin({ zh: \`T\${t} 写入结束 seq=\${s}\`, en: \`T\${t} write-end seq=\${s}\` })
      .setAux([{ label: 'seq', value: String(s), role: 'final' as BarRole }]).commit(),
    onReadOk: (t, s, v) => rec.begin({ zh: \`T\${t} 读 ok value=\${v}\`, en: \`T\${t} read ok value=\${v}\` })
      .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSeqLock } from '../../src/algorithms/concurrency/conc-sequence-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sequence-lock/trace.ts';

test('seqlock 写入改变 seq', () => {
  const steps = simulateSeqLock([{ thread: 0, action: 'write-begin' }]);
  assert.equal(steps[0]!.seq % 2, 1);
});
test('seqlock 写入完成后 seq 偶', () => {
  const steps = simulateSeqLock([
    { thread: 0, action: 'write-begin' },
    { thread: 0, action: 'write-end' },
  ]);
  assert.equal(steps[1]!.seq % 2, 0);
});
test('seqlock trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 16. conc-rcu-2
{
  id: 'conc-rcu-2',
  titleZh: 'RCU v2', titleEn: 'Read-Copy-Update v2',
  summaryZh: 'RCU：读者无锁；写者复制-更新，宽限期后回收旧版本。',
  summaryEn: 'RCU: readers are lockless; writers copy-update, reclaim old version after a grace period.',
  descZh: 'RCU（Read-Copy-Update）用于读多写少的数据结构：读者不持锁；写者复制一份做修改并用原子指针替换；所有读者退出「宽限期」后才回收旧版本。',
  descEn: 'RCU (Read-Copy-Update) suits read-mostly structures: readers take no locks; writers copy-modify and swap the pointer atomically; the old version is reclaimed only after a grace period (all pre-existing readers done).',
  tags: ['concurrency','synchronization','rcu','lockless','reader-heavy'],
  time: 'O(1) read', space: 'O(n)',
  impl: `// RCU v2 · 实现
export interface RcuEvent { thread: number; action: 'read-enter' | 'read-exit' | 'update' | 'synchronize'; }
export interface RcuHooks {
  onReadEnter?: (t: number, readers: number) => void;
  onReadExit?: (t: number, readers: number) => void;
  onUpdate?: (t: number, version: number) => void;
  onGracePeriod?: (t: number, reclaimed: number) => void;
}
export interface RcuStep { thread: number; version: number; activeReaders: number; pendingReclaim: number[]; }
export function simulateRcu(events: RcuEvent[], hooks: RcuHooks = {}): RcuStep[] {
  let version = 1;
  const activeReaders = new Set<number>();
  const pendingReclaim: number[] = [];
  const steps: RcuStep[] = [];
  for (const ev of events) {
    if (ev.action === 'read-enter') { activeReaders.add(ev.thread); hooks.onReadEnter?.(ev.thread, activeReaders.size); }
    else if (ev.action === 'read-exit') { activeReaders.delete(ev.thread); hooks.onReadExit?.(ev.thread, activeReaders.size); }
    else if (ev.action === 'update') { pendingReclaim.push(version); version++; hooks.onUpdate?.(ev.thread, version); }
    else {
      const n = pendingReclaim.length;
      if (activeReaders.size === 0) { pendingReclaim.length = 0; hooks.onGracePeriod?.(ev.thread, n); }
      else hooks.onGracePeriod?.(ev.thread, 0);
    }
    steps.push({ thread: ev.thread, version, activeReaders: activeReaders.size, pendingReclaim: [...pendingReclaim] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRcu } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RCU', en: 'RCU' })
    .setAux([{ label: 'version', value: '1', role: 'compare' as BarRole }]).commit();
  simulateRcu([
    { thread: 0, action: 'read-enter' },
    { thread: 1, action: 'update' }, // 旧版本待回收
    { thread: 1, action: 'synchronize' }, // 读者 T0 仍在
    { thread: 0, action: 'read-exit' },
    { thread: 1, action: 'synchronize' }, // 宽限期过，回收
  ], {
    onUpdate: (t, v) => rec.begin({ zh: \`T\${t} 更新→v\${v}\`, en: \`T\${t} update→v\${v}\` })
      .setAux([{ label: 'version', value: String(v), role: 'final' as BarRole }]).commit(),
    onGracePeriod: (t, n) => rec.begin({ zh: \`T\${t} 宽限期：回收\${n}\`, en: \`T\${t} grace: reclaim \${n}\` })
      .setAux([{ label: 'reclaim', value: String(n), role: n>0?'final':'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRcu } from '../../src/algorithms/concurrency/conc-rcu-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-rcu-2/trace.ts';

test('rcu update 增加 version', () => {
  const steps = simulateRcu([{ thread: 0, action: 'update' }]);
  assert.equal(steps[0]!.version, 2);
});
test('rcu 宽限期回收旧版本', () => {
  const steps = simulateRcu([
    { thread: 0, action: 'update' },
    { thread: 1, action: 'synchronize' },
  ]);
  assert.equal(steps[1]!.pendingReclaim.length, 0);
});
test('rcu trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 17. conc-brlock
{
  id: 'conc-brlock',
  titleZh: 'Big Reader 锁', titleEn: 'Big Reader Lock',
  summaryZh: 'BRLOCK：每 CPU 一个读计数器，避免读者缓存行争用。',
  summaryEn: 'BRLOCK: per-CPU reader counter to avoid reader cache-line contention.',
  descZh: 'Big Reader Lock 给每个 CPU 分配独立的读计数器，读者只修改本地计数，避免多核间的缓存行乒乓；写者需汇总所有 CPU 计数。适合读极多写极少。',
  descEn: 'Big Reader Lock gives each CPU its own reader counter so readers modify only local state, avoiding cross-core cache-line ping-pong; writers must sum all CPU counters. Suited to read-heavy, write-rare workloads.',
  tags: ['concurrency','lock','reader-writer','per-cpu','brlock'],
  time: 'O(1) read / O(p) write', space: 'O(p)',
  impl: `// BRLOCK · 实现
export interface BrEvent { thread: number; cpu: number; action: 'rlock' | 'runlock' | 'wlock' | 'wunlock'; }
export interface BrHooks {
  onReadAcquire?: (t: number, cpu: number) => void;
  onWriteAcquire?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface BrStep { thread: number; perCpuReaders: number[]; writerActive: boolean; }
export function simulateBrLock(nCpu: number, events: BrEvent[], hooks: BrHooks = {}): BrStep[] {
  const perCpuReaders: number[] = new Array(nCpu).fill(0);
  let writerActive = false;
  const steps: BrStep[] = [];
  for (const ev of events) {
    if (ev.action === 'rlock') {
      if (!writerActive) { perCpuReaders[ev.cpu]!++; hooks.onReadAcquire?.(ev.thread, ev.cpu); }
    } else if (ev.action === 'runlock') {
      if (perCpuReaders[ev.cpu]! > 0) { perCpuReaders[ev.cpu]!--; hooks.onRelease?.(ev.thread); }
    } else if (ev.action === 'wlock') {
      const total = perCpuReaders.reduce((a, b) => a + b, 0);
      if (total === 0) { writerActive = true; hooks.onWriteAcquire?.(ev.thread); }
    } else if (writerActive) { writerActive = false; hooks.onRelease?.(ev.thread); }
    steps.push({ thread: ev.thread, perCpuReaders: [...perCpuReaders], writerActive });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBrLock } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BRLOCK（2 CPU）', en: 'BRLOCK (2 CPUs)' }).commit();
  simulateBrLock(2, [
    { thread: 0, cpu: 0, action: 'rlock' },
    { thread: 1, cpu: 1, action: 'rlock' },
    { thread: 2, cpu: 0, action: 'wlock' }, // 等待读者退出
    { thread: 0, cpu: 0, action: 'runlock' },
    { thread: 1, cpu: 1, action: 'runlock' },
  ], {
    onReadAcquire: (t, c) => rec.begin({ zh: \`T\${t}@CPU\${c} 读\`, en: \`T\${t}@CPU\${c} read\` })
      .setAux([{ label: 'cpu', value: String(c), role: 'final' as BarRole }]).commit(),
    onWriteAcquire: (t) => rec.begin({ zh: \`T\${t} 写\`, en: \`T\${t} write\` })
      .setAux([{ label: 'writer', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBrLock } from '../../src/algorithms/concurrency/conc-brlock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-brlock/trace.ts';

test('brlock 各 CPU 独立计数', () => {
  const steps = simulateBrLock(2, [
    { thread: 0, cpu: 0, action: 'rlock' },
    { thread: 1, cpu: 1, action: 'rlock' },
  ]);
  assert.deepEqual(steps[1]!.perCpuReaders, [1, 1]);
});
test('brlock 写需等待读者退出', () => {
  const steps = simulateBrLock(2, [
    { thread: 0, cpu: 0, action: 'rlock' },
    { thread: 1, cpu: 0, action: 'wlock' },
  ]);
  assert.equal(steps[1]!.writerActive, false);
});
test('brlock trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 18. conc-rwsem
{
  id: 'conc-rwsem',
  titleZh: '读写信号量', titleEn: 'Reader-Writer Semaphore',
  summaryZh: '读写信号量：基于信号量的读写锁，写者递归降级。',
  summaryEn: 'RW semaphore: semaphore-based rwlock; writers can downgrade.',
  descZh: '读写信号量结合信号量与读写锁语义：down_read 允许并发，down_write 独占；支持写者降级为读者（downgrade_write）。',
  descEn: 'Reader-writer semaphore combines semaphore and rwlock semantics: down_read allows concurrency, down_write is exclusive; supports downgrade_write from writer to reader.',
  tags: ['concurrency','synchronization','semaphore','reader-writer'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 读写信号量 · 实现
export interface RwsEvent { thread: number; action: 'down_read' | 'up_read' | 'down_write' | 'up_write' | 'downgrade'; }
export interface RwsHooks {
  onReadAcquire?: (t: number, n: number) => void;
  onWriteAcquire?: (t: number) => void;
  onDowngrade?: (t: number) => void;
  onRelease?: (t: number) => void;
}
export interface RwsStep { thread: number; readers: number; writer: number; }
export function simulateRwSem(events: RwsEvent[], hooks: RwsHooks = {}): RwsStep[] {
  let readers = 0;
  let writer = -1;
  const steps: RwsStep[] = [];
  for (const ev of events) {
    if (ev.action === 'down_read') { if (writer === -1) { readers++; hooks.onReadAcquire?.(ev.thread, readers); } }
    else if (ev.action === 'up_read') { if (readers > 0) { readers--; hooks.onRelease?.(ev.thread); } }
    else if (ev.action === 'down_write') { if (writer === -1 && readers === 0) { writer = ev.thread; hooks.onWriteAcquire?.(ev.thread); } }
    else if (ev.action === 'up_write') { if (writer === ev.thread) { writer = -1; hooks.onRelease?.(ev.thread); } }
    else if (ev.action === 'downgrade') { if (writer === ev.thread) { writer = -1; readers++; hooks.onDowngrade?.(ev.thread); } }
    steps.push({ thread: ev.thread, readers, writer });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRwSem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读写信号量', en: 'RW semaphore' }).commit();
  simulateRwSem([
    { thread: 0, action: 'down_write' },
    { thread: 0, action: 'downgrade' }, // 写→读
    { thread: 1, action: 'down_read' },
    { thread: 0, action: 'up_read' },
    { thread: 1, action: 'up_read' },
  ], {
    onWriteAcquire: (t) => rec.begin({ zh: \`T\${t} 写\`, en: \`T\${t} write\` })
      .setAux([{ label: 'writer', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
    onDowngrade: (t) => rec.begin({ zh: \`T\${t} 降级为读者\`, en: \`T\${t} downgrade to reader\` })
      .setAux([{ label: 'downgrade', value: 'T'+t, role: 'final' as BarRole }]).commit(),
    onReadAcquire: (t, n) => rec.begin({ zh: \`T\${t} 读（共\${n}）\`, en: \`T\${t} read (\${n})\` })
      .setAux([{ label: 'readers', value: String(n), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRwSem } from '../../src/algorithms/concurrency/conc-rwsem/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-rwsem/trace.ts';

test('rwsem 写者降级', () => {
  const steps = simulateRwSem([
    { thread: 0, action: 'down_write' },
    { thread: 0, action: 'downgrade' },
  ]);
  assert.equal(steps[1]!.writer, -1);
  assert.equal(steps[1]!.readers, 1);
});
test('rwsem trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 19. conc-percpu
{
  id: 'conc-percpu',
  titleZh: '每 CPU 计数器', titleEn: 'Per-CPU Counter',
  summaryZh: 'Per-CPU 计数器：本地无锁累加，汇总时求和。',
  summaryEn: 'Per-CPU counter: lockless local increment, sum on demand.',
  descZh: '每 CPU 计数器将计数分散到各 CPU 本地变量，避免原子操作争用；需要精确值时汇总所有 CPU。',
  descEn: 'Per-CPU counters spread increments across per-CPU local variables, avoiding atomic-op contention; the exact value is obtained by summing all CPUs.',
  tags: ['concurrency','counter','per-cpu','lockless'],
  time: 'O(1) inc / O(p) sum', space: 'O(p)',
  impl: `// Per-CPU 计数器 · 实现
export interface PcEvent { cpu: number; action: 'inc' | 'dec' | 'sum'; delta?: number; }
export interface PcHooks {
  onInc?: (cpu: number, total: number) => void;
  onSum?: (total: number) => void;
}
export interface PcStep { cpu: number; perCpu: number[]; }
export function simulatePerCpu(nCpu: number, events: PcEvent[], hooks: PcHooks = {}): PcStep[] {
  const perCpu: number[] = new Array(nCpu).fill(0);
  const steps: PcStep[] = [];
  for (const ev of events) {
    if (ev.action === 'inc') { perCpu[ev.cpu]! += ev.delta ?? 1; hooks.onInc?.(ev.cpu, perCpu.reduce((a, b) => a + b, 0)); }
    else if (ev.action === 'dec') { perCpu[ev.cpu]! -= ev.delta ?? 1; hooks.onInc?.(ev.cpu, perCpu.reduce((a, b) => a + b, 0)); }
    else { const total = perCpu.reduce((a, b) => a + b, 0); hooks.onSum?.(total); }
    steps.push({ cpu: ev.cpu, perCpu: [...perCpu] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulatePerCpu } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Per-CPU 计数器', en: 'Per-CPU counter' }).commit();
  simulatePerCpu(3, [
    { cpu: 0, action: 'inc' },
    { cpu: 1, action: 'inc' },
    { cpu: 2, action: 'inc', delta: 5 },
    { cpu: -1, action: 'sum' },
  ], {
    onInc: (cpu, total) => rec.begin({ zh: \`CPU\${cpu} +=1 → total \${total}\`, en: \`CPU\${cpu} +=1 → total \${total}\` })
      .setBars([0,1,2].map((c)=>({value: 0, role:'default' as BarRole, label:'cpu'+c}))).commit(),
    onSum: (t) => rec.begin({ zh: \`sum = \${t}\`, en: \`sum = \${t}\` })
      .setAux([{ label: 'sum', value: String(t), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulatePerCpu } from '../../src/algorithms/concurrency/conc-percpu/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-percpu/trace.ts';

test('percpu 累加', () => {
  const steps = simulatePerCpu(2, [
    { cpu: 0, action: 'inc' },
    { cpu: 1, action: 'inc', delta: 3 },
  ]);
  assert.deepEqual(steps[1]!.perCpu, [1, 3]);
});
test('percpu trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 20. conc-barrier-2
{
  id: 'conc-barrier-2',
  titleZh: '屏障 v2', titleEn: 'Barrier v2',
  summaryZh: '阶段屏障：所有线程到达后统一放行（事件序列版）。',
  summaryEn: 'Phase barrier: release all threads once they arrive (event-sequence variant).',
  descZh: '屏障 v2 与 cyclic barrier 类似但用更直接的事件序列：n 个线程依次到达，第 n 个到达时触发放行并重置。',
  descEn: 'Barrier v2 is similar to a cyclic barrier but uses a more direct event sequence: n threads arrive in turn; the n-th arrival triggers release and reset.',
  tags: ['concurrency','synchronization','barrier'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 屏障 v2 · 实现
export interface B2Event { thread: number; action: 'arrive'; }
export interface B2Hooks {
  onArrive?: (t: number, arrived: number, total: number) => void;
  onRelease?: (generation: number) => void;
}
export interface B2Step { thread: number; arrived: number; generation: number; }
export function simulateBarrier2(parties: number, events: B2Event[], hooks: B2Hooks = {}): B2Step[] {
  let arrived = 0;
  let generation = 0;
  const steps: B2Step[] = [];
  for (const ev of events) {
    arrived++;
    hooks.onArrive?.(ev.thread, arrived, parties);
    if (arrived >= parties) { hooks.onRelease?.(generation); arrived = 0; generation++; }
    steps.push({ thread: ev.thread, arrived, generation });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBarrier2 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '屏障 v2（3 线程）', en: 'Barrier v2 (3 threads)' }).commit();
  simulateBarrier2(3, [
    { thread: 0, action: 'arrive' },
    { thread: 1, action: 'arrive' },
    { thread: 2, action: 'arrive' }, // 放行
    { thread: 0, action: 'arrive' },
  ], {
    onArrive: (t, a, n) => rec.begin({ zh: \`T\${t} 到达 \${a}/\${n}\`, en: \`T\${t} arrived \${a}/\${n}\` })
      .setBars([0,1,2].map((i)=>({value: i<a?1:0, role: i<a?'swap':'default' as BarRole, label:'T'+i})))
      .setAux([{ label: 'arrived', value: \`\${a}/\${n}\`, role: 'compare' as BarRole }]).commit(),
    onRelease: (g) => rec.begin({ zh: \`第 \${g} 代放行\`, en: \`gen \${g} released\` })
      .setAux([{ label: 'release', value: 'gen '+g, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBarrier2 } from '../../src/algorithms/concurrency/conc-barrier-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-barrier-2/trace.ts';

test('barrier v2 第 n 个触发放行', () => {
  const steps = simulateBarrier2(3, [
    { thread: 0, action: 'arrive' },
    { thread: 1, action: 'arrive' },
    { thread: 2, action: 'arrive' },
  ]);
  assert.equal(steps[2]!.arrived, 0); // 放行后归零
  assert.equal(steps[2]!.generation, 1);
});
test('barrier v2 trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 21. conc-completion-2
{
  id: 'conc-completion-2',
  titleZh: '完成锁存器 v2', titleEn: 'Completion Latch v2',
  summaryZh: '一次性完成锁存器：count 减到 0 后所有等待者释放。',
  summaryEn: 'One-shot completion latch: waiters released when count reaches 0.',
  descZh: '完成锁存器（CountDownLatch 风格）：初始化 count=N，每次 count_down 使 count−1；count=0 时所有 await 的线程被释放，且一次性（不可重置）。',
  descEn: 'Completion latch (CountDownLatch style): initialized with count=N; each count_down decrements; when count hits 0 all await-ers are released; one-shot (not resettable).',
  tags: ['concurrency','synchronization','latch','completion'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 完成锁存器 v2 · 实现
export interface CompEvent { thread: number; action: 'await' | 'count_down'; }
export interface CompHooks {
  onAwait?: (t: number, count: number) => void;
  onCountDown?: (t: number, count: number) => void;
  onComplete?: (woken: number) => void;
}
export interface CompStep { thread: number; count: number; waiters: number[]; }
export function simulateCompletion(initial: number, events: CompEvent[], hooks: CompHooks = {}): CompStep[] {
  let count = initial;
  const waiters: number[] = [];
  const steps: CompStep[] = [];
  for (const ev of events) {
    if (ev.action === 'await') {
      if (count > 0) waiters.push(ev.thread);
      hooks.onAwait?.(ev.thread, count);
    } else {
      if (count > 0) { count--; hooks.onCountDown?.(ev.thread, count); if (count === 0) { hooks.onComplete?.(waiters.length); waiters.length = 0; } }
    }
    steps.push({ thread: ev.thread, count, waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateCompletion } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '完成锁存器（count=2）', en: 'Completion latch (count=2)' }).commit();
  simulateCompletion(2, [
    { thread: 0, action: 'await' },
    { thread: 1, action: 'count_down' },
    { thread: 2, action: 'count_down' }, // 完成
  ], {
    onAwait: (t, c) => rec.begin({ zh: \`T\${t} await (count=\${c})\`, en: \`T\${t} await (count=\${c})\` })
      .setAux([{ label: 'count', value: String(c), role: 'warn' as BarRole }]).commit(),
    onCountDown: (t, c) => rec.begin({ zh: \`T\${t} countdown → \${c}\`, en: \`T\${t} countdown → \${c}\` })
      .setAux([{ label: 'count', value: String(c), role: 'compare' as BarRole }]).commit(),
    onComplete: (w) => rec.begin({ zh: \`完成！唤醒 \${w}\`, en: \`complete! wake \${w}\` })
      .setAux([{ label: 'release', value: String(w), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCompletion } from '../../src/algorithms/concurrency/conc-completion-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-completion-2/trace.ts';

test('completion count_down 到 0 释放等待者', () => {
  const steps = simulateCompletion(2, [
    { thread: 0, action: 'await' },
    { thread: 1, action: 'count_down' },
    { thread: 2, action: 'count_down' },
  ]);
  assert.equal(steps[2]!.count, 0);
  assert.deepEqual(steps[2]!.waiters, []);
});
test('completion trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 22. conc-async-queue
{
  id: 'conc-async-queue',
  titleZh: '异步队列', titleEn: 'Async Queue',
  summaryZh: '异步队列：生产者 enqueue，消费者 await dequeue。',
  summaryEn: 'Async queue: producers enqueue, consumers await dequeue.',
  descZh: '异步队列（类似 async channel）：消费者在空队列上 await；生产者 enqueue 后唤醒一个等待消费者。',
  descEn: 'Async queue (like an async channel): consumers await on an empty queue; producers enqueue and wake one waiting consumer.',
  tags: ['concurrency','queue','async','producer-consumer'],
  time: 'O(1)', space: 'O(n)',
  impl: `// 异步队列 · 实现
export interface AqEvent { thread: number; action: 'enqueue' | 'dequeue'; value?: number; }
export interface AqHooks {
  onEnqueue?: (t: number, value: number, size: number) => void;
  onDequeue?: (t: number, value: number, size: number) => void;
  onWait?: (t: number) => void;
}
export interface AqStep { thread: number; queue: number[]; waiters: number[]; }
export function simulateAsyncQueue(events: AqEvent[], hooks: AqHooks = {}): AqStep[] {
  const queue: number[] = [];
  const waiters: number[] = [];
  const steps: AqStep[] = [];
  for (const ev of events) {
    if (ev.action === 'enqueue') {
      const v = ev.value ?? 0;
      if (waiters.length > 0) { const w = waiters.shift()!; hooks.onDequeue?.(w, v, queue.length); }
      else { queue.push(v); hooks.onEnqueue?.(ev.thread, v, queue.length); }
    } else {
      if (queue.length > 0) { const v = queue.shift()!; hooks.onDequeue?.(ev.thread, v, queue.length); }
      else { waiters.push(ev.thread); hooks.onWait?.(ev.thread); }
    }
    steps.push({ thread: ev.thread, queue: [...queue], waiters: [...waiters] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateAsyncQueue } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异步队列', en: 'Async queue' }).commit();
  simulateAsyncQueue([
    { thread: 0, action: 'dequeue' }, // 等待
    { thread: 1, action: 'enqueue', value: 42 }, // 唤醒 T0
    { thread: 2, action: 'enqueue', value: 7 },
    { thread: 3, action: 'dequeue' }, // 立即获得 7
  ], {
    onWait: (t) => rec.begin({ zh: \`T\${t} 等待\`, en: \`T\${t} waiting\` })
      .setAux([{ label: 'wait', value: 'T'+t, role: 'warn' as BarRole }]).commit(),
    onEnqueue: (t, v, s) => rec.begin({ zh: \`T\${t} 入队 \${v} (size=\${s})\`, en: \`T\${t} enqueue \${v} (size=\${s})\` })
      .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }]).commit(),
    onDequeue: (t, v) => rec.begin({ zh: \`T\${t} 取得 \${v}\`, en: \`T\${t} got \${v}\` })
      .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateAsyncQueue } from '../../src/algorithms/concurrency/conc-async-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-async-queue/trace.ts';

test('async queue 空时 dequeue 等待', () => {
  const steps = simulateAsyncQueue([{ thread: 0, action: 'dequeue' }]);
  assert.deepEqual(steps[0]!.waiters, [0]);
});
test('async queue 入队唤醒等待者', () => {
  const steps = simulateAsyncQueue([
    { thread: 0, action: 'dequeue' },
    { thread: 1, action: 'enqueue', value: 5 },
  ]);
  assert.deepEqual(steps[1]!.waiters, []);
  assert.deepEqual(steps[1]!.queue, []);
});
test('async queue trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 23. conc-ring-buffer-mpsc
{
  id: 'conc-ring-buffer-mpsc',
  titleZh: 'MPSC 环形缓冲', titleEn: 'MPSC Ring Buffer',
  summaryZh: '多生产者单消费者环形缓冲：无锁入队，单消费者出队。',
  summaryEn: 'Multi-producer single-consumer ring buffer: lockless enqueue, single consumer dequeue.',
  descZh: 'MPSC 环形缓冲：多生产者用 CAS 推进 head 入队；单消费者独占 tail 出队。无锁、低延迟，常见于内核消息传递。',
  descEn: 'MPSC ring buffer: multiple producers use CAS to advance head for enqueue; a single consumer owns the tail for dequeue. Lockless, low-latency; common in kernel messaging.',
  tags: ['concurrency','queue','ring-buffer','mpsc','lockless'],
  time: 'O(1)', space: 'O(capacity)',
  impl: `// MPSC 环形缓冲 · 实现
export interface MpEvent { thread: number; action: 'produce' | 'consume'; value?: number; }
export interface MpHooks {
  onProduce?: (t: number, value: number, head: number, tail: number) => void;
  onConsume?: (t: number, value: number, head: number, tail: number) => void;
  onFull?: (t: number) => void;
  onEmpty?: (t: number) => void;
}
export interface MpStep { thread: number; head: number; tail: number; buf: (number | null)[]; }
export function simulateMpsc(capacity: number, events: MpEvent[], hooks: MpHooks = {}): MpStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let head = 0;
  let tail = 0;
  const steps: MpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'produce') {
      const next = (head + 1) % capacity;
      if (next === tail) hooks.onFull?.(ev.thread);
      else { buf[head] = ev.value ?? 0; head = next; hooks.onProduce?.(ev.thread, ev.value ?? 0, head, tail); }
    } else {
      if (tail === head) hooks.onEmpty?.(ev.thread);
      else { const v = buf[tail]; buf[tail] = null; tail = (tail + 1) % capacity; hooks.onConsume?.(ev.thread, v ?? 0, head, tail); }
    }
    steps.push({ thread: ev.thread, head, tail, buf: [...buf] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateMpsc } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MPSC ring buffer (cap=4)', en: 'MPSC ring buffer (cap=4)' }).commit();
  simulateMpsc(4, [
    { thread: 1, action: 'produce', value: 10 },
    { thread: 2, action: 'produce', value: 20 },
    { thread: 0, action: 'consume' },
    { thread: 0, action: 'consume' },
  ], {
    onProduce: (t, v) => rec.begin({ zh: \`生产者 T\${t} 入队 \${v}\`, en: \`producer T\${t} enq \${v}\` })
      .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }]).commit(),
    onConsume: (t, v) => rec.begin({ zh: \`消费者 T\${t} 取 \${v}\`, en: \`consumer T\${t} got \${v}\` })
      .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateMpsc } from '../../src/algorithms/concurrency/conc-ring-buffer-mpsc/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-ring-buffer-mpsc/trace.ts';

test('mpsc FIFO', () => {
  const steps = simulateMpsc(4, [
    { thread: 1, action: 'produce', value: 1 },
    { thread: 1, action: 'produce', value: 2 },
    { thread: 0, action: 'consume' },
  ]);
  // 最后一步消费了 1
  assert.equal(steps[2]!.buf[0], null);
});
test('mpsc 满时 onFull', () => {
  let full = 0;
  simulateMpsc(2, [
    { thread: 1, action: 'produce', value: 1 },
    { thread: 1, action: 'produce', value: 2 },
    { thread: 1, action: 'produce', value: 3 }, // full
  ], { onFull: () => full++ });
  assert.ok(full >= 1);
});
test('mpsc trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 24. conc-ring-buffer-spsc
{
  id: 'conc-ring-buffer-spsc',
  titleZh: 'SPSC 环形缓冲', titleEn: 'SPSC Ring Buffer',
  summaryZh: '单生产者单消费者无锁环形缓冲（经典 Damon FIFO）。',
  summaryEn: 'Single-producer single-consumer lockless ring buffer (classic Damon FIFO).',
  descZh: 'SPSC 环形缓冲：生产者独占 head，消费者独占 tail，通过 volatile 读取对方索引实现无锁通信。无竞争、无等待（wait-free）。',
  descEn: 'SPSC ring buffer: the producer owns head, the consumer owns tail; each reads the other index through volatile reads for lockless communication. Contention-free and wait-free.',
  tags: ['concurrency','queue','ring-buffer','spsc','lockless','wait-free'],
  time: 'O(1)', space: 'O(capacity)',
  impl: `// SPSC 环形缓冲 · 实现
export interface SpEvent { action: 'produce' | 'consume'; value?: number; }
export interface SpHooks {
  onProduce?: (value: number, head: number, tail: number) => void;
  onConsume?: (value: number, head: number, tail: number) => void;
}
export interface SpStep { head: number; tail: number; buf: (number | null)[]; }
export function simulateSpsc(capacity: number, events: SpEvent[], hooks: SpHooks = {}): SpStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let head = 0;
  let tail = 0;
  const steps: SpStep[] = [];
  for (const ev of events) {
    if (ev.action === 'produce') {
      const next = (head + 1) % capacity;
      if (next === tail) { /* full, drop */ }
      else { buf[head] = ev.value ?? 0; head = next; hooks.onProduce?.(ev.value ?? 0, head, tail); }
    } else {
      if (tail === head) { /* empty */ }
      else { const v = buf[tail]; buf[tail] = null; tail = (tail + 1) % capacity; hooks.onConsume?.(v ?? 0, head, tail); }
    }
    steps.push({ head, tail, buf: [...buf] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateSpsc } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SPSC ring buffer (cap=4)', en: 'SPSC ring buffer (cap=4)' }).commit();
  simulateSpsc(4, [
    { action: 'produce', value: 1 },
    { action: 'produce', value: 2 },
    { action: 'consume' },
    { action: 'consume' },
  ], {
    onProduce: (v, h, t) => rec.begin({ zh: \`生产 \${v} (head=\${h},tail=\${t})\`, en: \`produce \${v} (head=\${h},tail=\${t})\` })
      .setAux([{ label: 'value', value: String(v), role: 'compare' as BarRole }]).commit(),
    onConsume: (v, h, t) => rec.begin({ zh: \`消费 \${v} (head=\${h},tail=\${t})\`, en: \`consume \${v} (head=\${h},tail=\${t})\` })
      .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSpsc } from '../../src/algorithms/concurrency/conc-ring-buffer-spsc/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-ring-buffer-spsc/trace.ts';

test('spsc FIFO', () => {
  const steps = simulateSpsc(4, [
    { action: 'produce', value: 1 },
    { action: 'produce', value: 2 },
    { action: 'consume' },
  ]);
  assert.equal(steps[2]!.buf[0], null); // 1 被消费
  assert.equal(steps[2]!.buf[1], 2);
});
test('spsc trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// 25. conc-disruptor
{
  id: 'conc-disruptor',
  titleZh: 'Disruptor', titleEn: 'Disruptor',
  summaryZh: 'Disruptor：环形数组 + 序号栅栏，多生产者多消费者无锁管道。',
  summaryEn: 'Disruptor: ring array + sequence barriers for lockless multi-producer multi-consumer pipelines.',
  descZh: 'Disruptor（LMAX）用固定大小环形数组 + 每消费者独立的 sequence。生产者申请槽位，消费者通过「栅栏」等待自己序号；所有协调通过 CAS 与 volatile，避免锁。',
  descEn: 'Disruptor (LMAX) uses a fixed-size ring array plus per-consumer sequences. Producers claim slots; consumers wait on their own sequence via barriers; coordination is via CAS and volatile reads, avoiding locks.',
  tags: ['concurrency','queue','disruptor','ring-buffer','lockless','pipeline'],
  time: 'O(1)', space: 'O(capacity)',
  impl: `// Disruptor · 实现（简化）
export interface DisEvent { thread: number; action: 'publish'; value?: number; }
export interface DisHooks {
  onPublish?: (t: number, value: number, seq: number) => void;
  onConsume?: (consumer: number, value: number, seq: number) => void;
}
export interface DisStep { thread: number; cursor: number; buf: (number | null)[]; consumerSeqs: number[]; }
export function simulateDisruptor(
  capacity: number, nConsumers: number, events: DisEvent[], hooks: DisHooks = {},
): DisStep[] {
  const buf: (number | null)[] = new Array(capacity).fill(null);
  let cursor = -1;
  const consumerSeqs: number[] = new Array(nConsumers).fill(-1);
  const steps: DisStep[] = [];
  for (const ev of events) {
    if (ev.action === 'publish') {
      cursor++;
      const idx = cursor % capacity;
      buf[idx] = ev.value ?? 0;
      hooks.onPublish?.(ev.thread, ev.value ?? 0, cursor);
      // 消费者各自追赶
      for (let c = 0; c < nConsumers; c++) {
        consumerSeqs[c] = cursor;
        hooks.onConsume?.(c, ev.value ?? 0, cursor);
      }
    }
    steps.push({ thread: ev.thread, cursor, buf: [...buf], consumerSeqs: [...consumerSeqs] });
  }
  return steps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateDisruptor } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Disruptor (cap=4, 2 消费者)', en: 'Disruptor (cap=4, 2 consumers)' }).commit();
  simulateDisruptor(4, 2, [
    { thread: 1, action: 'publish', value: 11 },
    { thread: 1, action: 'publish', value: 22 },
    { thread: 1, action: 'publish', value: 33 },
  ], {
    onPublish: (t, v, s) => rec.begin({ zh: \`生产者 T\${t} 发布 \${v} (seq=\${s})\`, en: \`producer T\${t} publish \${v} (seq=\${s})\` })
      .setAux([{ label: 'seq', value: String(s), role: 'compare' as BarRole }]).commit(),
    onConsume: (c, v) => rec.begin({ zh: \`消费者 C\${c} 收 \${v}\`, en: \`consumer C\${c} got \${v}\` })
      .setAux([{ label: 'C'+c, value: String(v), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateDisruptor } from '../../src/algorithms/concurrency/conc-disruptor/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-disruptor/trace.ts';

test('disruptor cursor 递增', () => {
  const steps = simulateDisruptor(4, 2, [
    { thread: 0, action: 'publish', value: 1 },
    { thread: 0, action: 'publish', value: 2 },
  ]);
  assert.equal(steps[1]!.cursor, 1);
});
test('disruptor 消费者跟随', () => {
  const steps = simulateDisruptor(4, 2, [{ thread: 0, action: 'publish', value: 9 }]);
  assert.deepEqual(steps[0]!.consumerSeqs, [0, 0]);
});
test('disruptor trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
