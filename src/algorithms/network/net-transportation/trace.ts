// 运输问题 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { transportation, type TransportationInput } from './impl.ts';

export const DEFAULT_INPUT: TransportationInput = {
  supply: [
    { id: 0, amount: 20 },
    { id: 1, amount: 30 },
  ],
  demand: [
    { id: 0, amount: 10 },
    { id: 1, amount: 25 },
    { id: 2, amount: 15 },
  ],
  cost: [
    [3, 5, 7],
    [6, 4, 2],
  ],
};

export function buildTrace(input: TransportationInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = transportation(input);

  rec
    .begin({
      zh: `${input.supply.length} 供应 → ${input.demand.length} 需求`,
      en: `${input.supply.length} supply -> ${input.demand.length} demand`,
    })
    .setAux([
      ...input.supply.map((s) => ({
        label: `供${s.id}`,
        value: String(s.amount),
        role: 'pivot' as BarRole,
      })),
      ...input.demand.map((d) => ({
        label: `需${d.id}`,
        value: String(d.amount),
        role: 'final' as BarRole,
      })),
    ])
    .commit();

  rec
    .begin({
      zh: `最小运费 = ${result.totalCost}，运输量 ${result.totalShipped}`,
      en: `Min cost = ${result.totalCost}, shipped ${result.totalShipped}`,
    })
    .setAux(
      input.supply.flatMap((s, i) =>
        input.demand.map((d, j) => ({
          label: `${s.id}→${d.id}`,
          value: String(result.plan[i]![j]!),
          role: 'frontier' as BarRole,
        })),
      ),
    )
    .commit();
  return rec.build();
}
