import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { EventBus } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bus = new EventBus({
    onEmit: (e, c) =>
      rec
        .begin({ zh: `emit '${e}' → ${c} 监听器`, en: `emit '${e}' → ${c}` })
        .setAux([{ label: 'listeners', value: String(c), role: 'final' as BarRole }])
        .commit(),
  });
  bus.on('click', () => {});
  bus.on('click', () => {});
  bus.emit('click', { x: 1 });
  return rec.build();
}
