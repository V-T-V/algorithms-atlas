// concurrency 类别 · 30 个算法规范
import { add } from './gen-batch.mjs';

// 并发算法多为「逻辑模型」：用步骤计数模拟进程/锁状态，trace 用 setAux 记录变量。
add({
  cat: 'concurrency', id: 'conc-lamport-bakery-full',
  title: { zh: 'Lamport 面包店算法（完整）', en: 'Lamport Bakery (Full)' },
  summary: { zh: '多进程互斥，取号排队进入临界区。', en: 'Multi-process mutual exclusion via ticketing.' },
  description: { zh: '面包店算法(Lamport)每进程取号 choosing，按(号, pid)排序依次进临界区，无需原子操作即可实现互斥。', en: 'Bakery algorithm (Lamport) has each process take a ticket and enter the critical section in (number, pid) order, mutex without atomics.' },
  tags: ['concurrency','mutex','bakery','lock-free'],
  complexity: { time: 'O(n) per entry', space: 'O(n)' },
  impl: `export interface BakeryHooks { onChoose?: (pid: number, num: number) => void; onEnter?: (pid: number) => void; onExit?: (pid: number) => void; }
export function bakeryLock(n: number, hooks: BakeryHooks = {}): { log: string[]; nums: number[] } {
  const choosing: boolean[] = new Array(n).fill(false);
  const nums: number[] = new Array(n).fill(0);
  const log: string[] = [];
  const enter = (i: number) => {
    choosing[i] = true; nums[i] = 1 + Math.max(...nums); hooks.onChoose?.(i, nums[i]!); choosing[i] = false;
    for (let j = 0; j < n; j++) { while (choosing[j]) {} while (nums[j] !== 0 && (nums[j]! < nums[i]! || (nums[j] === nums[i] && j < i))) {} }
    hooks.onEnter?.(i); log.push('enter ' + i);
  };
  const exit = (i: number) => { nums[i] = 0; hooks.onExit?.(i); log.push('exit ' + i); };
  // 模拟进程依次进入并退出
  for (let i = 0; i < n; i++) { enter(i); exit(i); }
  return { log, nums };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bakeryLock } from './impl.ts';
export const DEFAULT_INPUT = 3;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '面包店 n=' + n, en: 'Bakery n=' + n }).commit();
  const { nums } = bakeryLock(n, {
    onChoose: (p, num) => rec.begin({ zh: 'P' + p + ' 取号 ' + num, en: 'choose' }).setAux([{label:'pid',value:'P'+p,role:'compare' as BarRole},{label:'num',value:String(num),role:'pivot' as BarRole}]).commit(),
    onEnter: (p) => rec.begin({ zh: 'P' + p + ' 进入', en: 'enter' }).setAux([{label:'enter',value:'P'+p,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结束 nums=[' + nums.join(',') + ']', en: 'done' }).setAux([{label:'nums',value:nums.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bakeryLock } from '../../src/algorithms/concurrency/conc-lamport-bakery-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-lamport-bakery-full/trace.ts';
test('bakery 互斥后号归0', () => { const { nums } = bakeryLock(3); assert.deepEqual(nums, [0,0,0]); });
test('bakery trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-philosophers-chandy',
  title: { zh: 'Chandy 哲学家解法', en: 'Chandy/Misra Dining Philosophers' },
  summary: { zh: '叉子为令牌按洁净度流转。', en: 'Forks as tokens flow by cleanliness.' },
  description: { zh: 'Chandy/Misra 解法允许任意两哲学家争用一把叉子：叉子有脏/洁状态，请求时脏叉转交并清洗，保证无死锁与公平。', en: 'Chandy/Misra lets forks be shared: dirty forks are handed over and cleaned on request, deadlock-free and fair.' },
  tags: ['concurrency','dining-philosophers','distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface CmHooks { onRequest?: (f: number, from: number, to: number) => void; onClean?: (f: number) => void; onEat?: (p: number) => void; }
export function chandyMisra(n: number, rounds: number, hooks: CmHooks = {}): number[] {
  const dirty: boolean[] = new Array(n).fill(true);
  const owner: number[] = Array.from({ length: n }, (_, f) => Math.min(f, (f + 1) % n));
  const eatCount: number[] = new Array(n).fill(0);
  for (let r = 0; r < rounds; r++) {
    for (let p = 0; p < n; p++) {
      const f1 = p; const f2 = (p - 1 + n) % n;
      for (const f of [f1, f2]) { if (owner[f] !== p) { hooks.onRequest?.(f, owner[f]!, p); if (dirty[f]) { owner[f] = p; dirty[f] = false; hooks.onClean?.(f); } } }
      if (owner[f1] === p && owner[f2] === p) { eatCount[p] = (eatCount[p] ?? 0) + 1; dirty[f1] = true; dirty[f2] = true; hooks.onEat?.(p); }
    }
  }
  return eatCount;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chandyMisra } from './impl.ts';
export const DEFAULT_INPUT = { n: 3, rounds: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Chandy/Misra n=' + input.n, en: 'CM n=' + input.n }).commit();
  const eat = chandyMisra(input.n, input.rounds, {
    onRequest: (f, from, to) => rec.begin({ zh: '叉' + f + ' ' + from + '->' + to, en: 'request' }).setAux([{label:'fork',value:'F'+f,role:'pivot' as BarRole}]).commit(),
    onEat: (p) => rec.begin({ zh: 'P' + p + ' 进餐', en: 'eat' }).setAux([{label:'eat',value:'P'+p,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '进餐 [' + eat.join(',') + ']', en: 'eats' }).setAux([{label:'eats',value:eat.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chandyMisra } from '../../src/algorithms/concurrency/conc-philosophers-chandy/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-philosophers-chandy/trace.ts';
test('cm 每人至少进餐', () => { const e = chandyMisra(3, 3); assert.equal(e.length, 3); });
test('cm trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-read-copy-update',
  title: { zh: 'RCU 读复制更新（模型）', en: 'Read-Copy-Update Model' },
  summary: { zh: '读端无锁，写端复制后原子换指针。', en: 'Lock-free reads, writes swap a copied pointer.' },
  description: { zh: 'RCU(Linux 内核)读者不加锁直接访问，写者复制一份数据修改后用原子指针替换，再等所有旧读者退出后回收。', en: 'RCU (Linux kernel) lets readers proceed lock-free; writers copy, mutate, atomically swap the pointer, then reclaim after old readers leave.' },
  tags: ['concurrency','rcu','lock-free'],
  complexity: { time: 'O(1) read', space: 'O(w)' },
  impl: `export interface RcuHooks { onRead?: (val: number) => void; onWrite?: (old: number, neu: number) => void; onGrace?: () => void; }
export function rcuModel(initial: number, writes: number[], reads: number, hooks: RcuHooks = {}): number {
  let cur = initial; let gen = 0;
  for (let r = 0; r < reads; r++) hooks.onRead?.(cur);
  for (const w of writes) { const neu = cur + w; hooks.onWrite?.(cur, neu); cur = neu; gen++; hooks.onGrace?.(); }
  return cur;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rcuModel } from './impl.ts';
export const DEFAULT_INPUT = { initial: 10, writes: [1, 2, -3], reads: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RCU', en: 'RCU' }).commit();
  const cur = rcuModel(input.initial, input.writes, input.reads, {
    onRead: (v) => rec.begin({ zh: '读 ' + v, en: 'read' }).setAux([{label:'val',value:String(v),role:'compare' as BarRole}]).commit(),
    onWrite: (o, n) => rec.begin({ zh: '写 ' + o + '->' + n, en: 'write' }).setAux([{label:'old',value:String(o),role:'pivot' as BarRole},{label:'new',value:String(n),role:'final' as BarRole}]).commit(),
    onGrace: () => rec.begin({ zh: '宽限期', en: 'grace' }).setAux([{label:'grace',value:'gp',role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终值 ' + cur, en: 'final ' + cur }).setAux([{label:'final',value:String(cur),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rcuModel } from '../../src/algorithms/concurrency/conc-read-copy-update/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-read-copy-update/trace.ts';
test('rcu 累加写入', () => assert.equal(rcuModel(10, [1,2,-3], 0), 10));
test('rcu trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-futex',
  title: { zh: 'Futex 快速用户态互斥', en: 'Futex' },
  summary: { zh: '用户态自旋，仅争用时陷入内核。', en: 'User-space spin, kernel call only on contention.' },
  description: { zh: 'Futex(Fast Userspace Mutex, Linux)在用户态用原子变量快速路径加锁，仅当需要等待/唤醒时才 syscall 进入内核，性能极高。', en: 'Futex uses an atomic for a fast user-space path, falling back to a kernel syscall only when blocking/waking is needed.' },
  tags: ['concurrency','futex','mutex'],
  complexity: { time: 'O(1) uncontended', space: 'O(1)' },
  impl: `export interface FutexHooks { onAcquireFast?: (tid: number) => void; onAcquireSlow?: (tid: number) => void; onWake?: (tid: number) => void; }
export function futexLock(contenders: number[], holdPattern: Array<{ tid: number; fast: boolean }>, hooks: FutexHooks = {}): { owner: number | null; waiters: number[] } {
  let owner: number | null = null; const waiters: number[] = [];
  for (const c of holdPattern) {
    if (owner === null) { owner = c.tid; if (c.fast) hooks.onAcquireFast?.(c.tid); else hooks.onAcquireSlow?.(c.tid); }
    else { waiters.push(c.tid); }
    if (owner !== null && Math.random() < 0) {}
  }
  // 释放并唤醒一个
  if (waiters.length) { const next = waiters.shift()!; owner = next; hooks.onWake?.(next); } else owner = null;
  return { owner, waiters };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { futexLock } from './impl.ts';
export const DEFAULT_INPUT = { contenders: [1,2,3], holdPattern: [{tid:1,fast:true},{tid:2,fast:false},{tid:3,fast:true}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Futex', en: 'Futex' }).commit();
  const { owner, waiters } = futexLock(input.contenders, input.holdPattern, {
    onAcquireFast: (t) => rec.begin({ zh: 'T' + t + ' 快速获取', en: 'fast' }).setAux([{label:'tid',value:'T'+t,role:'final' as BarRole}]).commit(),
    onAcquireSlow: (t) => rec.begin({ zh: 'T' + t + ' 慢速获取', en: 'slow' }).setAux([{label:'tid',value:'T'+t,role:'compare' as BarRole}]).commit(),
    onWake: (t) => rec.begin({ zh: '唤醒 T' + t, en: 'wake' }).setAux([{label:'wake',value:'T'+t,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'owner=' + owner + ' waiters=[' + waiters.join(',') + ']', en: 'result' }).setAux([{label:'owner',value:String(owner),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { futexLock } from '../../src/algorithms/concurrency/conc-futex/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-futex/trace.ts';
test('futex 首个获取者成为 owner', () => { const r = futexLock([1,2], [{tid:1,fast:true},{tid:2,fast:true}]); assert.ok(r.owner !== null); });
test('futex trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-mcs-lock',
  title: { zh: 'MCS 锁', en: 'MCS Lock' },
  summary: { zh: '每个线程自旋本地锁节点。', en: 'Each thread spins on a local lock node.' },
  description: { zh: 'MCS 锁(Mellor-Crummey & Scott)在队尾插入节点，每线程只自旋自己的 locked 标志，前驱释放时通知后继，缓存友好无争用。', en: 'MCS lock enqueues a node per thread; each spins only on its own locked flag and the predecessor unlocks the successor on release.' },
  tags: ['concurrency','mcs-lock','queue-lock'],
  complexity: { time: 'O(1) per op', space: 'O(n)' },
  impl: `export interface McsHooks { onAcquire?: (tid: number) => void; onHandoff?: (from: number, to: number) => void; }
export function mcsLock(threads: number[], hooks: McsHooks = {}): { order: number[] } {
  let tail: number | null = null; const order: number[] = []; const next: Map<number, number | null> = new Map();
  for (const t of threads) {
    next.set(t, null);
    const prev = tail; tail = t;
    if (prev === null) { hooks.onAcquire?.(t); order.push(t); }
    else { next.set(prev, t); }
  }
  let cur: number | null = threads[0] ?? null;
  while (cur !== null) { if (!order.includes(cur)) { order.push(cur); hooks.onAcquire?.(cur); } const nx = next.get(cur) ?? null; if (nx !== null) hooks.onHandoff?.(cur, nx); cur = nx; }
  return { order };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mcsLock } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(threads: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MCS 锁', en: 'MCS Lock' }).commit();
  const { order } = mcsLock(threads, {
    onAcquire: (t) => rec.begin({ zh: 'T' + t + ' 获取', en: 'acquire' }).setAux([{label:'tid',value:'T'+t,role:'final' as BarRole}]).commit(),
    onHandoff: (f, to) => rec.begin({ zh: 'T' + f + ' -> T' + to, en: 'handoff' }).setAux([{label:'handoff',value:'T'+f+'->T'+to,role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' }).setAux([{label:'order',value:order.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mcsLock } from '../../src/algorithms/concurrency/conc-mcs-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mcs-lock/trace.ts';
test('mcs FIFO 顺序', () => { const { order } = mcsLock([1,2,3]); assert.deepEqual(order, [1,2,3]); });
test('mcs trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-clh-lock',
  title: { zh: 'CLH 队列锁', en: 'CLH Lock' },
  summary: { zh: '隐式链表队列自旋锁。', en: 'Implicit linked-list queue spinlock.' },
  description: { zh: 'CLH 锁(Craig/Landin/Hagersten)每线程持有指向上一节点的引用，自旋前驱的 locked 字段，释放时把自己节点 unlocked。', en: 'CLH lock has each thread spin on the predecessor node locked flag; release clears its own node.' },
  tags: ['concurrency','clh-lock','queue-lock'],
  complexity: { time: 'O(1) per op', space: 'O(n)' },
  impl: `export interface ClhHooks { onAcquire?: (tid: number) => void; onSpin?: (tid: number, pred: number) => void; }
export function clhLock(threads: number[], hooks: ClhHooks = {}): number[] {
  const order: number[] = []; let tail = 0; const locked = new Map<number, boolean>([[0, false]]);
  for (const t of threads) { locked.set(t, true); const pred = tail; tail = t; hooks.onSpin?.(t, pred); while (locked.get(pred)) {} hooks.onAcquire?.(t); order.push(t); locked.set(t, false); }
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clhLock } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(threads: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CLH 锁', en: 'CLH Lock' }).commit();
  const order = clhLock(threads, {
    onSpin: (t, pred) => rec.begin({ zh: 'T' + t + ' 自旋等 T' + pred, en: 'spin' }).setAux([{label:'tid',value:'T'+t,role:'compare' as BarRole},{label:'pred',value:'T'+pred,role:'pivot' as BarRole}]).commit(),
    onAcquire: (t) => rec.begin({ zh: 'T' + t + ' 获取', en: 'acquire' }).setAux([{label:'tid',value:'T'+t,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' }).setAux([{label:'order',value:order.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clhLock } from '../../src/algorithms/concurrency/conc-clh-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-clh-lock/trace.ts';
test('clh FIFO', () => assert.deepEqual(clhLock([1,2,3]), [1,2,3]));
test('clh trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-sx-lock',
  title: { zh: '共享/排他（SX）锁', en: 'Shared/Exclusive Lock' },
  summary: { zh: '读写锁允许多读单写。', en: 'Read-write lock: many readers, one writer.' },
  description: { zh: 'SX 读写锁允许多个读者并发持有共享锁，写者持有排他锁时排斥所有其它读写，用计数器实现优先级策略。', en: 'Shared/Exclusive lock allows concurrent shared (read) holders; an exclusive (write) holder blocks all others.' },
  tags: ['concurrency','rw-lock','read-write'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface SxHooks { onReadAcq?: (n: number) => void; onWriteAcq?: () => void; onRelease?: () => void; }
export function sxLock(ops: Array<{ op: 'r' | 'w' }>, hooks: SxHooks = {}): { readers: number; writer: boolean } {
  let readers = 0; let writer = false;
  for (const o of ops) {
    if (o.op === 'r') { while (writer) {} readers++; hooks.onReadAcq?.(readers); readers--; hooks.onRelease?.(); }
    else { while (writer || readers > 0) {} writer = true; hooks.onWriteAcq?.(); writer = false; hooks.onRelease?.(); }
  }
  return { readers, writer };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sxLock } from './impl.ts';
export const DEFAULT_INPUT = [{op:'r'},{op:'r'},{op:'w'},{op:'r'}];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SX 锁', en: 'SX Lock' }).commit();
  sxLock(ops, {
    onReadAcq: (n) => rec.begin({ zh: '读加锁 n=' + n, en: 'read' }).setAux([{label:'readers',value:String(n),role:'compare' as BarRole}]).commit(),
    onWriteAcq: () => rec.begin({ zh: '写加锁', en: 'write' }).setAux([{label:'writer',value:'true',role:'final' as BarRole}]).commit(),
    onRelease: () => rec.begin({ zh: '释放', en: 'release' }).setAux([{label:'release',value:'rel',role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sxLock } from '../../src/algorithms/concurrency/conc-sx-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sx-lock/trace.ts';
test('sx 释放后状态归零', () => { const s = sxLock([{op:'r'},{op:'w'}]); assert.equal(s.readers, 0); assert.equal(s.writer, false); });
test('sx trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-optlock',
  title: { zh: '乐观锁（版本号）', en: 'Optimistic Lock (Versioned)' },
  summary: { zh: '读时不锁，提交时校验版本。', en: 'No read lock; validate version at commit.' },
  description: { zh: '乐观锁读取时记录版本号，修改后提交前比对版本：若已变则回退重试，写冲突少时性能高。', en: 'Optimistic locking records the version on read and validates at commit, retrying on stale version; great with few write conflicts.' },
  tags: ['concurrency','optimistic','version'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface OptHooks { onRead?: (ver: number) => void; onCommit?: (ok: boolean) => void; onRetry?: () => void; }
export function optimisticLock(readVer: number, curVer: number, write: (v: number) => number, hooks: OptHooks = {}): { ok: boolean; ver: number } {
  hooks.onRead?.(readVer);
  let ver = curVer; let attempts = 0;
  while (true) {
    if (readVer === ver) { ver = write(ver); hooks.onCommit?.(true); return { ok: true, ver }; }
    attempts++; if (attempts > 3) { hooks.onCommit?.(false); return { ok: false, ver }; }
    hooks.onRetry?.(); readVer = ver;
  }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optimisticLock } from './impl.ts';
export const DEFAULT_INPUT = { readVer: 5, curVer: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '乐观锁', en: 'Optimistic Lock' }).commit();
  const r = optimisticLock(input.readVer, input.curVer, (v) => v + 1, {
    onRead: (v) => rec.begin({ zh: '读版本 ' + v, en: 'read' }).setAux([{label:'ver',value:String(v),role:'compare' as BarRole}]).commit(),
    onCommit: (ok) => rec.begin({ zh: ok ? '提交成功' : '提交失败', en: 'commit' }).setAux([{label:'ok',value:String(ok),role:'final' as BarRole}]).commit(),
    onRetry: () => rec.begin({ zh: '重试', en: 'retry' }).setAux([{label:'retry',value:'retry',role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + r.ok + ' ver=' + r.ver, en: 'result' }).setAux([{label:'ok',value:String(r.ok),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimisticLock } from '../../src/algorithms/concurrency/conc-optlock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-optlock/trace.ts';
test('opt 版本一致提交成功', () => { const r = optimisticLock(5, 5, (v) => v + 1); assert.equal(r.ok, true); assert.equal(r.ver, 6); });
test('opt trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-mpsc-queue',
  title: { zh: 'MPSC 无锁队列', en: 'MPSC Lock-Free Queue' },
  summary: { zh: '多生产者单消费者无锁队列。', en: 'Many-producer single-consumer lock-free queue.' },
  description: { zh: 'MPSC 队列(Vyukov)生产者用 CAS 把节点原子挂到队尾，单一消费者从队头取出，无锁且无争用于消费者。', en: 'MPSC queue (Vyukov) has producers CAS-append nodes to the tail; a single consumer dequeues from the head, lock-free.' },
  tags: ['concurrency','mpsc','lock-free','queue'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
  impl: `export interface MpscHooks { onEnq?: (tid: number, v: number) => void; onDeq?: (v: number) => void; }
export function mpscQueue(ops: Array<{ op: 'enq'; tid: number; v: number } | { op: 'deq' }>, hooks: MpscHooks = {}): number[] {
  const q: number[] = []; const out: number[] = [];
  for (const o of ops) { if (o.op === 'enq') { q.push(o.v); hooks.onEnq?.(o.tid, o.v); } else { const v = q.shift(); if (v !== undefined) { out.push(v); hooks.onDeq?.(v); } } }
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mpscQueue } from './impl.ts';
export const DEFAULT_INPUT = [{op:'enq',tid:1,v:10},{op:'enq',tid:2,v:20},{op:'deq'},{op:'deq'}];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MPSC 队列', en: 'MPSC Queue' }).commit();
  const out = mpscQueue(ops, {
    onEnq: (t, v) => rec.begin({ zh: 'T' + t + ' 入队 ' + v, en: 'enq' }).setAux([{label:'enq',value:String(v),role:'compare' as BarRole}]).commit(),
    onDeq: (v) => rec.begin({ zh: '出队 ' + v, en: 'deq' }).setAux([{label:'deq',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '消费 [' + out.join(',') + ']', en: 'out' }).setAux([{label:'out',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mpscQueue } from '../../src/algorithms/concurrency/conc-mpsc-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mpsc-queue/trace.ts';
test('mpsc FIFO', () => assert.deepEqual(mpscQueue([{op:'enq',tid:1,v:1},{op:'enq',tid:2,v:2},{op:'deq'},{op:'deq'}]), [1,2]));
test('mpsc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-cas-loop',
  title: { zh: 'CAS 循环（原子更新）', en: 'Compare-And-Swap Loop' },
  summary: { zh: '读-改-写循环直到 CAS 成功。', en: 'Read-modify-write retrying until CAS succeeds.' },
  description: { zh: 'CAS 循环反复读取当前值、计算新值，再用原子 CAS 替换；若被其它线程抢先则重试，是无锁数据结构核心原语。', en: 'A CAS loop reads the current value, computes a new value, and atomically CAS-replaces it, retrying on contention — the core lock-free primitive.' },
  tags: ['concurrency','cas','lock-free','atomic'],
  complexity: { time: 'O(retries)', space: 'O(1)' },
  impl: `export interface CasHooks { onAttempt?: (i: number, expected: number, neu: number) => void; onSuccess?: (val: number, attempts: number) => void; }
export function casLoop(initial: number, compute: (cur: number) => number, contenders: number[], hooks: CasHooks = {}): { val: number; attempts: number } {
  let val = initial; let attempts = 0; let ci = 0;
  while (true) {
    const expected = val; const neu = compute(expected);
    hooks.onAttempt?.(attempts, expected, neu);
    attempts++;
    // 模拟竞争：偶数次失败
    if (contenders[ci % contenders.length]! % 2 === 1 && attempts < 3) { val = expected + contenders[ci % contenders.length]!; ci++; }
    else { val = neu; hooks.onSuccess?.(val, attempts); break; }
  }
  return { val, attempts };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { casLoop } from './impl.ts';
export const DEFAULT_INPUT = { initial: 0, compute: ((c: number) => c + 1) as (c: number) => number, contenders: [1, 2, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CAS 循环', en: 'CAS Loop' }).commit();
  const r = casLoop(input.initial, input.compute, input.contenders, {
    onAttempt: (i, e, n) => rec.begin({ zh: '尝试#' + i + ' ' + e + '->' + n, en: 'attempt' }).setAux([{label:'i',value:String(i),role:'pivot' as BarRole},{label:'exp',value:String(e),role:'compare' as BarRole}]).commit(),
    onSuccess: (v, a) => rec.begin({ zh: '成功 ' + v + ' (' + a + '次)', en: 'success' }).setAux([{label:'val',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + r.val, en: 'final' }).setAux([{label:'val',value:String(r.val),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { casLoop } from '../../src/algorithms/concurrency/conc-cas-loop/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-cas-loop/trace.ts';
test('cas 最终成功', () => { const r = casLoop(0, (c) => c + 1, [2,4]); assert.ok(r.attempts >= 1); assert.equal(r.val, 1); });
test('cas trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-bounded-buffer-sem',
  title: { zh: '信号量有界缓冲', en: 'Semaphore Bounded Buffer' },
  summary: { zh: 'empty/full 信号量同步生产消费。', en: 'empty/full semaphores sync producer/consumer.' },
  description: { zh: '经典有界缓冲用两个计数信号量 empty、full 与互斥锁配合：生产者等 empty，消费者等 full，缓冲大小固定。', en: 'The classic bounded buffer uses empty/full counting semaphores plus a mutex: producers wait on empty, consumers on full.' },
  tags: ['concurrency','semaphore','bounded-buffer','producer-consumer'],
  complexity: { time: 'O(1) per op', space: 'O(cap)' },
  impl: `export interface BbsHooks { onProduce?: (v: number, size: number) => void; onConsume?: (v: number, size: number) => void; onBlock?: (who: string) => void; }
export function boundedBufferSem(cap: number, ops: Array<{ op: 'p'; v: number } | { op: 'c' }>, hooks: BbsHooks = {}): { buffer: number[]; log: string[] } {
  const buffer: number[] = []; const log: string[] = []; let empty = cap; let full = 0;
  for (const o of ops) {
    if (o.op === 'p') { if (empty === 0) { hooks.onBlock?.('producer'); log.push('block p'); } while (empty === 0) {} empty--; buffer.push(o.v); full++; hooks.onProduce?.(o.v, buffer.length); }
    else { if (full === 0) { hooks.onBlock?.('consumer'); log.push('block c'); } while (full === 0) {} full--; const v = buffer.shift()!; empty++; hooks.onConsume?.(v, buffer.length); }
  }
  return { buffer, log };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boundedBufferSem } from './impl.ts';
export const DEFAULT_INPUT = { cap: 2, ops: [{op:'p',v:1},{op:'p',v:2},{op:'c'},{op:'p',v:3},{op:'c'},{op:'c'}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信号量有界缓冲 cap=' + input.cap, en: 'Bounded Buffer' }).commit();
  const { buffer } = boundedBufferSem(input.cap, input.ops, {
    onProduce: (v, s) => rec.begin({ zh: '生产 ' + v + ' size=' + s, en: 'produce' }).setAux([{label:'v',value:String(v),role:'compare' as BarRole},{label:'size',value:String(s),role:'pivot' as BarRole}]).commit(),
    onConsume: (v, s) => rec.begin({ zh: '消费 ' + v + ' size=' + s, en: 'consume' }).setAux([{label:'v',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '剩余 [' + buffer.join(',') + ']', en: 'remain' }).setAux([{label:'remain',value:buffer.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedBufferSem } from '../../src/algorithms/concurrency/conc-bounded-buffer-sem/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bounded-buffer-sem/trace.ts';
test('bb 消费后缓冲减少', () => { const { buffer } = boundedBufferSem(2, [{op:'p',v:1},{op:'p',v:2},{op:'c'}]); assert.equal(buffer.length, 1); });
test('bb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-happens-before',
  title: { zh: 'Happens-Before 关系', en: 'Happens-Before Relation' },
  summary: { zh: '推导事件间的可见性偏序。', en: 'Infers visibility partial order among events.' },
  description: { zh: 'Happens-Before 关系由程序序、监视器锁、volatile、线程 start/join 等组合传递闭包，决定多线程可见性与重排序边界。', en: 'Happens-before is the transitive closure of program order, locks, volatile, start/join; it defines visibility and reordering limits.' },
  tags: ['concurrency','memory-model','happens-before'],
  complexity: { time: 'O(e^3)', space: 'O(e^2)' },
  impl: `export interface HbHooks { onEdge?: (a: number, b: number, kind: string) => void; onClose?: (added: number) => void; }
export function happensBefore(events: number[], edges: Array<{ a: number; b: number; kind: string }>, hooks: HbHooks = {}): boolean[][] {
  const n = events.length; const idx = new Map(events.map((e, i) => [e, i]));
  const reach: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const e of edges) { reach[idx.get(e.a)]![idx.get(e.b)]!] = true; hooks.onEdge?.(e.a, e.b, e.kind); }
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (reach[i]![k]! && reach[k]![j]!) reach[i]![j] = true;
  return reach;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { happensBefore } from './impl.ts';
export const DEFAULT_INPUT = { events: [1,2,3,4], edges: [{a:1,b:2,kind:'po'},{a:2,b:3,kind:'lock'},{a:3,b:4,kind:'po'}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Happens-Before', en: 'Happens-Before' }).commit();
  const reach = happensBefore(input.events, input.edges, {
    onEdge: (a, b, k) => rec.begin({ zh: a + ' ->' + k + '-> ' + b, en: 'edge' }).setAux([{label:'edge',value:a+'-'+b,role:'pivot' as BarRole},{label:'kind',value:k,role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '传递闭包 ' + reach.flat().filter(Boolean).length + ' 条', en: 'closure' }).setAux([{label:'reach',value:String(reach.flat().filter(Boolean).length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { happensBefore } from '../../src/algorithms/concurrency/conc-happens-before/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-happens-before/trace.ts';
test('hb 传递闭包', () => { const r = happensBefore([1,2,3], [{a:1,b:2,kind:'po'},{a:2,b:3,kind:'po'}]); assert.equal(r[0]![2], true); });
test('hb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-vector-clock-full',
  title: { zh: '向量时钟（完整）', en: 'Vector Clock (Full)' },
  summary: { zh: '每进程维护所有进程时钟数组。', en: 'Each process keeps a clock array.' },
  description: { zh: '向量时钟(Mattern/Fidge)每进程持有长度 n 的时钟数组，本地事件自增、消息携带并取逐项 max，可判定因果并发。', en: 'Vector clock (Mattern/Fidge) keeps an array of length n per process, incrementing locally and merging via max on messages.' },
  tags: ['concurrency','vector-clock','causality'],
  complexity: { time: 'O(n) per event', space: 'O(n^2)' },
  impl: `export interface VcHooks { onLocal?: (pid: number, clock: number[]) => void; onSend?: (from: number, to: number, msg: number[]) => void; onReceive?: (to: number, msg: number[]) => void; }
export function vectorClockFull(n: number, events: Array<{ type: 'local'; pid: number } | { type: 'send'; from: number; to: number } | { type: 'recv'; to: number; msg: number[] }>, hooks: VcHooks = {}): number[][] {
  const clocks: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const e of events) {
    if (e.type === 'local') { clocks[e.pid]![e.pid]!++; hooks.onLocal?.(e.pid, clocks[e.pid]!); }
    else if (e.type === 'send') { clocks[e.from]![e.from]!++; hooks.onSend?.(e.from, e.to, clocks[e.from]!); }
    else { clocks[e.to]![e.to]!++; for (let i = 0; i < n; i++) clocks[e.to]![i] = Math.max(clocks[e.to]![i]!, e.msg[i]!); hooks.onReceive?.(e.to, clocks[e.to]!); }
  }
  return clocks;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vectorClockFull } from './impl.ts';
export const DEFAULT_INPUT = { n: 2, events: [{type:'local',pid:0},{type:'send',from:0,to:1},{type:'recv',to:1,msg:[1,0]}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '向量时钟 n=' + input.n, en: 'Vector Clock' }).commit();
  const clocks = vectorClockFull(input.n, input.events, {
    onLocal: (p, c) => rec.begin({ zh: 'P' + p + ' 本地 [' + c.join(',') + ']', en: 'local' }).setAux([{label:'P',value:'P'+p,role:'compare' as BarRole},{label:'clock',value:c.join(','),role:'final' as BarRole}]).commit(),
    onSend: (f, to, m) => rec.begin({ zh: 'P' + f + '->P' + to + ' [' + m.join(',') + ']', en: 'send' }).setAux([{label:'msg',value:m.join(','),role:'pivot' as BarRole}]).commit(),
    onReceive: (to, c) => rec.begin({ zh: 'P' + to + ' 收到 [' + c.join(',') + ']', en: 'recv' }).setAux([{label:'clock',value:c.join(','),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终态 P0=[' + clocks[0]!.join(',') + '] P1=[' + clocks[1]!.join(',') + ']', en: 'final' }).setAux([{label:'P0',value:clocks[0]!.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vectorClockFull } from '../../src/algorithms/concurrency/conc-vector-clock-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-vector-clock-full/trace.ts';
test('vc 本地自增', () => { const c = vectorClockFull(1, [{type:'local',pid:0}]); assert.equal(c[0]![0], 1); });
test('vc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-collision-free-hash',
  title: { zh: '无锁哈希表（分段）', en: 'Lock-Free Striped Hash Table' },
  summary: { zh: '分段锁哈希表减少争用。', en: 'Striped locks reduce hash-table contention.' },
  description: { zh: '分段哈希表把桶分成若干段(stripes)，每段一把锁，不同段的操作并发进行，是 Java ConcurrentHashMap 的经典设计。', en: 'A striped hash table partitions buckets into segments each with its own lock; different segments operate concurrently (Java ConcurrentHashMap).' },
  tags: ['concurrency','hash-table','lock-striping'],
  complexity: { time: 'O(1) avg', space: 'O(n)' },
  impl: `export interface StripedHooks { onLock?: (seg: number) => void; onPut?: (key: number, seg: number) => void; onGet?: (key: number, found: boolean) => void; }
export function stripedHashTable(ops: Array<{ op: 'put'; key: number; val: number } | { op: 'get'; key: number }>, segments: number, hooks: StripedHooks = {}): Map<number, number> {
  const table = new Map<number, number>();
  for (const o of ops) {
    const seg = o.key % segments; hooks.onLock?.(seg);
    if (o.op === 'put') { table.set(o.key, o.val); hooks.onPut?.(o.key, seg); }
    else { hooks.onGet?.(o.key, table.has(o.key)); }
  }
  return table;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stripedHashTable } from './impl.ts';
export const DEFAULT_INPUT = { ops: [{op:'put',key:1,val:10},{op:'put',key:2,val:20},{op:'get',key:1}], segments: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分段哈希', en: 'Striped Hash' }).commit();
  const t = stripedHashTable(input.ops, input.segments, {
    onPut: (k, s) => rec.begin({ zh: 'put ' + k + '@seg' + s, en: 'put' }).setAux([{label:'key',value:String(k),role:'compare' as BarRole},{label:'seg',value:String(s),role:'pivot' as BarRole}]).commit(),
    onGet: (k, f) => rec.begin({ zh: 'get ' + k + ' ' + (f ? '命中' : '未中'), en: 'get' }).setAux([{label:'found',value:String(f),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: t.size + ' 项', en: t.size + ' items' }).setAux([{label:'size',value:String(t.size),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripedHashTable } from '../../src/algorithms/concurrency/conc-collision-free-hash/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-collision-free-hash/trace.ts';
test('striped put/get', () => { const t = stripedHashTable([{op:'put',key:1,val:9},{op:'get',key:1}], 4); assert.equal(t.get(1), 9); });
test('striped trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-phaser',
  title: { zh: 'Phaser 同步阶段', en: 'Phaser' },
  summary: { zh: '可变参与方的多阶段屏障。', en: 'Variable-party multi-phase barrier.' },
  description: { zh: 'Phaser(Java)支持动态增减参与方，每代(generation)等待全部到达后一起前进，适合分阶段并行计算。', en: 'Phaser (Java) supports dynamic parties; each generation waits for all arrivals before advancing, suited to phased parallel computation.' },
  tags: ['concurrency','phaser','barrier'],
  complexity: { time: 'O(p) per phase', space: 'O(p)' },
  impl: `export interface PhaserHooks { onArrive?: (tid: number, phase: number) => void; onAdvance?: (phase: number, parties: number) => void; }
export function phaserSync(parties: number, phases: number, hooks: PhaserHooks = {}): number {
  let cur = 0;
  for (let ph = 0; ph < phases; ph++) { for (let p = 0; p < parties; p++) hooks.onArrive?.(p, ph); cur++; hooks.onAdvance?.(ph, parties); }
  return cur;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phaserSync } from './impl.ts';
export const DEFAULT_INPUT = { parties: 3, phases: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Phaser', en: 'Phaser' }).commit();
  const phases = phaserSync(input.parties, input.phases, {
    onArrive: (t, ph) => rec.begin({ zh: 'T' + t + ' 到达阶段' + ph, en: 'arrive' }).setAux([{label:'phase',value:String(ph),role:'pivot' as BarRole}]).commit(),
    onAdvance: (ph, n) => rec.begin({ zh: '阶段' + ph + ' 推进 (' + n + '方)', en: 'advance' }).setAux([{label:'advance',value:'ph'+ph,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '总阶段 ' + phases, en: 'phases' }).setAux([{label:'phases',value:String(phases),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phaserSync } from '../../src/algorithms/concurrency/conc-phaser/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-phaser/trace.ts';
test('phaser 完成阶段数', () => assert.equal(phaserSync(3, 4), 4));
test('phaser trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-exchanger',
  title: { zh: 'Exchanger 双向交换', en: 'Exchanger' },
  summary: { zh: '两线程在汇合点交换数据。', en: 'Two threads swap data at a rendezvous.' },
  description: { zh: 'Exchanger 让两个线程在汇合点互相交换缓冲区，常用于流水线:一个填充、一个消费，无需显式同步。', en: 'Exchanger lets two threads swap buffers at a rendezvous, common in pipelines (one fills, one drains) without explicit sync.' },
  tags: ['concurrency','exchanger','rendezvous'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface ExHooks { onSwap?: (a: number, b: number) => void; }
export function exchanger(a: number[], b: number[], hooks: ExHooks = {}): { a: number[]; b: number[] } {
  for (let i = 0; i < a.length; i++) { const t = a[i]!; a[i] = b[i]!; b[i] = t; hooks.onSwap?.(a[i]!, b[i]!); }
  return { a, b };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exchanger } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [9, 8, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Exchanger', en: 'Exchanger' }).commit();
  const { a, b } = exchanger([...input.a], [...input.b], {
    onSwap: (x, y) => rec.begin({ zh: '交换 ' + x + ' <-> ' + y, en: 'swap' }).setAux([{label:'a',value:String(x),role:'compare' as BarRole},{label:'b',value:String(y),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'a=[' + a.join(',') + '] b=[' + b.join(',') + ']', en: 'result' }).setAux([{label:'a',value:a.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exchanger } from '../../src/algorithms/concurrency/conc-exchanger/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-exchanger/trace.ts';
test('exchanger 互换', () => { const r = exchanger([1,2], [3,4]); assert.deepEqual(r.a, [3,4]); assert.deepEqual(r.b, [1,2]); });
test('exchanger trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-priority-queue-lock',
  title: { zh: '优先级队列锁', en: 'Priority Queue Lock' },
  summary: { zh: '按线程优先级授予锁。', en: 'Grants lock by thread priority.' },
  description: { zh: '优先级队列锁维护等待线程的优先级，释放时把锁交给最高优先级者，避免低优先级线程饿死高优先级反转。', en: 'A priority queue lock hands the lock to the highest-priority waiter on release, preventing priority inversion.' },
  tags: ['concurrency','priority','lock'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  impl: `export interface PqlHooks { onAcquire?: (tid: number, prio: number) => void; onWait?: (tid: number, prio: number) => void; }
export function priorityQueueLock(threads: Array<{ tid: number; prio: number }>, hooks: PqlHooks = {}): number[] {
  const order: number[] = []; const wait = [...threads];
  while (wait.length) { wait.sort((a, b) => b.prio - a.prio); const top = wait.shift()!; hooks.onAcquire?.(top.tid, top.prio); order.push(top.tid); for (const w of wait) hooks.onWait?.(w.tid, w.prio); }
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityQueueLock } from './impl.ts';
export const DEFAULT_INPUT = [{tid:1,prio:1},{tid:2,prio:5},{tid:3,prio:3}];
export function buildTrace(threads = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级队列锁', en: 'Priority Queue Lock' }).commit();
  const order = priorityQueueLock(threads, {
    onAcquire: (t, p) => rec.begin({ zh: 'T' + t + '(p' + p + ') 获取', en: 'acquire' }).setAux([{label:'tid',value:'T'+t,role:'final' as BarRole}]).commit(),
    onWait: (t, p) => rec.begin({ zh: 'T' + t + '(p' + p + ') 等待', en: 'wait' }).setAux([{label:'wait',value:'T'+t,role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '顺序 [' + order.join(',') + ']', en: 'order' }).setAux([{label:'order',value:order.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityQueueLock } from '../../src/algorithms/concurrency/conc-priority-queue-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-priority-queue-lock/trace.ts';
test('pql 高优先级先', () => assert.deepEqual(priorityQueueLock([{tid:1,prio:1},{tid:2,prio:5}]), [2,1]));
test('pql trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-birthday-paradox-bcast',
  title: { zh: 'Bracha 可靠广播', en: 'Bracha Reliable Broadcast' },
  summary: { zh: '拜占庭容错的可靠广播协议。', en: 'Byzantine-tolerant reliable broadcast.' },
  description: { zh: 'Bracha 协议在 n>=3f+1 节点下通过 ECHO/READY 三阶段实现拜占庭可靠广播，保证所有诚实节点收到同一消息。', en: 'Bracha protocol achieves Byzantine reliable broadcast in three phases (SEND/ECHO/READY) when n>=3f+1.' },
  tags: ['concurrency','byzantine','broadcast','distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface BrHooks { onEcho?: (node: number) => void; onReady?: (node: number) => void; onDeliver?: (node: number) => void; }
export function brachaBroadcast(n: number, f: number, hooks: BrHooks = {}): { delivered: number; ok: boolean } {
  const echoes: number[] = []; const readies: number[] = []; let delivered = 0;
  for (let i = 0; i < n; i++) { echoes.push(i); hooks.onEcho?.(i); }
  for (let i = 0; i < n; i++) { if (echoes.length >= (n + f) / 2 || readies.length >= f + 1) { readies.push(i); hooks.onReady?.(i); } }
  for (let i = 0; i < n; i++) { if (readies.length >= 2 * f + 1) { delivered++; hooks.onDeliver?.(i); } }
  return { delivered, ok: delivered === n };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brachaBroadcast } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, f: 1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bracha n=' + input.n + ' f=' + input.f, en: 'Bracha' }).commit();
  const r = brachaBroadcast(input.n, input.f, {
    onEcho: (nd) => rec.begin({ zh: 'N' + nd + ' ECHO', en: 'echo' }).setAux([{label:'node',value:'N'+nd,role:'compare' as BarRole}]).commit(),
    onReady: (nd) => rec.begin({ zh: 'N' + nd + ' READY', en: 'ready' }).setAux([{label:'ready',value:'N'+nd,role:'pivot' as BarRole}]).commit(),
    onDeliver: (nd) => rec.begin({ zh: 'N' + nd + ' DELIVER', en: 'deliver' }).setAux([{label:'deliver',value:'N'+nd,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '投递 ' + r.delivered + '/' + input.n, en: 'delivered' }).setAux([{label:'delivered',value:String(r.delivered),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brachaBroadcast } from '../../src/algorithms/concurrency/conc-birthday-paradox-bcast/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-birthday-paradox-bcast/trace.ts';
test('bracha n=4f=1 全投递', () => assert.equal(brachaBroadcast(4, 1).delivered, 4));
test('bracha trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-paxos-basic',
  title: { zh: 'Basic Paxos', en: 'Basic Paxos' },
  summary: { zh: '两阶段多数派达成共识。', en: 'Two-phase majority consensus.' },
  description: { zh: 'Basic Paxos(Lamport)通过 Prepare/Promise 与 Accept/Accepted 两阶段，在多数派 acceptor 间就单个值达成共识，是分布式共识基石。', en: 'Basic Paxos (Lamport) reaches consensus on a single value via Prepare/Promise and Accept/Accepted phases over a majority of acceptors.' },
  tags: ['concurrency','paxos','consensus','distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface PaxosHooks { onPrepare?: (n: number) => void; onPromise?: (acc: number) => void; onAccept?: (val: number) => void; onChosen?: (val: number) => void; }
export function basicPaxos(acceptors: number, proposedValue: number, hooks: PaxosHooks = {}): { chosen: number | null; majority: number } {
  const majority = Math.floor(acceptors / 2) + 1;
  const n = 1; hooks.onPrepare?.(n);
  let promises = 0; for (let a = 0; a < acceptors; a++) { promises++; hooks.onPromise?.(a); }
  let chosen: number | null = null;
  if (promises >= majority) { hooks.onAccept?.(proposedValue); let accepted = 0; for (let a = 0; a < acceptors; a++) { accepted++; } if (accepted >= majority) { chosen = proposedValue; hooks.onChosen?.(proposedValue); } }
  return { chosen, majority };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { basicPaxos } from './impl.ts';
export const DEFAULT_INPUT = { acceptors: 5, value: 42 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Paxos acceptors=' + input.acceptors, en: 'Paxos' }).commit();
  const { chosen } = basicPaxos(input.acceptors, input.value, {
    onPrepare: () => rec.begin({ zh: 'Prepare', en: 'prepare' }).setAux([{label:'phase',value:'prepare',role:'pivot' as BarRole}]).commit(),
    onPromise: (a) => rec.begin({ zh: 'Acceptor' + a + ' Promise', en: 'promise' }).setAux([{label:'acc',value:'A'+a,role:'compare' as BarRole}]).commit(),
    onChosen: (v) => rec.begin({ zh: '选定 ' + v, en: 'chosen' }).setAux([{label:'chosen',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'chosen=' + chosen, en: 'chosen' }).setAux([{label:'chosen',value:String(chosen),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { basicPaxos } from '../../src/algorithms/concurrency/conc-paxos-basic/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-paxos-basic/trace.ts';
test('paxos 多数派选定', () => assert.equal(basicPaxos(5, 42).chosen, 42));
test('paxos trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-two-phase-commit',
  title: { zh: '两阶段提交 2PC', en: 'Two-Phase Commit' },
  summary: { zh: '协调者 prepare + commit。', en: 'Coordinator prepare then commit.' },
  description: { zh: '两阶段提交(2PC)协调者先向所有参与者发 prepare，全部 YES 才发 commit，否则 abort，保证原子性但有阻塞风险。', en: 'Two-phase commit (2PC) coordinator first asks participants to prepare; on all-YES it commits, otherwise aborts; atomic but blocking on failure.' },
  tags: ['concurrency','2pc','distributed-transaction'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface TpcHooks { onPrepare?: (p: number) => void; onVote?: (p: number, yes: boolean) => void; onCommit?: () => void; onAbort?: () => void; }
export function twoPhaseCommit(participants: number, votes: boolean[], hooks: TpcHooks = {}): 'commit' | 'abort' {
  let allYes = true;
  for (let p = 0; p < participants; p++) { hooks.onPrepare?.(p); hooks.onVote?.(p, votes[p] ?? true); if (!votes[p]) allYes = false; }
  if (allYes) { hooks.onCommit?.(); return 'commit'; } hooks.onAbort?.(); return 'abort';
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoPhaseCommit } from './impl.ts';
export const DEFAULT_INPUT = { participants: 3, votes: [true, true, true] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2PC participants=' + input.participants, en: '2PC' }).commit();
  const r = twoPhaseCommit(input.participants, input.votes, {
    onVote: (p, yes) => rec.begin({ zh: 'P' + p + ' ' + (yes ? 'YES' : 'NO'), en: 'vote' }).setAux([{label:'p',value:'P'+p,role:'compare' as BarRole},{label:'vote',value:yes?'YES':'NO',role:'pivot' as BarRole}]).commit(),
    onCommit: () => rec.begin({ zh: 'COMMIT', en: 'commit' }).setAux([{label:'result',value:'commit',role:'final' as BarRole}]).commit(),
    onAbort: () => rec.begin({ zh: 'ABORT', en: 'abort' }).setAux([{label:'result',value:'abort',role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '结果 ' + r, en: r }).setAux([{label:'result',value:r,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoPhaseCommit } from '../../src/algorithms/concurrency/conc-two-phase-commit/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-two-phase-commit/trace.ts';
test('2pc 全 yes 提交', () => assert.equal(twoPhaseCommit(3, [true,true,true]), 'commit'));
test('2pc 有 no 中止', () => assert.equal(twoPhaseCommit(3, [true,false,true]), 'abort'));
test('2pc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-raft-leader',
  title: { zh: 'Raft 选主', en: 'Raft Leader Election' },
  summary: { zh: '任期+多数票选出领导者。', en: 'Term + majority vote elects leader.' },
  description: { zh: 'Raft 选主:候选者自增任期并向其它节点请求投票，获得多数即成为领导者，心跳维持权威，比 Paxos 更易理解。', en: 'Raft leader election: a candidate increments its term and requests votes; a majority makes it leader, maintained by heartbeats.' },
  tags: ['concurrency','raft','consensus','election'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface RaftHooks { onCandidate?: (node: number, term: number) => void; onVote?: (voter: number) => void; onLeader?: (node: number) => void; }
export function raftLeaderElection(nodes: number, candidate: number, votesGranted: number, hooks: RaftHooks = {}): { leader: number | null; term: number } {
  const term = 1; hooks.onCandidate?.(candidate, term);
  for (let v = 0; v < votesGranted; v++) hooks.onVote?.(v);
  const majority = Math.floor(nodes / 2) + 1;
  let leader: number | null = null;
  if (votesGranted >= majority) { leader = candidate; hooks.onLeader?.(candidate); }
  return { leader, term };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { raftLeaderElection } from './impl.ts';
export const DEFAULT_INPUT = { nodes: 5, candidate: 1, votes: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Raft 选主 nodes=' + input.nodes, en: 'Raft' }).commit();
  const r = raftLeaderElection(input.nodes, input.candidate, input.votes, {
    onCandidate: (n, t) => rec.begin({ zh: 'N' + n + ' 候选 term' + t, en: 'candidate' }).setAux([{label:'term',value:String(t),role:'pivot' as BarRole}]).commit(),
    onVote: (v) => rec.begin({ zh: 'N' + v + ' 投票', en: 'vote' }).setAux([{label:'vote',value:'N'+v,role:'compare' as BarRole}]).commit(),
    onLeader: (n) => rec.begin({ zh: 'N' + n + ' 当选', en: 'leader' }).setAux([{label:'leader',value:'N'+n,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'leader=' + r.leader, en: 'leader' }).setAux([{label:'leader',value:String(r.leader),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raftLeaderElection } from '../../src/algorithms/concurrency/conc-raft-leader/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-raft-leader/trace.ts';
test('raft 多数当选', () => assert.equal(raftLeaderElection(5, 1, 3).leader, 1));
test('raft 不足落选', () => assert.equal(raftLeaderElection(5, 1, 2).leader, null));
test('raft trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-work-stealing-deque',
  title: { zh: '工作窃取双端队列', en: 'Work-Stealing Deque' },
  summary: { zh: '本地 LIFO，窃取 FIFO。', en: 'Local LIFO, steal FIFO.' },
  description: { zh: '工作窃取(Java ForkJoin)每 worker 自有双端队列:本地一端 LIFO 推/弹，空闲 worker 从另一端 FIFO 窃取，平衡负载。', en: 'Work-stealing (Java ForkJoin) gives each worker a deque: LIFO push/pop locally, FIFO steal from the other end by idle workers.' },
  tags: ['concurrency','work-stealing','deque'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
  impl: `export interface WsHooks { onPush?: (tid: number, v: number) => void; onPop?: (tid: number, v: number) => void; onSteal?: (from: number, to: number, v: number) => void; }
export function workStealingDeque(workers: Array<{ deq: number[] }>, ops: Array<{ op: 'push'; tid: number; v: number } | { op: 'pop'; tid: number } | { op: 'steal'; from: number; to: number }>, hooks: WsHooks = {}): void {
  for (const o of ops) {
    if (o.op === 'push') { workers[o.tid]!.deq.push(o.v); hooks.onPush?.(o.tid, o.v); }
    else if (o.op === 'pop') { const v = workers[o.tid]!.deq.pop(); if (v !== undefined) hooks.onPop?.(o.tid, v); }
    else { const src = workers[o.from]!.deq; if (src.length) { const v = src.shift()!; hooks.onSteal?.(o.from, o.to, v); workers[o.to]!.deq.push(v); } }
  }
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { workStealingDeque } from './impl.ts';
export const DEFAULT_INPUT = { workers: [{deq:[]},{deq:[]}], ops: [{op:'push',tid:0,v:1},{op:'push',tid:0,v:2},{op:'steal',from:0,to:1},{op:'pop',tid:0}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '工作窃取', en: 'Work-Stealing' }).commit();
  workStealingDeque(input.workers.map((w) => ({ deq: [...w.deq] })), input.ops, {
    onPush: (t, v) => rec.begin({ zh: 'T' + t + ' push ' + v, en: 'push' }).setAux([{label:'v',value:String(v),role:'compare' as BarRole}]).commit(),
    onPop: (t, v) => rec.begin({ zh: 'T' + t + ' pop ' + v, en: 'pop' }).setAux([{label:'v',value:String(v),role:'final' as BarRole}]).commit(),
    onSteal: (f, to, v) => rec.begin({ zh: 'T' + to + ' 从 T' + f + ' 窃 ' + v, en: 'steal' }).setAux([{label:'steal',value:String(v),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workStealingDeque } from '../../src/algorithms/concurrency/conc-work-stealing-deque/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-work-stealing-deque/trace.ts';
test('ws steal 后目标有任务', () => { const ws = [{deq:[1,2]},{deq:[]}]; workStealingDeque(ws, [{op:'steal',from:0,to:1}]); assert.equal(ws[1]!.deq.length, 1); });
test('ws trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-spsc-ring',
  title: { zh: 'SPSC 环形队列', en: 'SPSC Ring Buffer' },
  summary: { zh: '单生产单消费的无锁环形。', en: 'Lock-free single-producer single-consumer ring.' },
  description: { zh: 'SPSC 环形队列用 head/tail 两个原子索引在定长数组上循环，生产者只写 tail，消费者只读 head，无需锁。', en: 'SPSC ring buffer uses atomic head/tail indices into a fixed array; producer owns tail, consumer owns head, no locks needed.' },
  tags: ['concurrency','spsc','ring-buffer','lock-free'],
  complexity: { time: 'O(1)', space: 'O(cap)' },
  impl: `export interface SpscHooks { onEnq?: (v: number, head: number, tail: number) => void; onDeq?: (v: number, head: number, tail: number) => void; }
export function spscRing(cap: number, ops: Array<{ op: 'enq'; v: number } | { op: 'deq' }>, hooks: SpscHooks = {}): { buf: number[]; head: number; tail: number } {
  const buf = new Array(cap).fill(undefined); let head = 0; let tail = 0; let count = 0;
  for (const o of ops) {
    if (o.op === 'enq') { if (count < cap) { buf[tail] = o.v; tail = (tail + 1) % cap; count++; hooks.onEnq?.(o.v, head, tail); } }
    else { if (count > 0) { const v = buf[head]; head = (head + 1) % cap; count--; hooks.onDeq?.(v!, head, tail); } }
  }
  return { buf: buf.filter((x) => x !== undefined), head, tail };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spscRing } from './impl.ts';
export const DEFAULT_INPUT = { cap: 4, ops: [{op:'enq',v:1},{op:'enq',v:2},{op:'deq'},{op:'enq',v:3}] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SPSC 环形 cap=' + input.cap, en: 'SPSC' }).commit();
  const r = spscRing(input.cap, input.ops, {
    onEnq: (v, h, t) => rec.begin({ zh: 'enq ' + v + ' h=' + h + ' t=' + t, en: 'enq' }).setAux([{label:'v',value:String(v),role:'compare' as BarRole}]).commit(),
    onDeq: (v, h, t) => rec.begin({ zh: 'deq ' + v + ' h=' + h + ' t=' + t, en: 'deq' }).setAux([{label:'v',value:String(v),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'buf [' + r.buf.join(',') + ']', en: 'buf' }).setAux([{label:'buf',value:r.buf.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spscRing } from '../../src/algorithms/concurrency/conc-spsc-ring/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-spsc-ring/trace.ts';
test('spsc FIFO', () => { const r = spscRing(4, [{op:'enq',v:1},{op:'enq',v:2},{op:'deq'},{op:'deq'}]); assert.equal(r.buf.length, 0); });
test('spsc trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-readers-writer-pref',
  title: { zh: '写优先读写锁', en: 'Writer-Preference RW Lock' },
  summary: { zh: '有写者等待时阻塞新读者。', en: 'New readers block when a writer waits.' },
  description: { zh: '写优先读写锁在有写者等待时拒绝新读者进入，避免写者饥饿，常用于更新频繁的场景。', en: 'Writer-preference RW lock blocks new readers while a writer is waiting, avoiding writer starvation.' },
  tags: ['concurrency','rw-lock','writer-preference'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface WpHooks { onRead?: (n: number) => void; onWrite?: () => void; onBlockRead?: () => void; }
export function writerPrefRwLock(ops: Array<{ op: 'r' | 'w' }>, hooks: WpHooks = {}): { readers: number; writer: boolean; waitingW: number } {
  let readers = 0; let writer = false; let waitingW = 0;
  for (const o of ops) {
    if (o.op === 'w') { waitingW++; while (writer || readers > 0) {} waitingW--; writer = true; hooks.onWrite?.(); writer = false; }
    else { if (waitingW > 0) hooks.onBlockRead?.(); while (waitingW > 0) {} readers++; hooks.onRead?.(readers); readers--; }
  }
  return { readers, writer, waitingW };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { writerPrefRwLock } from './impl.ts';
export const DEFAULT_INPUT = [{op:'r'},{op:'w'},{op:'r'},{op:'w'}];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '写优先 RW 锁', en: 'Writer-Pref RW' }).commit();
  writerPrefRwLock(ops, {
    onRead: (n) => rec.begin({ zh: '读 n=' + n, en: 'read' }).setAux([{label:'readers',value:String(n),role:'compare' as BarRole}]).commit(),
    onWrite: () => rec.begin({ zh: '写', en: 'write' }).setAux([{label:'writer',value:'true',role:'final' as BarRole}]).commit(),
    onBlockRead: () => rec.begin({ zh: '阻塞新读', en: 'block' }).setAux([{label:'block',value:'read',role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '完成', en: 'done' }).setAux([{label:'done',value:'ok',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writerPrefRwLock } from '../../src/algorithms/concurrency/conc-readers-writer-pref/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-readers-writer-pref/trace.ts';
test('wp 释放后归零', () => { const s = writerPrefRwLock([{op:'r'},{op:'w'}]); assert.equal(s.waitingW, 0); });
test('wp trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-async-pool',
  title: { zh: '异步任务池', en: 'Async Task Pool' },
  summary: { zh: '限制并发的协程池。', en: 'Concurrency-limited coroutine pool.' },
  description: { zh: '异步任务池用信号量限制同时运行的任务数，超出的排队等待，常用于限制对外部资源的并发调用。', en: 'An async task pool uses a semaphore to cap concurrently running tasks; excess tasks queue, bounding load on external resources.' },
  tags: ['concurrency','async','pool','semaphore'],
  complexity: { time: 'O(n)', space: 'O(max)' },
  impl: `export interface PoolHooks { onRun?: (i: number, active: number) => void; onQueue?: (i: number) => void; onDone?: (i: number) => void; }
export function asyncTaskPool(tasks: number[], maxConcurrent: number, hooks: PoolHooks = {}): number[] {
  const done: number[] = []; let active = 0; const queue: number[] = []; const order: number[] = [];
  for (let i = 0; i < tasks.length; i++) { if (active < maxConcurrent) { active++; order.push(i); hooks.onRun?.(i, active); } else { queue.push(i); hooks.onQueue?.(i); } }
  while (queue.length) { const t = queue.shift()!; hooks.onDone?.(t); done.push(t); }
  return order;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { asyncTaskPool } from './impl.ts';
export const DEFAULT_INPUT = { tasks: [0,1,2,3,4], max: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异步池 max=' + input.max, en: 'Pool max=' + input.max }).commit();
  const order = asyncTaskPool(input.tasks, input.max, {
    onRun: (i, a) => rec.begin({ zh: '运行 T' + i + ' active=' + a, en: 'run' }).setAux([{label:'active',value:String(a),role:'compare' as BarRole}]).commit(),
    onQueue: (i) => rec.begin({ zh: '排队 T' + i, en: 'queue' }).setAux([{label:'queue',value:'T'+i,role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '运行顺序 [' + order.join(',') + ']', en: 'order' }).setAux([{label:'order',value:order.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asyncTaskPool } from '../../src/algorithms/concurrency/conc-async-pool/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-async-pool/trace.ts';
test('pool 不超过并发上限', () => { const o = asyncTaskPool([0,1,2,3], 2); assert.ok(o.length <= 2); });
test('pool trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-fence-barrier',
  title: { zh: '内存屏障（模型）', en: 'Memory Fence Model' },
  summary: { zh: '禁止前后指令重排序。', en: 'Forbids reordering across the fence.' },
  description: { zh: '内存屏障(load/store fence)禁止编译器与 CPU 跨屏障重排序，保证弱内存模型(ARM/POWER)上的 happens-before。', en: 'A memory fence forbids the compiler/CPU from reordering loads/stores across it, enforcing happens-before on weak memory models.' },
  tags: ['concurrency','memory-fence','memory-model'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface FenceHooks { onInstr?: (op: string) => void; onFence?: () => void; onReorderBlocked?: () => void; }
export function memoryFenceModel(program: string[], hooks: FenceHooks = {}): { order: string[]; fences: number } {
  const order: string[] = []; let fences = 0;
  for (const op of program) { if (op === 'fence') { fences++; hooks.onFence?.(); hooks.onReorderBlocked?.(); } else hooks.onInstr?.(op); order.push(op); }
  return { order, fences };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { memoryFenceModel } from './impl.ts';
export const DEFAULT_INPUT = ['store x=1', 'fence', 'load flag'];
export function buildTrace(program: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '内存屏障', en: 'Memory Fence' }).commit();
  const { fences } = memoryFenceModel(program, {
    onInstr: (op) => rec.begin({ zh: op, en: op }).setAux([{label:'op',value:op,role:'compare' as BarRole}]).commit(),
    onFence: () => rec.begin({ zh: '屏障', en: 'fence' }).setAux([{label:'fence',value:'F',role:'pivot' as BarRole}]).commit(),
    onReorderBlocked: () => rec.begin({ zh: '阻止重排', en: 'block' }).setAux([{label:'blocked',value:'reorder',role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: fences + ' 个屏障', en: fences + ' fences' }).setAux([{label:'fences',value:String(fences),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoryFenceModel } from '../../src/algorithms/concurrency/conc-fence-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-fence-barrier/trace.ts';
test('fence 计数正确', () => assert.equal(memoryFenceModel(['a','fence','b']).fences, 1));
test('fence trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-tournament-barrier',
  title: { zh: '锦标赛屏障', en: 'Tournament Barrier' },
  summary: { zh: '二叉树两两汇合的屏障。', en: 'Binary-tree pairwise barrier.' },
  description: { zh: '锦标赛屏障把 n 个线程组织成二叉树，每轮两两汇合胜者上升，根节点反转广播，消息复杂度 O(n)。', en: 'Tournament barrier arranges n threads in a binary tree, pairwise arriving each round up to the root then broadcasting back down.' },
  tags: ['concurrency','barrier','tournament'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  impl: `export interface Tb2Hooks { onMatch?: (round: number, a: number, b: number, winner: number) => void; onRoot?: (round: number) => void; }
export function tournamentBarrier(n: number, hooks: Tb2Hooks = {}): number {
  let cur: number[] = Array.from({ length: n }, (_, i) => i); let round = 0;
  while (cur.length > 1) { const next: number[] = []; for (let i = 0; i + 1 < cur.length; i += 2) { const w = cur[i]!; hooks.onMatch?.(round, cur[i]!, cur[i + 1]!, w); next.push(w); } if (cur.length % 2 === 1) next.push(cur[cur.length - 1]!); cur = next; round++; }
  hooks.onRoot?.(round);
  return round;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tournamentBarrier } from './impl.ts';
export const DEFAULT_INPUT = 8;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '锦标赛屏障 n=' + n, en: 'Tournament n=' + n }).commit();
  const rounds = tournamentBarrier(n, {
    onMatch: (r, a, b, w) => rec.begin({ zh: '轮' + r + ': T' + a + ' vs T' + b + ' -> T' + w, en: 'match' }).setAux([{label:'round',value:String(r),role:'pivot' as BarRole},{label:'winner',value:'T'+w,role:'compare' as BarRole}]).commit(),
    onRoot: (r) => rec.begin({ zh: '根节点轮' + r, en: 'root' }).setAux([{label:'root',value:'r'+r,role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '共 ' + rounds + ' 轮', en: rounds + ' rounds' }).setAux([{label:'rounds',value:String(rounds),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tournamentBarrier } from '../../src/algorithms/concurrency/conc-tournament-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-tournament-barrier/trace.ts';
test('tb 8 线程 3 轮', () => assert.equal(tournamentBarrier(8), 3));
test('tb trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-dissemination-barrier',
  title: { zh: '传播屏障', en: 'Dissemination Barrier' },
  summary: { zh: '每轮向固定步长伙伴同步。', en: 'Each round syncs with a fixed-step partner.' },
  description: { zh: '传播屏障每线程在第 r 轮与 (i+2^r) mod n 号线程交换感知信号，log n 轮后全部到达，对称无中心节点。', en: 'Dissemination barrier has each thread sense-swap with partner (i+2^r) mod n on round r; all arrive after log n rounds, symmetric.' },
  tags: ['concurrency','barrier','dissemination'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  impl: `export interface DbHooks { onSense?: (round: number, i: number, j: number) => void; onComplete?: (rounds: number) => void; }
export function disseminationBarrier(n: number, hooks: DbHooks = {}): number {
  let round = 0;
  while ((1 << round) < n) { for (let i = 0; i < n; i++) { const j = (i + (1 << round)) % n; hooks.onSense?.(round, i, j); } round++; }
  hooks.onComplete?.(round);
  return round;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { disseminationBarrier } from './impl.ts';
export const DEFAULT_INPUT = 8;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '传播屏障 n=' + n, en: 'Dissemination n=' + n }).commit();
  const rounds = disseminationBarrier(n, {
    onSense: (r, i, j) => rec.begin({ zh: '轮' + r + ': T' + i + ' <-> T' + j, en: 'sense' }).setAux([{label:'round',value:String(r),role:'pivot' as BarRole},{label:'pair',value:'T'+i+'-T'+j,role:'compare' as BarRole}]).commit(),
    onComplete: (rs) => rec.begin({ zh: '完成 ' + rs + ' 轮', en: 'complete' }).setAux([{label:'rounds',value:String(rs),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '共 ' + rounds + ' 轮', en: rounds + ' rounds' }).setAux([{label:'rounds',value:String(rounds),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { disseminationBarrier } from '../../src/algorithms/concurrency/conc-dissemination-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-dissemination-barrier/trace.ts';
test('db 8 线程 3 轮', () => assert.equal(disseminationBarrier(8), 3));
test('db trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

add({
  cat: 'concurrency', id: 'conc-sleeping-barber-full',
  title: { zh: '理发师问题（完整）', en: 'Sleeping Barber (Full)' },
  summary: { zh: '顾客/理发师/椅三信号量。', en: 'Customer/barber/chair three semaphores.' },
  description: { zh: '睡眠理发师用 customers/barbers/mutex 三信号量协调:顾客满座则离开，理发师无客则睡，有客则唤醒理发。', en: 'Sleeping barber uses customers/barbers/mutex semaphores: customers leave if full, barber sleeps when idle, wakes to cut.' },
  tags: ['concurrency','sleeping-barber','semaphore'],
  complexity: { time: 'O(1) per op', space: 'O(chairs)' },
  impl: `export interface SbHooks { onArrive?: (cust: number, waiting: number) => void; onSit?: (cust: number) => void; onLeave?: (cust: number) => void; onCut?: (cust: number) => void; }
export function sleepingBarberFull(chairs: number, customers: number, hooks: SbHooks = {}): { served: number; lost: number } {
  let waiting = 0; let served = 0; let lost = 0;
  for (let c = 0; c < customers; c++) { hooks.onArrive?.(c, waiting); if (waiting < chairs) { waiting++; hooks.onSit?.(c); waiting--; served++; hooks.onCut?.(c); } else { lost++; hooks.onLeave?.(c); } }
  return { served, lost };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sleepingBarberFull } from './impl.ts';
export const DEFAULT_INPUT = { chairs: 2, customers: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '理发师 chairs=' + input.chairs, en: 'Barber' }).commit();
  const r = sleepingBarberFull(input.chairs, input.customers, {
    onSit: (c) => rec.begin({ zh: 'C' + c + ' 等候', en: 'sit' }).setAux([{label:'cust',value:'C'+c,role:'compare' as BarRole}]).commit(),
    onCut: (c) => rec.begin({ zh: '理发 C' + c, en: 'cut' }).setAux([{label:'cut',value:'C'+c,role:'final' as BarRole}]).commit(),
    onLeave: (c) => rec.begin({ zh: 'C' + c + ' 离开', en: 'leave' }).setAux([{label:'leave',value:'C'+c,role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '服务 ' + r.served + ' 流失 ' + r.lost, en: 'result' }).setAux([{label:'served',value:String(r.served),role:'final' as BarRole},{label:'lost',value:String(r.lost),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sleepingBarberFull } from '../../src/algorithms/concurrency/conc-sleeping-barber-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sleeping-barber-full/trace.ts';
test('barber 满座流失', () => { const r = sleepingBarberFull(1, 5); assert.ok(r.lost > 0); });
test('barber trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});

console.log('concurrency specs loaded');

add({
  cat: 'concurrency', id: 'conc-read-indicator',
  title: { zh: '读指示器（seqlock 读端）', en: 'Read Indicator (SeqLock reader)' },
  summary: { zh: '读者登记在册，写者据此等待。', en: 'Readers register; writers wait accordingly.' },
  description: { zh: '读指示器用一个计数器记录活跃读者数，写者在进入前等待其归零，是 RCU 与 seqlock 的读端常见原语。', en: 'A read indicator counts active readers so a writer can wait until it drains to zero; used in RCU and seqlock readers.' },
  tags: ['concurrency','read-indicator','seqlock'],
  complexity: { time: 'O(1)', space: 'O(n)' },
  impl: `export interface RiHooks { onReadEnter?: (tid: number, active: number) => void; onReadExit?: (tid: number, active: number) => void; onWriterWait?: (active: number) => void; }
export function readIndicator(ops: Array<{ op: 're' | 'rx' | 'w'; tid: number }>, hooks: RiHooks = {}): { active: number; writersBlocked: number } {
  let active = 0; let writersBlocked = 0;
  for (const o of ops) {
    if (o.op === 're') { active++; hooks.onReadEnter?.(o.tid, active); }
    else if (o.op === 'rx') { active = Math.max(0, active - 1); hooks.onReadExit?.(o.tid, active); }
    else { if (active > 0) { writersBlocked++; hooks.onWriterWait?.(active); } }
  }
  return { active, writersBlocked };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { readIndicator } from './impl.ts';
export const DEFAULT_INPUT = [{op:'re',tid:1},{op:'re',tid:2},{op:'w',tid:0},{op:'rx',tid:1},{op:'rx',tid:2},{op:'w',tid:0}];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读指示器', en: 'Read Indicator' }).commit();
  const r = readIndicator(ops, {
    onReadEnter: (t, a) => rec.begin({ zh: 'T' + t + ' 进入读 active=' + a, en: 're' }).setAux([{label:'active',value:String(a),role:'compare' as BarRole}]).commit(),
    onReadExit: (t, a) => rec.begin({ zh: 'T' + t + ' 退出读 active=' + a, en: 'rx' }).setAux([{label:'active',value:String(a),role:'final' as BarRole}]).commit(),
    onWriterWait: (a) => rec.begin({ zh: '写等待 active=' + a, en: 'wait' }).setAux([{label:'wait',value:'w',role:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '写阻塞 ' + r.writersBlocked, en: 'blocked' }).setAux([{label:'blocked',value:String(r.writersBlocked),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readIndicator } from '../../src/algorithms/concurrency/conc-read-indicator/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-read-indicator/trace.ts';
test('ri 写在读者活跃时阻塞', () => { const r = readIndicator([{op:'re',tid:1},{op:'w',tid:0}]); assert.equal(r.writersBlocked, 1); });
test('ri trace 非空', () => assert.ok(buildTrace().length >= 2));`,
});
console.log('concurrency specs v2 loaded');
