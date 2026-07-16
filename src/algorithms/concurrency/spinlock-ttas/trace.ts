// =============================================================================
// TTAS 自旋锁 · 录制帧序列
// 用 setBars 展示各线程状态，setAux 展示锁标志/持有者/读次数/TAS次数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateTtas, type TtasEvent, type TtasHooks, type TtasThreadState } from './impl.ts';

export const DEFAULT_N_THREADS = 3;

export function defaultEvents(): TtasEvent[] {
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
  events: TtasEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  const stateVal = (s: TtasThreadState): number =>
    s === 'critical' ? 3 : s === 'spinning' ? 2 : 1;
  const stateRole = (s: TtasThreadState): BarRole =>
    s === 'critical' ? 'final' : s === 'spinning' ? 'warn' : 'default';

  let flag = 0;
  let holder = -1;
  const states: TtasThreadState[] = new Array(nThreads).fill('idle');
  let reads = 0;
  let tas = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: stateVal(states[i]!),
      role: i === holder ? ('final' as BarRole) : stateRole(states[i]!),
      label: `T${i} ${states[i]}`,
    }));
    const aux = [
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
      { label: '普通读次数', value: String(reads), role: 'frontier' as BarRole },
      { label: 'TAS 次数', value: String(tas), role: 'pivot' as BarRole },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始化：${nThreads} 个线程，锁空闲`,
    en: `Init: ${nThreads} threads, lock free`,
  });

  const hooks: TtasHooks = {
    onRead: () => reads++,
    onTestAndSet: () => tas++,
  };

  for (const ev of events) {
    const steps = simulateTtas(nThreads, [ev], hooks);
    const last = steps[steps.length - 1];
    if (last) {
      flag = last.flag;
      holder = last.holder;
      for (let i = 0; i < nThreads; i++) states[i] = last.states[i]!;
      reads = last.stats.reads;
      tas = last.stats.testAndSets;
    }
    const actionZh =
      ev.action === 'lock'
        ? `T${ev.thread} TTAS lock（读=${reads}, TAS=${tas}）`
        : ev.action === 'critical'
          ? `T${ev.thread} 临界区`
          : `T${ev.thread} unlock`;
    const actionEn =
      ev.action === 'lock'
        ? `T${ev.thread} TTAS lock (reads=${reads}, TAS=${tas})`
        : ev.action === 'critical'
          ? `T${ev.thread} in critical section`
          : `T${ev.thread} unlock`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: `完成：读 ${reads} 次，TAS ${tas} 次（读远多于 TAS，省总线）`,
      en: `Done: ${reads} reads, ${tas} TAS ops (reads >> TAS, saving bus)`,
    })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i} idle`,
      })),
    )
    .setAux([
      { label: '普通读次数', value: String(reads), role: 'final' as BarRole },
      { label: 'TAS 次数', value: String(tas), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
