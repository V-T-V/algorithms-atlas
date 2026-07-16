// =============================================================================
// 汇合点同步 · 录制帧序列
// 用 setAux 展示 aArrived / bArrived 信号量与两线程阶段；
// 用 setBars 展示两线程进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateRendezvous, type RendezvousHooks, type RendezvousStep } from './impl.ts';

/** 默认步骤：A 先 pre/arrive，B 后 pre/arrive，双方各自 proceed 通过。 */
export function defaultSteps(): RendezvousStep[] {
  return [
    { thread: 'A', action: 'pre' },
    { thread: 'A', action: 'arrive' },
    { thread: 'B', action: 'pre' },
    { thread: 'B', action: 'arrive' },
    { thread: 'A', action: 'proceed' },
    { thread: 'B', action: 'proceed' },
  ];
}

interface TraceOptions {
  steps: RendezvousStep[];
}

const phaseLabel = (p: 'idle' | 'pre' | 'arrived' | 'done'): string =>
  p === 'idle' ? '空闲' : p === 'pre' ? 'pre' : p === 'arrived' ? '已到达' : '通过';
const phaseRole = (p: 'idle' | 'pre' | 'arrived' | 'done'): BarRole =>
  p === 'done' ? 'final' : p === 'arrived' ? 'swap' : p === 'pre' ? 'compare' : 'default';

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const steps = opts.steps ?? defaultSteps();
  const rec = new TraceRecorder();

  let aArrived = 0;
  let bArrived = 0;
  let phaseA: 'idle' | 'pre' | 'arrived' | 'done' = 'idle';
  let phaseB: 'idle' | 'pre' | 'arrived' | 'done' = 'idle';
  let blockedA = false;
  let blockedB = false;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        {
          label: 'aArrived',
          value: String(aArrived),
          role: (aArrived > 0 ? 'swap' : 'default') as BarRole,
        },
        {
          label: 'bArrived',
          value: String(bArrived),
          role: (bArrived > 0 ? 'swap' : 'default') as BarRole,
        },
        {
          label: 'A 阶段',
          value: phaseLabel(phaseA) + (blockedA ? '(阻塞)' : ''),
          role: phaseRole(phaseA),
        },
        {
          label: 'B 阶段',
          value: phaseLabel(phaseB) + (blockedB ? '(阻塞)' : ''),
          role: phaseRole(phaseB),
        },
      ])
      .setBars([
        {
          value: phaseA === 'done' ? 2 : phaseA === 'arrived' ? 1 : phaseA === 'pre' ? 1 : 0,
          role: phaseRole(phaseA),
          label: `A:${phaseLabel(phaseA)}`,
        },
        {
          value: phaseB === 'done' ? 2 : phaseB === 'arrived' ? 1 : phaseB === 'pre' ? 1 : 0,
          role: phaseRole(phaseB),
          label: `B:${phaseLabel(phaseB)}`,
        },
      ])
      .commit();
  };

  snapshot({ zh: '初始化：aArrived=0, bArrived=0', en: 'Init: aArrived=0, bArrived=0' });

  const hooks: RendezvousHooks = {
    onPre: (t) => {
      if (t === 'A') phaseA = 'pre';
      else phaseB = 'pre';
    },
    onArrive: (t, _sem, v) => {
      if (t === 'A') {
        aArrived = v;
        phaseA = 'arrived';
      } else {
        bArrived = v;
        phaseB = 'arrived';
      }
    },
    onProceed: (t, _sem, v, blocked) => {
      if (t === 'A') {
        bArrived = v;
        blockedA = blocked;
        if (!blocked) phaseA = 'done';
      } else {
        aArrived = v;
        blockedB = blocked;
        if (!blocked) phaseB = 'done';
      }
      // 对方被唤醒时 proceed
      if (!blocked) {
        const other = t === 'A' ? 'B' : 'A';
        if (other === 'A' && blockedA) {
          blockedA = false;
          phaseA = 'done';
        } else if (other === 'B' && blockedB) {
          blockedB = false;
          phaseB = 'done';
        }
      }
    },
  };

  for (const step of steps) {
    simulateRendezvous([step], hooks);
    const actionZh =
      step.action === 'pre'
        ? `${step.thread} 执行 pre 阶段`
        : step.action === 'arrive'
          ? `${step.thread} signal 到达`
          : `${step.thread} wait 对方并 proceed`;
    const actionEn =
      step.action === 'pre'
        ? `${step.thread} runs pre phase`
        : step.action === 'arrive'
          ? `${step.thread} signals arrival`
          : `${step.thread} waits peer and proceeds`;
    snapshot({ zh: actionZh, en: actionEn });
  }

  rec
    .begin({ zh: '完成：双方都通过汇合点', en: 'Done: both threads passed the rendezvous' })
    .setAux([
      { label: 'aArrived', value: String(aArrived), role: 'final' as BarRole },
      { label: 'bArrived', value: String(bArrived), role: 'final' as BarRole },
      { label: 'A 阶段', value: '通过', role: 'final' as BarRole },
      { label: 'B 阶段', value: '通过', role: 'final' as BarRole },
    ])
    .setBars([
      { value: 2, role: 'final' as BarRole, label: 'A:通过' },
      { value: 2, role: 'final' as BarRole, label: 'B:通过' },
    ])
    .commit();

  return rec.build();
}
