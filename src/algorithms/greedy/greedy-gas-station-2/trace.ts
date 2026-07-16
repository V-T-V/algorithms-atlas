// 加油站 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyGasStation2, type GreedyGasStation2Hooks } from './impl.ts';

export const DEFAULT_INPUT = { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] };

export function buildTrace(input: { gas: number[]; cost: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { gas, cost } = input;
  const net = gas.map((g, i) => g - cost[i]!);

  rec
    .begin({
      zh: `油 [${gas.join(',')}]，耗 [${cost.join(',')}]`,
      en: `gas [${gas.join(',')}], cost [${cost.join(',')}]`,
    })
    .setBars(net.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: GreedyGasStation2Hooks = {
    onStation: (index, n, total) => {
      rec
        .begin({
          zh: `站 ${index} 净 ${n}，总 ${total}`,
          en: `station ${index} net ${n}, total ${total}`,
        })
        .setArray(
          net,
          net.map((_, i) => (i === index ? 'compare' : 'default') as BarRole),
          [{ index, label: 'i' }],
        )
        .commit();
    },
    onAdvanceStart: (newStart) => {
      rec
        .begin({ zh: `油箱负，起点 → ${newStart}`, en: `tank negative, start -> ${newStart}` })
        .setAux([{ label: 'newStart', value: String(newStart), role: 'warn' as BarRole }])
        .commit();
    },
  };

  const result = greedyGasStation2(gas, cost, hooks);

  rec
    .begin({
      zh: `完成：起点 ${result === -1 ? '无解' : result}`,
      en: `Done: start ${result === -1 ? 'none' : result}`,
    })
    .setBars([{ value: result < 0 ? 0 : result, role: 'final' as BarRole }])
    .setAux([{ label: '起点', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
