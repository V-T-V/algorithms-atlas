// =============================================================================
// 互斥锁 · 录制帧序列
// 用 setBars 展示各线程状态（柱高=状态码），setAux 展示锁标志与等待队列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateMutex, type MutexEvent, type MutexHooks, type MutexThreadState } from './impl.ts';

export const DEFAULT_N_THREADS = 3;

export function defaultEvents(): MutexEvent[] {
  return [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'critical' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'critical' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'critical' },
    { thread: 2, action: 'unlock' },
  ];
}

interface TraceOptions {
  nThreads: number;
  events: MutexEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  const states: MutexThreadState[] = new Array(nThreads).fill('idle');
  let flag = 0;
  let holder = -1;
  let queue: number[] = [];

  const stateVal = (s: MutexThreadState): number =>
    s === 'critical' ? 3 : s === 'waiting' ? 2 : 1;
  const stateRole = (s: MutexThreadState): BarRole =>
    s === 'critical' ? 'final' : s === 'waiting' ? 'warn' : 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: stateVal(states[i]!),
      role: i === holder ? ('final' as BarRole) : stateRole(states[i]!),
      label: `T${i} ${states[i]}`,
    }));
    const aux = [
      ...Array.from({ length: nThreads }, (_, i) => ({
        label: `T${i}`,
        value: states[i]!,
        role: (i === holder ? 'final' : stateRole(states[i]!)) as BarRole,
      })),
      {
        label: '锁标志',
        value: flag === 1 ? '占用' : '空闲',
        role: (flag === 1 ? 'final' : 'default') as BarRole,
      },
      {
        label: '持有者',
        value: holder === -1 ? '无' : `T${holder}`,
        role: (holder === -1 ? 'default' : 'final') as BarRole,
      },
      {
        label: '等待队列',
        value: queue.length ? queue.map((t) => `T${t}`).join(' → ') : '∅',
        role: 'warn' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始化：${nThreads} 个线程，锁空闲`,
    en: `Init: ${nThreads} threads, lock free`,
  });

  const hooks: MutexHooks = {
    onTestAndSet: (_thread, oldFlag, success) => {
      flag = success ? 1 : oldFlag;
    },
    onBlock: (_thread, _q) => {
      // 队列由外部跟踪
    },
    onEnter: (thread) => {
      states[thread] = 'critical';
      holder = thread;
      flag = 1;
    },
    onRelease: (thread) => {
      states[thread] = 'idle';
      if (holder === thread) holder = -1;
      flag = 0;
    },
    onWake: (_releaser, woken) => {
      states[woken] = 'critical';
      holder = woken;
      flag = 1;
    },
  };

  for (const ev of events) {
    // 在模拟前从 hooks 无法拿到队列快照，故每次模拟单事件后用 simulateMutex 末步推导
    const prevStates = [...states];
    const prevHolder = holder;
    const prevFlag = flag;
    const steps = simulateMutex(nThreads, [ev], hooks);
    const last = steps[steps.length - 1];
    if (last) {
      for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
      holder = last.holder;
      flag = last.flag;
      // 推算等待队列：waiting 状态的线程
      queue = states.map((s, i) => (s === 'waiting' ? i : -1)).filter((i) => i >= 0);
    } else {
      states.splice(0, nThreads, ...prevStates);
      holder = prevHolder;
      flag = prevFlag;
    }
    const actionZh =
      ev.action === 'lock'
        ? `T${ev.thread} 请求锁`
        : ev.action === 'critical'
          ? `T${ev.thread} 在临界区`
          : `T${ev.thread} 释放锁`;
    const actionEn =
      ev.action === 'lock'
        ? `T${ev.thread} requests lock`
        : ev.action === 'critical'
          ? `T${ev.thread} in critical section`
          : `T${ev.thread} releases lock`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: `完成：全程至多一个线程在临界区（互斥）`,
      en: `Done: at most one thread in critical section (mutual exclusion)`,
    })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i} idle`,
      })),
    )
    .setAux([
      { label: '锁标志', value: '空闲', role: 'final' as BarRole },
      { label: '持有者', value: '无', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
