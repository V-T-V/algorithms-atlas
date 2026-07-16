import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulateResourceHierarchy, type RhEvent } from './impl.ts';

export const DEFAULT_N = 5;
export function defaultEvents(): RhEvent[] {
  return [
    { philosopher: 0, action: 'dine' },
    { philosopher: 2, action: 'dine' },
    { philosopher: 1, action: 'dine' }, // 与 0 共享 F1，可能只拿到一叉
    { philosopher: 0, action: 'finish' },
    { philosopher: 1, action: 'finish' },
    { philosopher: 2, action: 'finish' },
  ];
}

export function buildTrace(opts: { n?: number; events?: RhEvent[] } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const events = opts.events ?? defaultEvents();
  const rec = new TraceRecorder();
  let forkOwner = new Array(n).fill(-1);
  let eating: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: n }, (_, f) => ({
          value: forkOwner[f]! === -1 ? 1 : 3,
          role: (forkOwner[f]! !== -1 ? 'swap' : 'default') as BarRole,
          label: `F${f}:${forkOwner[f]! === -1 ? '空' : 'P' + forkOwner[f]}`,
        })),
      )
      .setAux([
        {
          label: '进餐中',
          value: eating.length ? eating.map((p) => `P${p}`).join(',') : '∅',
          role: 'final' as BarRole,
        },
        {
          label: '叉归属',
          value: forkOwner.map((o, f) => `F${f}=${o === -1 ? '∅' : 'P' + o}`).join(' '),
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `${n} 个哲学家，资源层级`, en: `${n} philosophers, resource hierarchy` });

  for (const ev of events) {
    const steps = simulateResourceHierarchy(n, [ev]);
    const last = steps[steps.length - 1]!;
    forkOwner = [...last.forkOwner];
    eating = [...last.eating];
    snap({
      zh: `P${ev.philosopher} ${ev.action === 'dine' ? '就餐' : '结束'}`,
      en: `P${ev.philosopher} ${ev.action}`,
    });
  }

  rec
    .begin({ zh: '完成：无循环等待，无死锁', en: 'Done: no circular wait, no deadlock' })
    .setAux([{ label: '结果', value: '死锁避免', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
