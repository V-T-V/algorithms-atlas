// 加油站停靠 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyRefuelingStops, type GreedyRefuelingStopsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  target: 100,
  startFuel: 10,
  stations: [
    [10, 60],
    [20, 30],
    [30, 30],
    [60, 40],
  ] as ReadonlyArray<readonly [number, number]>,
};

export function buildTrace(
  input: {
    target: number;
    startFuel: number;
    stations: ReadonlyArray<readonly [number, number]>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { target, startFuel, stations } = input;

  rec
    .begin({
      zh: `终点 ${target}，初始油 ${startFuel}，${stations.length} 站`,
      en: `target ${target}, startFuel ${startFuel}, ${stations.length} stations`,
    })
    .setBars(stations.map((s) => ({ value: s[1], role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyRefuelingStopsHooks = {
    onRefuel: (idx, added, tank) => {
      rec
        .begin({
          zh: `在站 ${idx} 加 ${added}，油箱 ${tank}`,
          en: `Refuel ${added} at station ${idx}, tank ${tank}`,
        })
        .setBars([{ value: tank, role: 'final' as BarRole }])
        .setAux([{ label: 'stops+', value: String(idx), role: 'compare' }])
        .commit();
    },
  };

  const result = greedyRefuelingStops(target, startFuel, stations, hooks);

  rec
    .begin({
      zh: `完成：${result === -1 ? '无法到达' : result + ' 次加油'}`,
      en: `Done: ${result === -1 ? 'impossible' : result + ' stops'}`,
    })
    .setBars([{ value: result < 0 ? 0 : result, role: 'final' as BarRole }])
    .setAux([{ label: '次数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
