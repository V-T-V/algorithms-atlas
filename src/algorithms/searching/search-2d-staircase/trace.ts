import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { staircaseSearch2D, type StaircaseHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];
export const DEFAULT_TARGET = 5;

export function buildTrace(
  input: number[][] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const grid = input.map((row) => row.map((v) => ({ v, role: 'default' as BarRole })));
  rec
    .begin({ zh: `在二维有序矩阵中查找 ${target}`, en: `Search ${target} in 2D sorted matrix` })
    .setGrid(grid)
    .commit();
  const hooks: StaircaseHooks = {
    onStep: (r, c) => {
      const g = input.map((row, ri) =>
        row.map((v, ci) => ({
          v,
          role: (ri === r && ci === c ? 'compare' : 'default') as BarRole,
        })),
      );
      rec
        .begin({
          zh: `比较 [${r}][${c}] = ${input[r]![c]}`,
          en: `Compare [${r}][${c}] = ${input[r]![c]}`,
        })
        .setGrid(g)
        .commit();
    },
  };
  const [rr, cc] = staircaseSearch2D(input, target, hooks);
  const g = input.map((row, ri) =>
    row.map((v, ci) => ({ v, role: (ri === rr && ci === cc ? 'final' : 'default') as BarRole })),
  );
  rec
    .begin(
      rr >= 0
        ? { zh: `命中 [${rr}][${cc}]`, en: `Found [${rr}][${cc}]` }
        : { zh: `未找到`, en: `Not found` },
    )
    .setGrid(g)
    .commit();
  return rec.build();
}
