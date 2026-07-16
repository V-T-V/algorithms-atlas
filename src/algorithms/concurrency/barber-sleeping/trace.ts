// =============================================================================
// 睡眠理发师 · 录制帧序列
// 用 setBars 展示等待椅占用情况，setAux 展示理发师状态/服务统计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateBarber, type BarberCustomer, type BarberHooks, type BarberState } from './impl.ts';

export const DEFAULT_INPUT = {
  customers: [
    { id: 1, arrival: 0, serviceTime: 5 },
    { id: 2, arrival: 2, serviceTime: 3 },
    { id: 3, arrival: 3, serviceTime: 4 },
    { id: 4, arrival: 4, serviceTime: 2 },
  ] as BarberCustomer[],
  chairs: 2,
};

interface TraceOptions {
  customers: BarberCustomer[];
  chairs: number;
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const customers = opts.customers ?? DEFAULT_INPUT.customers;
  const chairs = opts.chairs ?? DEFAULT_INPUT.chairs;
  const rec = new TraceRecorder();

  let state: BarberState = 'sleeping';
  let queueSize = 0;
  let served = 0;
  let lost = 0;
  let currentId = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    // bars：等待椅占用（chairs 把椅子，每把 0/1）+ 1 把理发椅
    const bars = Array.from({ length: chairs + 1 }, (_, i) => {
      if (i === 0) {
        // 理发椅
        return {
          value: currentId >= 0 ? currentId : 0,
          role: (currentId >= 0 ? 'final' : 'default') as BarRole,
          label: currentId >= 0 ? `理发椅:C${currentId}` : '理发椅:空',
        };
      }
      const occupied = i <= queueSize;
      return {
        value: occupied ? 1 : 0,
        role: (occupied ? 'compare' : 'default') as BarRole,
        label: `椅${i}:${occupied ? '占' : '空'}`,
      };
    });
    const aux = [
      {
        label: '理发师状态',
        value: state === 'sleeping' ? '睡眠' : '忙碌',
        role: (state === 'sleeping' ? 'default' : 'final') as BarRole,
      },
      { label: '已服务', value: String(served), role: 'frontier' as BarRole },
      { label: '已丢弃', value: String(lost), role: 'warn' as BarRole },
      { label: '等待人数', value: String(queueSize), role: 'pivot' as BarRole },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始：理发师睡眠，${chairs} 把等待椅`,
    en: `Init: barber asleep, ${chairs} waiting chairs`,
  });

  const hooks: BarberHooks = {
    onArrive: (_c, accepted) => {
      if (!accepted) lost++;
    },
    onWake: () => {
      state = 'busy';
    },
    onStartCut: (c) => {
      state = 'busy';
      currentId = c.id;
      served++;
    },
    onFinishCut: (_c) => {
      currentId = -1;
    },
    onSleep: () => {
      state = 'sleeping';
    },
  };

  // 为每步录制一帧，逐事件模拟
  const sorted = [...customers].sort((a, b) => a.arrival - b.arrival || a.id - b.id);
  for (const c of sorted) {
    // 模拟到此顾客到达前：先重放已发生事件（简化——直接用整体模拟的状态）
    void c;
  }

  // 整体模拟一次，期间钩子更新局部状态；为得到逐步帧，分多次模拟
  // 简化：在整体模拟的钩子中直接 snapshot
  const liveHooks: BarberHooks = {
    onArrive: (c, accepted) => {
      hooks.onArrive?.(c, accepted);
      snapshot({
        zh: accepted ? `顾客 ${c.id} 到达并被接收` : `顾客 ${c.id} 到达，椅子满，丢弃`,
        en: accepted
          ? `Customer ${c.id} arrives, accepted`
          : `Customer ${c.id} arrives, chairs full, lost`,
      });
    },
    onWake: (t) => {
      hooks.onWake?.(t);
      snapshot({ zh: `理发师被唤醒（t=${t}）`, en: `Barber woken (t=${t})` });
    },
    onStartCut: (c, t) => {
      hooks.onStartCut?.(c, t);
      snapshot({
        zh: `开始为顾客 ${c.id} 理发（t=${t}）`,
        en: `Start cutting customer ${c.id} (t=${t})`,
      });
    },
    onFinishCut: (c, t) => {
      hooks.onFinishCut?.(c, t);
      snapshot({
        zh: `顾客 ${c.id} 理发完成（t=${t}）`,
        en: `Customer ${c.id} cut finished (t=${t})`,
      });
    },
    onSleep: (t) => {
      hooks.onSleep?.(t);
      snapshot({ zh: `理发师入睡（t=${t}）`, en: `Barber sleeps (t=${t})` });
    },
  };

  // 因 simulateBarber 的钩子在状态推进中触发，但局部 queueSize 我们没跟踪
  // 这里单独跟踪队列大小
  let qSize = 0;
  const trackedHooks: BarberHooks = {
    onArrive: (c, accepted) => {
      if (accepted && state === 'busy') qSize++;
      liveHooks.onArrive?.(c, accepted);
    },
    onStartCut: (c, t) => {
      // 若来自队列，qSize--
      if (qSize > 0) qSize--;
      queueSize = qSize;
      liveHooks.onStartCut?.(c, t);
    },
    onFinishCut: (c, t) => {
      liveHooks.onFinishCut?.(c, t);
    },
    onWake: (t) => liveHooks.onWake?.(t),
    onSleep: (t) => {
      queueSize = 0;
      liveHooks.onSleep?.(t);
    },
  };

  simulateBarber(customers, chairs, trackedHooks);

  // 终态
  rec
    .begin({
      zh: `完成：服务 ${served} 人，丢弃 ${lost} 人`,
      en: `Done: ${served} served, ${lost} lost`,
    })
    .setBars(
      Array.from({ length: chairs + 1 }, (_, i) => ({
        value: 0,
        role: 'final' as BarRole,
        label: i === 0 ? '理发椅:空' : `椅${i}:空`,
      })),
    )
    .setAux([
      { label: '已服务', value: String(served), role: 'final' as BarRole },
      { label: '已丢弃', value: String(lost), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
