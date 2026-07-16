// =============================================================================
// 屏障 · 录制帧序列
// 用 setAux 展示已到达数/总数/代；用 setBars 展示各线程到达进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBarrier, type BarrierEvent, type BarrierHooks } from './impl.ts';

export const DEFAULT_PARTIES = 4;

/** 默认到达序列：演示两轮循环放行。 */
export function defaultEvents(): BarrierEvent[] {
  return [
    { threadId: 0 },
    { threadId: 1 },
    { threadId: 2 },
    { threadId: 3 }, // 第 1 代放行
    { threadId: 0 },
    { threadId: 1 },
    { threadId: 2 },
    { threadId: 3 }, // 第 2 代放行
  ];
}

interface TraceOptions {
  parties: number;
  events: BarrierEvent[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const parties = opts.parties ?? DEFAULT_PARTIES;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  let arrived = 0;
  let generation = 0;
  // 每个线程在本代是否已到达
  const arrivedFlags = new Map<number, boolean>();
  let highlight: BarRole = 'default';

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux = [
      { label: '已到达', value: `${arrived} / ${parties}`, role: 'final' as BarRole },
      { label: '当前代', value: `gen ${generation}`, role: 'frontier' as BarRole },
      {
        label: '状态',
        value: arrived >= parties ? '放行！' : '等待中',
        role: (arrived >= parties ? 'final' : 'warn') as BarRole,
      },
    ];
    // bars：用每个线程是否到达（0/1）+ 已到达总数作为可视化
    const bars = Array.from({ length: parties }, (_, i) => ({
      value: arrivedFlags.get(i) ? 1 : 0,
      role: (arrivedFlags.get(i)
        ? highlight === 'final'
          ? 'final'
          : 'swap'
        : 'default') as BarRole,
      label: `T${i}`,
    }));
    rec.begin(note).setAux(aux).setBars(bars).commit();
    highlight = 'default';
  };

  snapshot({
    zh: `初始化屏障：需要 ${parties} 个线程到达后放行`,
    en: `Init barrier: release after ${parties} arrivals`,
  });

  const hooks: BarrierHooks = {
    onArrive: (tid, a) => {
      arrived = a;
      arrivedFlags.set(tid, true);
      highlight = 'swap';
    },
    onRelease: () => {
      highlight = 'final';
    },
    onReset: (g) => {
      generation = g;
      arrivedFlags.clear();
    },
  };

  for (const ev of events) {
    snapshot({
      zh: `→ T${ev.threadId} 到达`,
      en: `→ T${ev.threadId} arrives`,
    });
    simulateBarrier(parties, [ev], hooks);
    if (arrived === 0 && generation > 0 && hooks) {
      // 刚放行
      snapshot({
        zh: `第 ${generation - 1} 代放行！屏障重置，进入第 ${generation} 代`,
        en: `Generation ${generation - 1} released! Barrier reset, entering gen ${generation}`,
      });
    } else {
      snapshot({
        zh: `已到达 ${arrived} / ${parties}，等待其余线程`,
        en: `Arrived ${arrived} / ${parties}, waiting for others`,
      });
    }
  }

  // 终态
  rec
    .begin({
      zh: `模拟结束：共完成 ${generation} 代放行`,
      en: `Done: ${generation} generation(s) released`,
    })
    .setAux([
      { label: '已到达', value: `${arrived} / ${parties}`, role: 'final' as BarRole },
      { label: '总放行代数', value: String(generation), role: 'final' as BarRole },
      { label: '所需线程数', value: String(parties), role: 'default' as BarRole },
    ])
    .setBars(
      Array.from({ length: parties }, (_, i) => ({
        value: 0,
        role: 'final' as BarRole,
        label: `T${i}`,
      })),
    )
    .commit();

  return rec.build();
}
