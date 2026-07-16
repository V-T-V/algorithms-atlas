import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parallelMonteCarloPi, type WorkerResult } from './impl.ts';

export const DEFAULT_TOTAL = 4000;
export const DEFAULT_WORKERS = 4;

export function buildTrace(
  opts: { total?: number; workers?: number; seed?: number } = {},
): Frame[] {
  const total = opts.total ?? DEFAULT_TOTAL;
  const workers = opts.workers ?? DEFAULT_WORKERS;
  const seed = opts.seed ?? 42;
  const rec = new TraceRecorder();
  const perWorker: WorkerResult[] = [];
  let piEstimate = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const totalHits = perWorker.reduce((a, r) => a + r.hits, 0);
    const totalThrown = perWorker.reduce((a, r) => a + r.thrown, 0);
    rec
      .begin(note)
      .setBars(
        Array.from({ length: workers }, (_, i) => {
          const r = perWorker.find((x) => x.workerId === i);
          return {
            value: r ? r.hits : 0,
            role: (r ? 'final' : 'default') as BarRole,
            label: `W${i}:${r ? r.hits : 0}`,
          };
        }),
      )
      .setAux([
        { label: '总命中/总投点', value: `${totalHits}/${totalThrown}`, role: 'final' as BarRole },
        {
          label: '当前 π 估计',
          value: totalThrown > 0 ? ((4 * totalHits) / totalThrown).toFixed(4) : '—',
          role: 'pivot' as BarRole,
        },
      ])
      .commit();
  };

  snap({
    zh: `初始化：${workers} 工作线程，共 ${total} 投点`,
    en: `Init: ${workers} workers, ${total} throws`,
  });

  parallelMonteCarloPi(total, workers, seed, {
    onWorkerDone: (r) => {
      perWorker.push(r);
      snap({
        zh: `W${r.workerId} 完成：${r.hits}/${r.thrown}`,
        en: `W${r.workerId} done: ${r.hits}/${r.thrown}`,
      });
    },
    onReduce: (hits, thrown) => {
      piEstimate = (4 * hits) / thrown;
    },
  });

  rec
    .begin({ zh: `完成：π ≈ ${piEstimate.toFixed(4)}`, en: `Done: π ≈ ${piEstimate.toFixed(4)}` })
    .setAux([
      { label: '最终 π', value: piEstimate.toFixed(4), role: 'final' as BarRole },
      {
        label: '误差',
        value: Math.abs(piEstimate - Math.PI).toFixed(4),
        role: 'compare' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
