import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventBus } from './impl.ts';
export const DEFAULT_INPUT: any = [
  { type: 'click', payload: 1 },
  { type: 'click', payload: 2 },
  { type: 'hover', payload: 3 },
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '事件驱动', en: 'Event-Driven' }).commit();
  const bus = new EventBus();
  bus.subscribe('click', (e) =>
    rec
      .begin({ zh: 'click 处理 ' + e.payload, en: 'click' })
      .setAux([{ label: 'payload', value: String(e.payload), role: 'compare' as BarRole }])
      .commit(),
  );
  bus.subscribe('hover', (e) =>
    rec
      .begin({ zh: 'hover 处理 ' + e.payload, en: 'hover' })
      .setAux([{ label: 'payload', value: String(e.payload), role: 'final' as BarRole }])
      .commit(),
  );
  for (const e of input) bus.emit(e, { onEmit: (t, c) => void (t + c) });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
