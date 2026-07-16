import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lasVegasMatching, makeRng } from './impl.ts';

export const DEFAULT_EDGES: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 3],
  [3, 3],
  [3, 0],
];

export function buildTrace(
  opts: { nLeft?: number; nRight?: number; edges?: Array<[number, number]>; seed?: number } = {},
): Frame[] {
  const nLeft = opts.nLeft ?? 4;
  const nRight = opts.nRight ?? 4;
  const edges = opts.edges ?? DEFAULT_EDGES;
  const seed = opts.seed ?? 1;
  const rec = new TraceRecorder();
  let matchL = new Map<number, number>();

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: nLeft }, (_, l) => ({
          value: matchL.has(l) ? matchL.get(l)! + 1 : 0,
          role: (matchL.has(l) ? 'final' : 'default') as BarRole,
          label: `L${l}→R${matchL.get(l) ?? '-'}`,
        })),
      )
      .setAux([
        {
          label: '匹配',
          value: [...matchL.entries()].map(([l, r]) => `L${l}-R${r}`).join(' ') || '∅',
          role: 'final' as BarRole,
        },
        { label: '匹配数', value: matchL.size.toString(), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始 ${nLeft}+${nRight} 二分图`, en: `Init ${nLeft}+${nRight} bipartite graph` });

  const result = lasVegasMatching(nLeft, nRight, edges, makeRng(seed), {
    onAugment: (path) => {
      matchL.set(path[0]!, path[1]!);
      snap({ zh: `增广 L${path[0]}-R${path[1]}`, en: `Augment L${path[0]}-R${path[1]}` });
    },
  });

  matchL = result;
  rec
    .begin({ zh: `完成：匹配 ${result.size} 对`, en: `Done: matched ${result.size} pairs` })
    .setAux([{ label: '匹配大小', value: result.size.toString(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
