// =============================================================================
// 工作窃取 · 录制帧序列
// 用 setAux 展示各 worker 的 deque 内容与统计；setBars 展示各 worker 队列长度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateWorkStealing, type WsEvent, type WsHooks, type WsStats } from './impl.ts';

export const DEFAULT_N_WORKERS = 3;

export function defaultEvents(): WsEvent[] {
  return [
    { type: 'push', worker: 0, taskId: 101 },
    { type: 'push', worker: 0, taskId: 102 },
    { type: 'push', worker: 0, taskId: 103 },
    { type: 'pop', worker: 0 }, // 取 103（LIFO）
    { type: 'steal', worker: 1 }, // 偷 101（尾部）
    { type: 'steal', worker: 2 }, // 偷 102（尾部）
    { type: 'pop', worker: 0 }, // 空
  ];
}

interface TraceOptions {
  nWorkers: number;
  events: WsEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const nWorkers = opts.nWorkers ?? DEFAULT_N_WORKERS;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();

  let deques: number[][] = Array.from({ length: nWorkers }, () => []);
  let stats: WsStats = { pushes: 0, pops: 0, stealAttempts: 0, stealSuccesses: 0 };

  const snapshot = (note: { zh: string; en: string }): void => {
    const maxSize = Math.max(1, ...deques.map((d) => d.length));
    const bars = deques.map((d, i) => ({
      value: d.length,
      role:
        d.length === 0
          ? ('warn' as BarRole)
          : d.length === maxSize
            ? ('pivot' as BarRole)
            : ('default' as BarRole),
      label: `W${i}[${d.length}]`,
    }));
    const aux = [
      ...deques.map((d, i) => ({
        label: `W${i} deque`,
        value: d.length ? d.join(',') : '∅',
        role: d.length === 0 ? ('warn' as BarRole) : ('frontier' as BarRole),
      })),
      { label: 'push', value: String(stats.pushes), role: 'default' as BarRole },
      { label: 'pop', value: String(stats.pops), role: 'frontier' as BarRole },
      {
        label: 'steal(成功/尝试)',
        value: `${stats.stealSuccesses}/${stats.stealAttempts}`,
        role: 'pivot' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始化：${nWorkers} 个 worker，各持空 deque`,
    en: `Init: ${nWorkers} workers, empty deques`,
  });

  const hooks: WsHooks = {};

  // 逐事件模拟，每事件后录一帧
  for (let i = 0; i < events.length; i++) {
    const result = simulateWorkStealing(nWorkers, events.slice(0, i + 1), hooks);
    deques = result.deques;
    stats = result.stats;
    const ev = events[i]!;
    const actionZh =
      ev.type === 'push'
        ? `W${ev.worker} push 任务 ${ev.taskId} 到头部`
        : ev.type === 'pop'
          ? `W${ev.worker} pop 头部（LIFO）`
          : `W${ev.worker} 尝试 steal 尾部`;
    const actionEn =
      ev.type === 'push'
        ? `W${ev.worker} push task ${ev.taskId} to head`
        : ev.type === 'pop'
          ? `W${ev.worker} pop head (LIFO)`
          : `W${ev.worker} steal from tail`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  // 终态
  rec
    .begin({
      zh: `完成：push ${stats.pushes}，pop ${stats.pops}，steal 成功 ${stats.stealSuccesses}/${stats.stealAttempts}`,
      en: `Done: push ${stats.pushes}, pop ${stats.pops}, steal ${stats.stealSuccesses}/${stats.stealAttempts}`,
    })
    .setBars(
      Array.from({ length: nWorkers }, (_, i) => ({
        value: deques[i]!.length,
        role: 'final' as BarRole,
        label: `W${i}[${deques[i]!.length}]`,
      })),
    )
    .setAux([
      { label: 'push', value: String(stats.pushes), role: 'final' as BarRole },
      { label: 'pop', value: String(stats.pops), role: 'final' as BarRole },
      {
        label: 'steal(成功/尝试)',
        value: `${stats.stealSuccesses}/${stats.stealAttempts}`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
