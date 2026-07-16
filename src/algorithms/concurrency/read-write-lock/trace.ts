// =============================================================================
// 读写锁 · 录制帧序列
// 用 setBars 展示各线程状态，setAux 展示活跃读者数/写者/等待队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  simulateReadWriteLock,
  type RwLockEvent,
  type RwLockHooks,
  type RwThreadState,
} from './impl.ts';

export const DEFAULT_N_THREADS = 4;

export function defaultEvents(): RwLockEvent[] {
  return [
    { thread: 0, action: 'readLock' },
    { thread: 1, action: 'readLock' }, // 并发读
    { thread: 2, action: 'writeLock' }, // 阻塞（有读者）
    { thread: 3, action: 'readLock' }, // 并发读（读者优先，即使有写等待）
    { thread: 0, action: 'readUnlock' },
    { thread: 1, action: 'readUnlock' },
    { thread: 3, action: 'readUnlock' }, // 读者全离开，写者进入
    { thread: 2, action: 'writeUnlock' },
  ];
}

interface TraceOptions {
  nThreads: number;
  events: RwLockEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  const stateVal = (s: RwThreadState): number =>
    s === 'writing'
      ? 4
      : s === 'reading'
        ? 3
        : s === 'waiting-write'
          ? 2
          : s === 'waiting-read'
            ? 2
            : 1;
  const stateRole = (s: RwThreadState): BarRole =>
    s === 'writing'
      ? 'final'
      : s === 'reading'
        ? 'frontier'
        : s === 'waiting-write' || s === 'waiting-read'
          ? 'warn'
          : 'default';

  let activeReaders = 0;
  let writerHolder = -1;
  const states: RwThreadState[] = new Array(nThreads).fill('idle');

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: stateVal(states[i]!),
      role: stateRole(states[i]!),
      label: `T${i} ${states[i]}`,
    }));
    const readWaiters = states.map((s, i) => (s === 'waiting-read' ? i : -1)).filter((i) => i >= 0);
    const writeWaiters = states
      .map((s, i) => (s === 'waiting-write' ? i : -1))
      .filter((i) => i >= 0);
    const aux = [
      { label: '活跃读者', value: String(activeReaders), role: 'frontier' as BarRole },
      {
        label: '写者',
        value: writerHolder === -1 ? '无' : `T${writerHolder}`,
        role: (writerHolder === -1 ? 'default' : 'final') as BarRole,
      },
      {
        label: '读等待',
        value: readWaiters.length ? readWaiters.map((t) => `T${t}`).join(',') : '∅',
        role: 'warn' as BarRole,
      },
      {
        label: '写等待',
        value: writeWaiters.length ? writeWaiters.map((t) => `T${t}`).join(',') : '∅',
        role: 'warn' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({ zh: `初始化：${nThreads} 个线程`, en: `Init: ${nThreads} threads` });

  const hooks: RwLockHooks = {};

  for (const ev of events) {
    const steps = simulateReadWriteLock(nThreads, [ev], hooks);
    const last = steps[steps.length - 1];
    if (last) {
      activeReaders = last.activeReaders;
      writerHolder = last.writerHolder;
      for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
    }
    const actionZh = `${ev.action} T${ev.thread}`;
    const actionEn = `${ev.action} T${ev.thread}`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i} idle`,
      })),
    )
    .setAux([
      { label: '活跃读者', value: '0', role: 'final' as BarRole },
      { label: '写者', value: '无', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
