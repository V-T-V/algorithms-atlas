// =============================================================================
// 便宜机票 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findCheapestPrice, type CheapestFlightsHooks } from './impl.ts';

export const DEFAULT_FLIGHTS: Array<[number, number, number]> = [
  [0, 1, 100],
  [1, 2, 100],
  [2, 0, 100],
  [1, 3, 600],
  [2, 3, 200],
];
export const DEFAULT_N = 4;
export const DEFAULT_SRC = 0;
export const DEFAULT_DST = 3;
export const DEFAULT_K = 1;

export function buildTrace(
  n: number = DEFAULT_N,
  flights: ReadonlyArray<[number, number, number]> = DEFAULT_FLIGHTS,
  src: number = DEFAULT_SRC,
  dst: number = DEFAULT_DST,
  k: number = DEFAULT_K,
): Frame[] {
  const rec = new TraceRecorder();

  const snap = (note: { zh: string; en: string }, dist: number[]): void => {
    const roles: BarRole[] = dist.map((d, i) =>
      i === src ? 'pivot' : i === dst ? 'final' : d === Infinity ? 'default' : 'frontier',
    );
    rec
      .begin(note)
      .setBars(
        dist.map((d, i) => ({
          value: d === Infinity ? 0 : d,
          role: roles[i]!,
          label: `${i}:${d === Infinity ? '∞' : d}`,
        })),
      )
      .setAux([{ label: 'src/dst/k', value: `${src}/${dst}/${k}`, role: 'pivot' }])
      .commit();
  };

  snap(
    { zh: `${n} 城 src=${src} dst=${dst} k=${k}`, en: `${n} cities src=${src} dst=${dst} k=${k}` },
    new Array(n).fill(Infinity),
  );

  const hooks: CheapestFlightsHooks = {
    onRound: (round, dist) =>
      snap({ zh: `第 ${round} 轮松弛后`, en: `After round ${round}` }, dist),
    onResult: (_t) => {},
  };

  const result = findCheapestPrice(n, flights, src, dst, k, hooks);

  rec
    .begin({
      zh: result < 0 ? '不可达' : `完成：${result}`,
      en: result < 0 ? 'Unreachable' : `Done: ${result}`,
    })
    .setAux([{ label: '票价 / price', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
