import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WeatherStation, DisplayObserver } from './impl.ts';

interface TraceInput {
  temps: number[];
  detachAfter?: number;
}
export const DEFAULT_INPUT: TraceInput = { temps: [20, 22, 25], detachAfter: 1 };

export function buildTrace(input: TraceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const station = new WeatherStation({
    onAttach: (id, count) =>
      rec
        .begin({
          zh: `订阅 ${id}（当前 ${count} 个观察者）`,
          en: `Attach ${id} (${count} observers)`,
        })
        .setAux([{ label: '观察者数', value: String(count), role: 'pivot' as BarRole }])
        .commit(),
    onDetach: (id, count) =>
      rec
        .begin({
          zh: `退订 ${id}（剩 ${count} 个观察者）`,
          en: `Detach ${id} (${count} observers)`,
        })
        .setAux([{ label: '观察者数', value: String(count), role: 'compare' as BarRole }])
        .commit(),
    onNotify: (id, t) =>
      rec
        .begin({ zh: `通知 ${id}：温度=${t}`, en: `Notify ${id}: temp=${t}` })
        .setAux([
          { label: '温度', value: String(t), role: 'frontier' as BarRole },
          { label: '观察者', value: id, role: 'compare' as BarRole },
        ])
        .commit(),
    onStateChange: (t) =>
      rec
        .begin({ zh: `主题温度变化 → ${t}`, en: `Subject temperature changed → ${t}` })
        .setAux([{ label: '温度', value: String(t), role: 'final' as BarRole }])
        .commit(),
  });
  const d1 = new DisplayObserver('display-1');
  const d2 = new DisplayObserver('display-2');
  station.attach(d1);
  station.attach(d2);
  for (let i = 0; i < input.temps.length; i++) {
    station.setTemperature(input.temps[i]!);
    if (input.detachAfter !== undefined && i === input.detachAfter) station.detach(d2);
  }
  rec
    .begin({
      zh: `display-1 末次读数=${d1.lastReading}, display-2 末次读数=${d2.lastReading}`,
      en: `display-1 last=${d1.lastReading}, display-2 last=${d2.lastReading}`,
    })
    .setAux([
      { label: 'd1', value: String(d1.lastReading), role: 'final' as BarRole },
      { label: 'd2', value: String(d2.lastReading), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
