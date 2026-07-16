// Lamport 面包店算法 · 录制

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bakerySimulate } from './impl.ts';

export const DEFAULT_N_THREADS = 4;
export const DEFAULT_ORDER = [0, 2, 1, 3];

export function buildTrace(opts: { nThreads?: number; order?: number[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const order = opts.order ?? DEFAULT_ORDER;
  const rec = new TraceRecorder();

  let numbers = new Array(nThreads).fill(0);
  let choosing = new Array(nThreads).fill(false);
  let inCs: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: nThreads }, (_, i) => ({
          value: numbers[i]! === 0 ? 1 : numbers[i]! + 1,
          role: (inCs.includes(i)
            ? 'final'
            : numbers[i]! > 0
              ? 'compare'
              : choosing[i]
                ? 'warn'
                : 'default') as BarRole,
          label: `T${i}:#${numbers[i]}`,
        })),
      )
      .setAux([
        {
          label: '取号',
          value:
            numbers
              .map((n, i) => (n > 0 ? `T${i}=#${n}` : ''))
              .filter(Boolean)
              .join(' ') || '∅',
          role: 'compare' as BarRole,
        },
        {
          label: '临界区',
          value: inCs.length ? inCs.map((t) => `T${t}`).join(',') : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
  };

  snap({ zh: `${nThreads} 线程，准备取号`, en: `${nThreads} threads, ready to take tickets` });

  const steps = bakerySimulate(nThreads, order);
  for (const s of steps) {
    numbers = [...s.numbers];
    choosing = [...s.choosing];
    inCs = [...s.inCs];
    snap({ zh: `T${s.thread} ${s.phase}`, en: `T${s.thread} ${s.phase}` });
  }

  rec
    .begin({ zh: '完成：按 (号码,id) 顺序入临界区', en: 'Done: CS entered by (ticket,id) order' })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i}`,
      })),
    )
    .setAux([{ label: '结果', value: 'FIFO 公平、无饥饿', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
