// =============================================================================
// Lamport 逻辑时钟 · 录制帧序列
// 用 setAux 展示各进程时钟、用 setBars 展示时钟值、用 setArray 展示事件序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateLamport, type LamportEvent, type LamportHooks } from './impl.ts';

/** 默认演示：3 个进程，P0 send→P1 receive, P1 send→P2 receive。 */
export function defaultEvents(): { nProc: number; events: LamportEvent[] } {
  return {
    nProc: 3,
    events: [
      { proc: 0, type: 'local' }, // P0: 1
      { proc: 0, type: 'send', msgId: 'm1' }, // P0: 2
      { proc: 1, type: 'local' }, // P1: 1
      { proc: 1, type: 'receive', msgId: 'm1' }, // P1: max(1,2)+1 = 3
      { proc: 1, type: 'send', msgId: 'm2' }, // P1: 4
      { proc: 2, type: 'receive', msgId: 'm2' }, // P2: max(0,4)+1 = 5
      { proc: 0, type: 'local' }, // P0: 3
    ],
  };
}

interface TraceOptions {
  nProc: number;
  events: LamportEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultEvents();
  const nProc = opts.nProc ?? def.nProc;
  const events = opts.events ?? def.events;
  const rec = new TraceRecorder();

  const clocks = new Array<number>(nProc).fill(0);
  const eventLog: Array<{ proc: number; type: string; clock: number; msgId?: string }> = [];

  const snapshot = (note: { zh: string; en: string }, highlightProc?: number): void => {
    rec
      .begin(note)
      .setAux([
        ...clocks.map((c, p) => ({
          label: `P${p} 时钟`,
          value: String(c),
          role: (p === highlightProc ? 'swap' : c > 0 ? 'compare' : 'default') as BarRole,
        })),
        {
          label: '事件序列',
          value: eventLog
            .map((e) => `P${e.proc}.${e.type}${e.msgId ? `(${e.msgId})` : ''}@${e.clock}`)
            .join(' | '),
          role: 'frontier' as BarRole,
        },
      ])
      .setBars(
        clocks.map((c, p) => ({
          value: c,
          role: (p === highlightProc ? 'swap' : c > 0 ? 'compare' : 'default') as BarRole,
          label: `P${p}:${c}`,
        })),
      )
      .commit();
  };

  snapshot({
    zh: `初始化：${nProc} 个进程时钟均为 0`,
    en: `Init: ${nProc} processes, all clocks 0`,
  });

  const hooks: LamportHooks = {
    onTick: (p, type, newClock, msgId, sentTs) => {
      clocks[p] = newClock;
      eventLog.push({ proc: p, type, clock: newClock, msgId });
      const noteZh =
        type === 'local'
          ? `P${p} 本地事件 → C=${newClock}`
          : type === 'send'
            ? `P${p} 发送 ${msgId} → C=${newClock}`
            : `P${p} 接收 ${msgId}(ts=${sentTs}) → max(C,${sentTs})+1 = ${newClock}`;
      const noteEn =
        type === 'local'
          ? `P${p} local event → C=${newClock}`
          : type === 'send'
            ? `P${p} sends ${msgId} → C=${newClock}`
            : `P${p} receives ${msgId}(ts=${sentTs}) → max(C,${sentTs})+1 = ${newClock}`;
      snapshot({ zh: noteZh, en: noteEn }, p);
    },
  };

  simulateLamport(nProc, events, hooks);

  rec
    .begin({ zh: '完成：所有事件已编号', en: 'Done: all events timestamped' })
    .setAux([
      ...clocks.map((c, p) => ({
        label: `P${p} 时钟`,
        value: String(c),
        role: 'final' as BarRole,
      })),
    ])
    .setBars(clocks.map((c, p) => ({ value: c, role: 'final' as BarRole, label: `P${p}:${c}` })))
    .commit();

  return rec.build();
}
