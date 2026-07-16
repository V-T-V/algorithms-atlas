import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  SimpleCoffee,
  MilkDecorator,
  SugarDecorator,
  CreamDecorator,
  type Coffee,
} from './impl.ts';

interface TraceInput {
  layers: string[];
}
export const DEFAULT_INPUT: TraceInput = { layers: ['milk', 'sugar', 'cream'] };

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const hooks = {
    onCompute: (layer: string, partialCost: number, partialDesc: string) =>
      rec
        .begin({
          zh: `加 ${layer}：累计 ${partialCost}（${partialDesc}）`,
          en: `Add ${layer}: cumulative ${partialCost} (${partialDesc})`,
        })
        .setAux([
          { label: '层', value: layer, role: 'compare' as BarRole },
          { label: '累计', value: String(partialCost), role: 'frontier' as BarRole },
        ])
        .commit(),
    onResult: (totalCost: number, fullDesc: string) =>
      rec
        .begin({ zh: `最终：${fullDesc} = ${totalCost}`, en: `Final: ${fullDesc} = ${totalCost}` })
        .setAux([{ label: '总价', value: String(totalCost), role: 'final' as BarRole }])
        .commit(),
  };
  let coffee: Coffee = new SimpleCoffee();
  rec
    .begin({
      zh: `基础 ${coffee.desc()} = ${coffee.cost()}`,
      en: `Base ${coffee.desc()} = ${coffee.cost()}`,
    })
    .setAux([{ label: '基础价', value: String(coffee.cost()), role: 'pivot' as BarRole }])
    .commit();
  for (const layer of input.layers) {
    if (layer === 'milk') coffee = new MilkDecorator(coffee, hooks);
    else if (layer === 'sugar') coffee = new SugarDecorator(coffee, hooks);
    else if (layer === 'cream') coffee = new CreamDecorator(coffee, hooks);
    const c = coffee.cost();
    hooks.onResult?.(c, coffee.desc());
  }
  return rec.build();
}
