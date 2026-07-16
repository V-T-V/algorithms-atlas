// =============================================================================
// 逻辑时钟（通用框架）· 录制帧序列
// 用同一事件序列分别跑标量(Lamport)与向量两种规则，对比输出。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  runClock,
  scalarRules,
  vectorRules,
  scalarValue,
  vectorValue,
  type LCEvent,
  type LCHooks,
  type ClockState,
} from './impl.ts';

export function defaultEvents(): { nProc: number; events: LCEvent[] } {
  return {
    nProc: 3,
    events: [
      { proc: 0, type: 'local' },
      { proc: 1, type: 'local' },
      { proc: 0, type: 'send', msgId: 'm1' },
      { proc: 2, type: 'receive', msgId: 'm1' },
      { proc: 1, type: 'send', msgId: 'm2' },
      { proc: 2, type: 'receive', msgId: 'm2' },
    ],
  };
}

interface TraceOptions {
  nProc: number;
  events: LCEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultEvents();
  const nProc = opts.nProc ?? def.nProc;
  const events = opts.events ?? def.events;
  const rec = new TraceRecorder();

  let scalarClocks: ClockState = scalarRules(nProc).init();
  let vectorClocks: ClockState = vectorRules(nProc).init();

  const snapshot = (note: { zh: string; en: string }): void => {
    const scalarArr = Array.from({ length: nProc }, (_, p) => scalarValue(scalarClocks, p));
    const vecStr = Array.from(
      { length: nProc },
      (_, p) => `P${p}:[${vectorValue(vectorClocks, p).join(',')}]`,
    ).join('  ');
    rec
      .begin(note)
      .setAux([
        {
          label: 'Lamport 标量',
          value: `[${scalarArr.join(',')}]`,
          role: 'compare' as BarRole,
        },
        {
          label: '向量时钟',
          value: vecStr,
          role: 'frontier' as BarRole,
        },
      ])
      .setBars(
        scalarArr.map((c, p) => ({
          value: c,
          role: (c > 0 ? 'compare' : 'default') as BarRole,
          label: `P${p}:${c}`,
        })),
      )
      .commit();
  };

  snapshot({
    zh: `初始化：${nProc} 进程，标量与向量时钟均归零`,
    en: `Init: ${nProc} processes, scalar and vector clocks zeroed`,
  });

  const sHooks: LCHooks = {
    onEvent: (_p, _t, c) => {
      scalarClocks = c;
    },
  };
  const vHooks: LCHooks = {
    onEvent: (_p, _t, c) => {
      vectorClocks = c;
    },
  };

  // 逐事件分别推进两类时钟并录制
  for (const ev of events) {
    runClock(scalarRules(nProc), [ev], sHooks);
    runClock(vectorRules(nProc), [ev], vHooks);
    const actionZh =
      ev.type === 'local'
        ? `P${ev.proc} 本地事件`
        : ev.type === 'send'
          ? `P${ev.proc} 发送 ${ev.msgId}`
          : `P${ev.proc} 接收 ${ev.msgId}`;
    const actionEn =
      ev.type === 'local'
        ? `P${ev.proc} local event`
        : ev.type === 'send'
          ? `P${ev.proc} sends ${ev.msgId}`
          : `P${ev.proc} receives ${ev.msgId}`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  const finalScalar = Array.from({ length: nProc }, (_, p) => scalarValue(scalarClocks, p));
  rec
    .begin({
      zh: '完成：标量时钟给出偏序，向量时钟可检测并发',
      en: 'Done: scalar gives partial order; vector can detect concurrency',
    })
    .setAux([
      { label: 'Lamport 最终', value: `[${finalScalar.join(',')}]`, role: 'final' as BarRole },
      {
        label: '向量最终',
        value: Array.from(
          { length: nProc },
          (_, p) => `P${p}:[${vectorValue(vectorClocks, p).join(',')}]`,
        ).join('  '),
        role: 'final' as BarRole,
      },
    ])
    .setBars(
      finalScalar.map((c, p) => ({ value: c, role: 'final' as BarRole, label: `P${p}:${c}` })),
    )
    .commit();

  return rec.build();
}
