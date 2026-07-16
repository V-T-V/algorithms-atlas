// =============================================================================
// 管程（条件变量）· 录制帧序列
// 用 setAux 展示锁持有者、各条件变量等待队列、各线程阶段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateMonitor, type MonitorHooks, type MonitorStep } from './impl.ts';

/** 默认演示：有界缓冲，2 个条件变量 notFull / notEmpty。 */
export function defaultSteps(): { nThread: number; steps: MonitorStep[] } {
  return {
    nThread: 3,
    steps: [
      { thread: 0, action: 'enter' }, // P0 进入管程
      { thread: 0, action: 'wait', cond: 'notFull' }, // P0 等待 notFull
      { thread: 1, action: 'enter' }, // C0 进入
      { thread: 1, action: 'signal', cond: 'notFull' }, // 唤醒 P0
      { thread: 1, action: 'exit' },
      { thread: 2, action: 'enter' },
      { thread: 2, action: 'wait', cond: 'notEmpty' },
      { thread: 1, action: 'enter' },
      { thread: 1, action: 'broadcast', cond: 'notEmpty' },
      { thread: 1, action: 'exit' },
      { thread: 0, action: 'exit' },
    ],
  };
}

interface TraceOptions {
  nThread: number;
  steps: MonitorStep[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultSteps();
  const nThread = opts.nThread ?? def.nThread;
  const steps = opts.steps ?? def.steps;
  const rec = new TraceRecorder();

  let lockHolder = -1;
  const queues: Record<string, number[]> = { notFull: [], notEmpty: [] };
  const phase = new Array<string>(nThread).fill('idle');

  const phaseRole = (p: string): BarRole =>
    p === 'inside' ? 'final' : p.startsWith('wait') ? 'warn' : p === 'woken' ? 'swap' : 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        {
          label: '锁持有者',
          value: lockHolder === -1 ? '空闲' : `T${lockHolder}`,
          role: (lockHolder === -1 ? 'default' : 'final') as BarRole,
        },
        {
          label: 'notFull 等待队列',
          value:
            queues.notFull && queues.notFull.length > 0
              ? queues.notFull.map((t) => `T${t}`).join(',')
              : '空',
          role: (queues.notFull && queues.notFull.length > 0 ? 'warn' : 'default') as BarRole,
        },
        {
          label: 'notEmpty 等待队列',
          value:
            queues.notEmpty && queues.notEmpty.length > 0
              ? queues.notEmpty.map((t) => `T${t}`).join(',')
              : '空',
          role: (queues.notEmpty && queues.notEmpty.length > 0 ? 'warn' : 'default') as BarRole,
        },
        ...phase.map((p, i) => ({
          label: `T${i} 阶段`,
          value: p,
          role: phaseRole(p),
        })),
      ])
      .setBars(
        phase.map((p, i) => ({
          value: p === 'inside' ? 2 : p === 'woken' ? 1 : p.startsWith('wait') ? 0 : 0,
          role: phaseRole(p),
          label: `T${i}:${p}`,
        })),
      )
      .commit();
  };

  snapshot({ zh: `初始化：锁空闲，无等待者`, en: `Init: lock free, no waiters` });

  const hooks: MonitorHooks = {
    onEnter: (t) => {
      lockHolder = t;
      phase[t] = 'inside';
    },
    onExit: (t) => {
      if (lockHolder === t) lockHolder = -1;
      phase[t] = 'idle';
    },
    onWait: (t, cond, q) => {
      queues[cond] = [...q];
      if (lockHolder === t) lockHolder = -1;
      phase[t] = `wait:${cond}`;
    },
    onSignal: (_t, cond, woken, q) => {
      queues[cond] = [...q];
      if (woken !== null) phase[woken] = 'woken';
    },
    onBroadcast: (_t, cond, woken, q) => {
      queues[cond] = [...q];
      for (const w of woken) phase[w] = 'woken';
    },
  };

  for (const step of steps) {
    simulateMonitor(nThread, [step], hooks);
    const actionZh =
      step.action === 'enter'
        ? `T${step.thread} 进入管程`
        : step.action === 'exit'
          ? `T${step.thread} 离开管程`
          : step.action === 'wait'
            ? `T${step.thread} wait(${step.cond})`
            : step.action === 'signal'
              ? `T${step.thread} signal(${step.cond})`
              : `T${step.thread} broadcast(${step.cond})`;
    const actionEn =
      step.action === 'enter'
        ? `T${step.thread} enters monitor`
        : step.action === 'exit'
          ? `T${step.thread} exits monitor`
          : step.action === 'wait'
            ? `T${step.thread} wait(${step.cond})`
            : step.action === 'signal'
              ? `T${step.thread} signal(${step.cond})`
              : `T${step.thread} broadcast(${step.cond})`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  rec
    .begin({ zh: '完成：管程操作序列结束', en: 'Done: monitor operation sequence finished' })
    .setAux([
      {
        label: '锁持有者',
        value: lockHolder === -1 ? '空闲' : `T${lockHolder}`,
        role: 'final' as BarRole,
      },
      {
        label: 'notFull 等待队列',
        value:
          queues.notFull && queues.notFull.length > 0
            ? queues.notFull.map((t) => `T${t}`).join(',')
            : '空',
        role: 'final' as BarRole,
      },
      {
        label: 'notEmpty 等待队列',
        value:
          queues.notEmpty && queues.notEmpty.length > 0
            ? queues.notEmpty.map((t) => `T${t}`).join(',')
            : '空',
        role: 'final' as BarRole,
      },
    ])
    .setBars(phase.map((_p, i) => ({ value: 0, role: 'final' as BarRole, label: `T${i}:done` })))
    .commit();

  return rec.build();
}
