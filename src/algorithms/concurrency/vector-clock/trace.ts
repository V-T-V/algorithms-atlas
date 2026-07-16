// =============================================================================
// 向量时钟 · 录制帧序列
// 用 setAux 展示各进程向量、用 setArray 展示事件序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateVectorClock, type VCEvent, type VectorClockHooks } from './impl.ts';

/** 默认演示：3 进程，含一对并发事件。 */
export function defaultEvents(): { nProc: number; events: VCEvent[] } {
  return {
    nProc: 3,
    events: [
      { proc: 0, type: 'local' }, // V0=[1,0,0]
      { proc: 1, type: 'local' }, // V1=[0,1,0]  与 V0 并发
      { proc: 0, type: 'send', msgId: 'm1' }, // V0=[2,0,0]
      { proc: 2, type: 'receive', msgId: 'm1' }, // V2=[2,0,1]
      { proc: 1, type: 'send', msgId: 'm2' }, // V1=[0,2,0]
      { proc: 2, type: 'receive', msgId: 'm2' }, // V2=[2,2,2]
    ],
  };
}

interface TraceOptions {
  nProc: number;
  events: VCEvent[];
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const def = defaultEvents();
  const nProc = opts.nProc ?? def.nProc;
  const events = opts.events ?? def.events;
  const rec = new TraceRecorder();

  const vectors = Array.from({ length: nProc }, () => new Array<number>(nProc).fill(0));
  const log: Array<{ proc: number; type: string; vector: number[] }> = [];

  const snapshot = (note: { zh: string; en: string }, highlightProc?: number): void => {
    rec
      .begin(note)
      .setAux([
        ...vectors.map((v, p) => ({
          label: `P${p}`,
          value: `[${v.join(',')}]`,
          role: (p === highlightProc
            ? 'swap'
            : v.some((x) => x > 0)
              ? 'compare'
              : 'default') as BarRole,
        })),
        {
          label: '事件序列',
          value: log.map((e) => `P${e.proc}.${e.type}@[${e.vector.join(',')}]`).join(' | '),
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
  };

  snapshot({
    zh: `初始化：${nProc} 进程，向量全 0`,
    en: `Init: ${nProc} processes, all-zero vectors`,
  });

  const hooks: VectorClockHooks = {
    onEvent: (p, type, newVector, msgId) => {
      vectors[p] = [...newVector];
      log.push({ proc: p, type, vector: [...newVector] });
      const noteZh =
        type === 'local'
          ? `P${p} 本地事件 → [${newVector.join(',')}]`
          : type === 'send'
            ? `P${p} 发送 ${msgId} → [${newVector.join(',')}]`
            : `P${p} 接收 ${msgId} → 逐维 max 后自增 [${newVector.join(',')}]`;
      const noteEn =
        type === 'local'
          ? `P${p} local event → [${newVector.join(',')}]`
          : type === 'send'
            ? `P${p} sends ${msgId} → [${newVector.join(',')}]`
            : `P${p} receives ${msgId} → per-dim max then +1 [${newVector.join(',')}]`;
      snapshot({ zh: noteZh, en: noteEn }, p);
    },
  };

  simulateVectorClock(nProc, events, hooks);

  rec
    .begin({
      zh: '完成：可比较向量判断因果，不可比较则为并发',
      en: 'Done: comparable vectors imply causality; incomparable means concurrent',
    })
    .setAux([
      ...vectors.map((v, p) => ({
        label: `P${p} 最终`,
        value: `[${v.join(',')}]`,
        role: 'final' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
