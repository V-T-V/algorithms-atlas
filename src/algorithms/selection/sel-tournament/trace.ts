import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tournamentSelect, makeRng } from './impl.ts';

export const DEFAULT_FITNESS = [3, 7, 2, 9, 5, 1, 8, 4];
export const DEFAULT_K = 3;

export function buildTrace(opts: { fitness?: number[]; k?: number; seed?: number } = {}): Frame[] {
  const fitness = opts.fitness ?? DEFAULT_FITNESS;
  const k = opts.k ?? DEFAULT_K;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  let drawn: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        fitness.map((f, i) => ({
          value: f,
          role: (drawn.includes(i) ? 'compare' : 'default') as BarRole,
          label: `P${i}:${f}`,
        })),
      )
      .setAux([
        {
          label: '抽中',
          value: drawn.map((i) => `P${i}`).join(',') || '∅',
          role: 'compare' as BarRole,
        },
      ])
      .commit();
  };

  snap({
    zh: `种群适应度 n=${fitness.length}, k=${k}`,
    en: `Population n=${fitness.length}, k=${k}`,
  });

  const winner = tournamentSelect(fitness, k, makeRng(seed), {
    onDraw: (idx) => {
      drawn = [...idx];
      snap({
        zh: `抽取 ${idx.map((i) => `P${i}`).join(',')}`,
        en: `Draw ${idx.map((i) => `P${i}`).join(',')}`,
      });
    },
    onWinner: (idx, fit) => {
      snap({ zh: `胜者 P${idx} (fit=${fit})`, en: `Winner P${idx} (fit=${fit})` });
    },
  });

  rec
    .begin({ zh: `完成：胜者 P${winner}`, en: `Done: winner P${winner}` })
    .setBars(
      fitness.map((f, i) => ({
        value: f,
        role: (i === winner ? 'final' : 'default') as BarRole,
        label: String(f),
      })),
    )
    .setAux([
      { label: '胜者', value: `P${winner} fit=${fitness[winner]}`, role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
