// Peterson n 线程 · 录制

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulatePetersonN } from './impl.ts';

export const DEFAULT_N_THREADS = 4;
export const DEFAULT_ORDER = [0, 3, 1, 2];

export function buildTrace(opts: { nThreads?: number; order?: number[] } = {}): Frame[] {
  const nThreads = opts.nThreads ?? DEFAULT_N_THREADS;
  const order = opts.order ?? DEFAULT_ORDER;
  const rec = new TraceRecorder();
  let inCs: number[] = [];
  let levelCount = 0;

  const snap = (
    note: { zh: string; en: string },
    levels: Array<Array<{ flag: boolean[]; victim: number; holder: number }>>,
  ): void => {
    levelCount = levels.length;
    const bars = Array.from({ length: nThreads }, (_, i) => ({
      value: 1,
      role: (inCs.includes(i) ? 'final' : 'default') as BarRole,
      label: `T${i}${inCs.includes(i) ? '(CS)' : ''}`,
    }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '临界区',
        value: inCs.length ? inCs.map((t) => `T${t}`).join(',') : '∅',
        role: 'final' as BarRole,
      },
    ];
    levels.forEach((arr, l) => {
      arr.forEach((node, k) => {
        aux.push({
          label: `L${l}-N${k}`,
          value: `f=[${node.flag.map(Number).join(',')}] v=${node.victim} h=${node.holder}`,
          role: 'compare' as BarRole,
        });
      });
    });
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snap({ zh: `${nThreads} 线程锦标赛树初始化`, en: `Init ${nThreads}-thread tournament tree` }, []);

  const steps = simulatePetersonN(nThreads, order);
  for (const s of steps) {
    inCs = [...s.inCs];
    snap(
      {
        zh: s.thread >= 0 ? `T${s.thread} ${s.phase}` : s.phase,
        en: s.thread >= 0 ? `T${s.thread} ${s.phase}` : s.phase,
      },
      s.levels,
    );
  }

  void levelCount;
  rec
    .begin({ zh: '完成：树形 Peterson 互斥', en: 'Done: tree Peterson mutual exclusion' })
    .setBars(
      Array.from({ length: nThreads }, (_, i) => ({
        value: 1,
        role: 'final' as BarRole,
        label: `T${i}`,
      })),
    )
    .setAux([{ label: '结果', value: 'O(log n) 进出', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
